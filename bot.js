const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = '8252745688:AAES1pAHGqYQMq32N8invkUNp8VC_rrCKZo';

const API_BASE = 'https://apikey-vip.netlify.app/api/apisms1';
const DATA_DIR = path.join(__dirname, 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'keys.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function loadStorage() {
    ensureDataDir();
    try {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
            users: parsed.users || {},
            keys: parsed.keys || {},
        };
    } catch (error) {
        return { users: {}, keys: {} };
    }
}

const storage = loadStorage();

function persistStorage() {
    ensureDataDir();
    fs.writeFileSync(
        STORAGE_FILE,
        JSON.stringify(storage, null, 2),
        'utf-8'
    );
}

function getStoredKey(userId) {
    return storage.users[userId]?.apiKey || null;
}

function assignKeyToUser(userId, key, profile = {}) {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
        throw new Error('กรุณาส่งคีย์ที่ถูกต้อง (ไม่ใช่ค่าว่าง)');
    }

    const owner = storage.keys[trimmedKey];
    if (owner && owner !== userId) {
        return { status: 'conflict', owner };
    }

    const currentKey = storage.users[userId]?.apiKey || null;

    if (currentKey && currentKey !== trimmedKey) {
        delete storage.keys[currentKey];
    }

    const timestamp = new Date().toISOString();

    storage.users[userId] = {
        apiKey: trimmedKey,
        profile,
        updatedAt: timestamp,
    };
    storage.keys[trimmedKey] = userId;

    persistStorage();

    if (currentKey === trimmedKey) {
        return { status: 'unchanged' };
    }

    return { status: currentKey ? 'updated' : 'created' };
}

const MAIN_MENU = {
    reply_markup: {
        keyboard: [
            [{ text: '🚀 ยิงเบอร์' }],
            [{ text: '🔐 ใส่คีย์' }, { text: '🧮 เช็คโทเค็น' }],
        ],
        resize_keyboard: true,
    },
};

const bot = new Telegraf(BOT_TOKEN);
const sessions = new Map();

function getSession(ctx) {
    const id = ctx.from.id;
    if (!sessions.has(id)) {
        sessions.set(id, {
            apiKey: getStoredKey(id),
            step: null,
            pendingPhone: null,
            activeJob: false,
        });
    }
    return sessions.get(id);
}

function localizeApiMessage(message) {
    if (!message) {
        return null;
    }

    const text = typeof message === 'string' ? message : JSON.stringify(message);
    const normalized = text.trim();
    const lower = normalized.toLowerCase();

    if (lower.includes('platform is disabled')) {
        return 'ระบบจัดการโทเค็นของผู้ให้บริการถูกปิดใช้งานชั่วคราว กรุณาลองใหม่ภายหลัง';
    }

    return normalized;
}

function formatAxiosError(error) {
    if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
            return localizeApiMessage(data) || data;
        }
        if (data.message) {
            return localizeApiMessage(data.message) || data.message;
        }
        if (data.error) {
            return localizeApiMessage(data.error) || data.error;
        }
        const serialized = JSON.stringify(data);
        return localizeApiMessage(serialized) || serialized;
    }
    if (error.request) {
        return 'ไม่สามารถติดต่อเซิร์ฟเวอร์โทเค็นได้';
    }
    return localizeApiMessage(error.message) || error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
}

function extractRemainingTokens(data, seen = new Set()) {
    if (!data || typeof data !== 'object') {
        return null;
    }

    if (seen.has(data)) {
        return null;
    }
    seen.add(data);

    const possibleKeys = [
        'remaining',
        'balance',
        'credit',
        'credits',
        'tokens',
        'token',
        'tokens_remaining',
        'remaining_tokens',
        'token_balance',
        'quota',
    ];

    for (const key of possibleKeys) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value === null || value === undefined) {
                continue;
            }
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value === 'string' && value.trim() !== '') {
                const parsed = Number.parseFloat(value);
                return Number.isFinite(parsed) ? parsed : value.trim();
            }
        }
    }

    for (const value of Object.values(data)) {
        if (value && typeof value === 'object') {
            const nested = extractRemainingTokens(value, seen);
            if (nested !== null) {
                return nested;
            }
        }
    }

    return null;
}

function formatTokenSummary({ title, lead, remaining, fallbackNote }) {
    const lines = [];
    if (title) {
        lines.push(title);
    }
    if (lead) {
        lines.push(`📝 ${lead}`);
    }
    if (remaining !== null && remaining !== undefined) {
        const formatted =
            typeof remaining === 'number'
                ? remaining.toLocaleString('th-TH')
                : remaining;
        lines.push(`💳 โทเค็นคงเหลือ: ${formatted}`);
    } else if (fallbackNote) {
        lines.push(`⚠️ ${fallbackNote}`);
    }
    return lines.join('\n');
}

async function useTokens(apiKey, tokens) {
    try {
        const { data } = await axios.post(
            `${API_BASE}/use`,
            { key: apiKey, tokens },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (data && (data.success === false || data.ok === false)) {
            throw new Error(data.message || 'ไม่สามารถหักโทเค็นได้');
        }
        return data;
    } catch (error) {
        throw new Error(formatAxiosError(error));
    }
}

async function checkCredit(apiKey) {
    try {
        const { data } = await axios.get(`${API_BASE}/credit`, {
            params: { key: apiKey },
        });
        if (data && (data.success === false || data.ok === false)) {
            throw new Error(data.message || 'ไม่สามารถตรวจสอบโทเค็นได้');
        }
        return data;
    } catch (error) {
        throw new Error(formatAxiosError(error));
    }
}

function sanitizePhoneNumber(text) {
    return text.replace(/[^0-9]/g, '');
}

function runSmsBomb(phone, count) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [path.join(__dirname, 'sms.js'), phone, String(count)], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        child.stdout.on('data', (data) => {
            console.log(`[sms.js stdout] ${data.toString().trim()}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`[sms.js stderr] ${data.toString().trim()}`);
        });

        child.on('error', (error) => {
            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`sms.js exited with code ${code}`));
            }
        });
    });
}

bot.start((ctx) => {
    const session = getSession(ctx);
    session.apiKey = getStoredKey(ctx.from.id) || session.apiKey;
    session.step = null;
    session.pendingPhone = null;
    const name = ctx.from?.first_name || ctx.from?.username || 'เพื่อนรัก';
    return ctx.reply(
        `🤖 สวัสดี ${name}!\n` +
            'เลือกเมนูด้านล่างเพื่อเริ่มใช้งานได้เลย ✨',
        MAIN_MENU
    );
});

bot.hears(['🔐 ใส่คีย์', 'ใส่คีย์'], (ctx) => {
    const session = getSession(ctx);
    session.step = 'awaiting_key';
    session.pendingPhone = null;
    return ctx.reply('🔐 กรุณาส่ง API Key ของคุณ (เก็บไว้เป็นความลับนะ)');
});

bot.hears(['🧮 เช็คโทเค็น', 'เช็คโทเค็น', 'เช็คเครดิต'], async (ctx) => {
    const session = getSession(ctx);
    if (!session.apiKey) {
        session.apiKey = getStoredKey(ctx.from.id);
    }
    if (!session.apiKey) {
        return ctx.reply('⚠️ ยังไม่ได้ตั้งค่า API Key กรุณากด "🔐 ใส่คีย์" ก่อน');
    }

    try {
        await ctx.reply('🔍 กำลังตรวจสอบโทเค็นให้คุณ...');
        const credit = await checkCredit(session.apiKey);
        const remaining = extractRemainingTokens(credit);
        const summary = formatTokenSummary({
            title: '📊 สถานะโทเค็น',
            lead:
                (credit && localizeApiMessage(credit.message)) ||
                'ตรวจสอบโทเค็นสำเร็จ!',
            remaining,
            fallbackNote: 'ระบบต้นทางไม่ส่งยอดคงเหลือกลับมา',
        });
        await ctx.reply(summary, MAIN_MENU);
    } catch (error) {
        await ctx.reply(`❌ ตรวจสอบโทเค็นไม่สำเร็จ: ${error.message}`);
    }
});

bot.hears(['🚀 ยิงเบอร์', 'ยิงเบอร์'], (ctx) => {
    const session = getSession(ctx);
    if (session.activeJob) {
        return ctx.reply('⌛ ระบบกำลังยิงเบอร์อยู่ กรุณารอให้เสร็จก่อนนะ');
    }
    if (!session.apiKey) {
        session.apiKey = getStoredKey(ctx.from.id);
    }
    if (!session.apiKey) {
        return ctx.reply('⚠️ ยังไม่ได้ตั้งค่า API Key กรุณากด "🔐 ใส่คีย์" ก่อน');
    }
    session.step = 'awaiting_phone';
    session.pendingPhone = null;
    return ctx.reply('📱 กรุณาส่งเบอร์ที่จะยิง (เฉพาะตัวเลขเท่านั้น)');
});

bot.on('text', async (ctx) => {
    const session = getSession(ctx);
    const text = ctx.message.text.trim();

    if (session.activeJob) {
        return ctx.reply('ระบบกำลังยิงเบอร์อยู่ กรุณารอให้เสร็จก่อน');
    }

    switch (session.step) {
        case 'awaiting_key': {
            try {
                const result = assignKeyToUser(ctx.from.id, text, {
                    firstName: ctx.from?.first_name || null,
                    username: ctx.from?.username || null,
                });
                if (result.status === 'conflict') {
                    await ctx.reply(
                        '⛔ คีย์นี้ถูกใช้งานโดยบัญชีอื่นแล้ว กรุณาตรวจสอบอีกครั้ง',
                        MAIN_MENU
                    );
                    return;
                }

                session.apiKey = getStoredKey(ctx.from.id);
                session.step = null;
                session.pendingPhone = null;

                const statusMessage =
                    result.status === 'updated'
                        ? '🔄 อัปเดต API Key ใหม่เรียบร้อย! พร้อมใช้งานทันที 🚀'
                        : result.status === 'unchanged'
                        ? 'ℹ️ คีย์นี้มีอยู่แล้ว พร้อมใช้งานต่อได้เลย ✅'
                        : '✅ บันทึก API Key เรียบร้อยแล้ว! พร้อมใช้งานทันที 🚀';

                await ctx.reply(statusMessage, MAIN_MENU);
            } catch (error) {
                await ctx.reply(`❌ ไม่สามารถบันทึกคีย์ได้: ${error.message}`);
            }
            return;
        }
        case 'awaiting_phone': {
            const sanitized = sanitizePhoneNumber(text);
            if (!sanitized || sanitized.length < 8 || sanitized.length > 12) {
                await ctx.reply('⚠️ รูปแบบเบอร์ไม่ถูกต้อง กรุณาลองอีกครั้งด้วยตัวเลข 8-12 หลัก');
                return;
            }
            session.pendingPhone = sanitized;
            session.step = 'awaiting_count';
            await ctx.reply('🎯 ต้องการยิงจำนวนกี่ครั้ง (1-10)');
            return;
        }
        case 'awaiting_count': {
            const count = Number.parseInt(text, 10);
            if (!Number.isInteger(count) || count < 1 || count > 10) {
                await ctx.reply('⚠️ กรุณาระบุจำนวนเป็นตัวเลข 1-10');
                return;
            }

            try {
                await ctx.reply('🪙 กำลังหักโทเค็น...');
                const response = await useTokens(session.apiKey, count);
                let remaining = extractRemainingTokens(response);
                let leadMessage =
                    (response && localizeApiMessage(response.message)) ||
                    'หักโทเค็นสำเร็จ!';

                if (remaining === null) {
                    try {
                        const latestCredit = await checkCredit(session.apiKey);
                        remaining = extractRemainingTokens(latestCredit);
                        if (!response?.message && latestCredit?.message) {
                            leadMessage =
                                localizeApiMessage(latestCredit.message) || leadMessage;
                        }
                    } catch (refreshError) {
                        console.error('Failed to refresh credit after deduction', refreshError);
                    }
                }

                const summary = formatTokenSummary({
                    title: '✅ หักโทเค็นสำเร็จ',
                    lead: leadMessage,
                    remaining,
                    fallbackNote: 'ไม่พบยอดคงเหลือหลังการหักโทเค็น',
                });
                await ctx.reply(summary, MAIN_MENU);

                const phone = session.pendingPhone;
                session.step = null;
                session.pendingPhone = null;
                session.activeJob = true;

                await ctx.reply(`🔥 เริ่มยิงเบอร์ ${phone} จำนวน ${count} ครั้ง`);
                try {
                    await runSmsBomb(phone, count);
                    await ctx.reply('🎉 ยิงเบอร์สำเร็จเรียบร้อยแล้ว!', MAIN_MENU);
                } catch (error) {
                    await ctx.reply(`❌ เกิดข้อผิดพลาดระหว่างยิงเบอร์: ${error.message}`);
                } finally {
                    session.activeJob = false;
                }
            } catch (error) {
                await ctx.reply(`❌ หักโทเค็นไม่สำเร็จ: ${error.message}`);
            }
            return;
        }
        default:
            break;
    }

    if (text.startsWith('/')) {
        return;
    }

    return;
});

bot.catch((err, ctx) => {
    console.error(`Bot error for ${ctx.updateType}`, err);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
