const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');
const { Telegraf } = require('telegraf');

const BOT_TOKEN = '8252745688:AAES1pAHGqYQMq32N8invkUNp8VC_rrCKZo';

const API_BASE = 'https://apikey-vip.netlify.app/api/apisms1';

const MAIN_MENU = {
    reply_markup: {
        keyboard: [
            [{ text: 'ยิงเบอร์' }],
            [{ text: '🔑 ใส่คีย์' }, { text: '💳 เช็คโทเค็น' }],
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
            apiKey: null,
            step: null,
            pendingPhone: null,
            activeJob: false,
        });
    }
    return sessions.get(id);
}

function formatAxiosError(error) {
    if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
            return data;
        }
        if (data.message) {
            return data.message;
        }
        if (data.error) {
            return data.error;
        }
        return JSON.stringify(data);
    }
    if (error.request) {
        return 'ไม่สามารถติดต่อเซิร์ฟเวอร์โทเค็นได้';
    }
    return error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
}

function extractRemainingTokens(data) {
    if (!data || typeof data !== 'object') {
        return null;
    }
    const possibleKeys = ['remaining', 'balance', 'credit', 'credits', 'tokens', 'token'];
    for (const key of possibleKeys) {
        if (data[key] !== undefined) {
            return data[key];
        }
    }
    return null;
}

async function useTokens(apiKey, tokens) {
    try {
        const { data } = await axios.post(
            `${API_BASE}/use`,
            { key: apiKey, tokens },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (data && data.success === false) {
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
        if (data && data.success === false) {
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
    session.step = null;
    session.pendingPhone = null;
    return ctx.reply('ยินดีต้อนรับ! เลือกเมนูที่ต้องการใช้งานได้เลย', MAIN_MENU);
});

bot.hears('🔑 ใส่คีย์', (ctx) => {
    const session = getSession(ctx);
    session.step = 'awaiting_key';
    session.pendingPhone = null;
    return ctx.reply('กรุณาส่งคีย์ API ของคุณ');
});

bot.hears('💳 เช็คโทเค็น', async (ctx) => {
    const session = getSession(ctx);
    if (!session.apiKey) {
        return ctx.reply('ยังไม่ได้ตั้งค่า API Key กรุณากด "🔑 ใส่คีย์" ก่อน');
    }

    try {
        const credit = await checkCredit(session.apiKey);
        const remaining = extractRemainingTokens(credit);
        let message = 'ข้อมูลโทเค็น:';
        if (credit && credit.message) {
            message = credit.message;
        }
        if (remaining !== null) {
            message += `\nโทเค็นคงเหลือ: ${remaining}`;
        }
        await ctx.reply(message, MAIN_MENU);
    } catch (error) {
        await ctx.reply(`ตรวจสอบโทเค็นไม่สำเร็จ: ${error.message}`);
    }
});

bot.hears('ยิงเบอร์', (ctx) => {
    const session = getSession(ctx);
    if (session.activeJob) {
        return ctx.reply('ระบบกำลังยิงเบอร์อยู่ กรุณารอให้เสร็จก่อน');
    }
    if (!session.apiKey) {
        return ctx.reply('ยังไม่ได้ตั้งค่า API Key กรุณากด "🔑 ใส่คีย์" ก่อน');
    }
    session.step = 'awaiting_phone';
    session.pendingPhone = null;
    return ctx.reply('กรุณาส่งเบอร์ที่จะยิง (ตัวเลขเท่านั้น)');
});

bot.on('text', async (ctx) => {
    const session = getSession(ctx);
    const text = ctx.message.text.trim();

    if (session.activeJob) {
        return ctx.reply('ระบบกำลังยิงเบอร์อยู่ กรุณารอให้เสร็จก่อน');
    }

    switch (session.step) {
        case 'awaiting_key': {
            session.apiKey = text;
            session.step = null;
            session.pendingPhone = null;
            await ctx.reply('บันทึก API Key เรียบร้อยแล้ว', MAIN_MENU);
            return;
        }
        case 'awaiting_phone': {
            const sanitized = sanitizePhoneNumber(text);
            if (!sanitized || sanitized.length < 8 || sanitized.length > 12) {
                await ctx.reply('รูปแบบเบอร์ไม่ถูกต้อง กรุณาลองอีกครั้ง');
                return;
            }
            session.pendingPhone = sanitized;
            session.step = 'awaiting_count';
            await ctx.reply('ต้องการยิงจำนวนกี่ครั้ง (1-10)');
            return;
        }
        case 'awaiting_count': {
            const count = Number.parseInt(text, 10);
            if (!Number.isInteger(count) || count < 1 || count > 10) {
                await ctx.reply('กรุณาระบุจำนวนเป็นตัวเลข 1-10');
                return;
            }

            try {
                await ctx.reply('กำลังหักโทเค็น...');
                const response = await useTokens(session.apiKey, count);
                const remaining = extractRemainingTokens(response);
                let message = 'หักโทเค็นสำเร็จ';
                if (response && response.message) {
                    message = response.message;
                }
                if (remaining !== null) {
                    message += `\nโทเค็นคงเหลือ: ${remaining}`;
                }
                await ctx.reply(message);

                const phone = session.pendingPhone;
                session.step = null;
                session.pendingPhone = null;
                session.activeJob = true;

                await ctx.reply(`เริ่มยิงเบอร์ ${phone} จำนวน ${count} ครั้ง`);
                try {
                    await runSmsBomb(phone, count);
                    await ctx.reply('ยิงเบอร์สำเร็จเรียบร้อยแล้ว', MAIN_MENU);
                } catch (error) {
                    await ctx.reply(`เกิดข้อผิดพลาดระหว่างยิงเบอร์: ${error.message}`);
                } finally {
                    session.activeJob = false;
                }
            } catch (error) {
                await ctx.reply(`หักโทเค็นไม่สำเร็จ: ${error.message}`);
            }
            return;
        }
        default:
            break;
    }

    if (text.startsWith('/')) {
        return;
    }

    await ctx.reply('ไม่เข้าใจคำสั่ง กรุณาเลือกจากเมนู', MAIN_MENU);
});

bot.catch((err, ctx) => {
    console.error(`Bot error for ${ctx.updateType}`, err);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
