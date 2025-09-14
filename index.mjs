import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCursor } from "ghost-cursor";

// ===== CONFIG (ใส่ค่าของคุณ) =====
const TELEGRAM_TOKEN = "8059700320:AAE3zoxq5Q-WyBfS5eeQTJtg7k3xacFw6I8"; // 🔑 Token จริงของบอท
const ADMIN_CHAT_ID = "7905342409";    // 🆔 Chat ID ของผู้ดูแล
const AI_API = "https://kaiz-apis.gleeze.com/api/gemini-vision";
const AI_KEY = "e62d60dd-8853-4233-bbcb-9466b4cbc265";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMG_DIR = path.join(__dirname, "public");
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

const app = express();
app.use(express.static(IMG_DIR));
app.listen(4000, () => console.log("🖼 Image server on http://localhost:4000/"));

puppeteer.use(StealthPlugin());
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// ===== 🧠 สถานะของบอท (State Management) =====
let botState = {
    browser: null,
    page: null,
    cursor: null,
    status: 'idle', // idle, awaiting_url, mission_active
};

// ===== Keyboards =====
const idleKeyboard = {
    reply_markup: {
        keyboard: [[{ text: "🚀 เริ่มภารกิจใหม่" }]],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};
const missionActiveKeyboard = {
    reply_markup: {
        keyboard: [[{ text: "🛑 สิ้นสุดภารกิจ" }]],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// ===== Utils & Core Actions =====
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const humanPause = (min = 300, max = 1200) => delay(min + Math.random() * (max - min));

async function sendSafePhoto(caption, filePath) {
    const cap = caption.length > 1020 ? caption.slice(0, 1020) + "..." : caption;
    try {
        await bot.sendPhoto(ADMIN_CHAT_ID, filePath, { caption: cap });
    } catch {
        await bot.sendMessage(ADMIN_CHAT_ID, cap);
        await bot.sendPhoto(ADMIN_CHAT_ID, filePath);
    } finally {
        try { fs.unlinkSync(filePath); } catch { }
    }
}

async function capture(page) {
    const filename = `screen-${Date.now()}.png`;
    const filePath = path.join(IMG_DIR, filename);
    await page.screenshot({ path: filePath, fullPage: false });
    return { filePath, url: `http://localhost:4000/${filename}` };
}

async function screenshot(page, note = "📸") {
    const { filePath } = await capture(page);
    await sendSafePhoto(note, filePath);
}

// ===== 🧠 [อัปเกรด!] ระบบ AI-Vision & Element Interaction =====

/**
 * สแกนหน้าเว็บเพื่อหาองค์ประกอบที่สามารถโต้ตอบได้ทั้งหมดที่มองเห็น
 * และสร้าง "แผนที่" ในรูปแบบ JSON พร้อมทั้งฝัง ID สำหรับการอ้างอิง
 */
async function getVisibleInteractiveElements(page) {
    return await page.evaluate(() => {
        const elements = document.querySelectorAll('a, button, input:not([type="hidden"]), textarea, [role="button"], [role="link"], select, [contenteditable="true"]');
        const visibleElements = [];
        let elementIdCounter = 0;

        for (const el of elements) {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const isVisible = style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;

            if (isVisible) {
                let text = (el.innerText || el.textContent || el.value || el.placeholder || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ');
                if (text.length > 100) text = text.substring(0, 100) + "...";
                
                const uniqueId = `pptr-gen-${elementIdCounter++}`;
                el.setAttribute('data-pptr-id', uniqueId);

                visibleElements.push({
                    id: uniqueId,
                    tag: el.tagName.toLowerCase(),
                    text: text,
                    ariaLabel: el.getAttribute('aria-label'),
                    placeholder: el.getAttribute('placeholder'),
                    type: el.getAttribute('type')
                });
            }
        }
        return visibleElements;
    });
}


/**
 * ถาม AI เพื่อเลือก Element ที่เหมาะสมที่สุดจากลิสต์ที่สแกนมา
 */
async function askAIToChooseElement(userHint, elementType, elementsJSON) {
    const prompt = `You are an expert web automation assistant. Your task is to analyze a user's instruction and a JSON list of visible, interactive elements from a webpage. You must select the single best element to interact with. Consider the element's tag, text, accessibility labels (ariaLabel), and placeholder text to make the most accurate choice. Pay close attention to Thai language hints and text.

User's instruction: "${userHint}"
Desired element type: "${elementType}" (e.g., 'a button or link', 'an input field')

Here are the visible elements on the page:
${JSON.stringify(elementsJSON, null, 2)}

Respond with ONLY the 'id' of the best matching element. For example: "pptr-gen-5". If no element is a clear match, respond with "null".`;

    try {
        const response = await fetch(
            `${AI_API}?q=${encodeURIComponent(prompt)}&uid=puppeteer-genius-pro&imageUrl=&apikey=${AI_KEY}`
        );
        if (!response.ok) return null;
        const data = await response.json();
        let choice = (data.response || "null").replace(/["'`]/g, "").trim();
        return choice.startsWith("pptr-gen-") ? choice : null;
    } catch {
        return null;
    }
}


/**
 * ถาม AI ให้อ่านและสรุปข้อมูลจากหน้าเว็บ
 */
async function askAIToReadContent(page, question) {
    await bot.sendMessage(ADMIN_CHAT_ID, `🧠 AI กำลังวิเคราะห์ภาพเพื่อหาคำตอบสำหรับ: "${question}"`);
    const { filePath, url } = await capture(page);

    try {
        const params = new URLSearchParams({
            q: question,
            uid: "puppeteer-reader",
            imageUrl: url,
            apikey: AI_KEY
        });
        const response = await fetch(`${AI_API}?${params.toString()}`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        await sendSafePhoto(`ภาพที่ใช้ถาม: ${question}`, filePath);
        return data.response || "ไม่พบข้อมูลที่เกี่ยวข้อง";
    } catch (e) {
        await sendSafePhoto(`เกิดข้อผิดพลาดในการถาม: ${question}`, filePath);
        return `เกิดข้อผิดพลาดในการดึงข้อมูล: ${e.message}`;
    }
}


// ===== 🧠 AI Planner =====
async function getAIPlan(instruction) {
    const prompt = `You are a browser automation expert. Convert the user's request into a JSON array of steps. Your response MUST be ONLY the JSON array.
Available actions: "GOTO", "TYPE", "CLICK", "READ", "PRESS".
- 'hint' for TYPE, CLICK, READ should be the VISIBLE text, placeholder, or a description of the target.
- 'url' for GOTO must be a full, valid URL.
- 'question' for READ is what the user wants to know.
- 'key' for PRESS is the keyboard key (e.g., 'Enter').

Example 1 (English): User: Type Username tomsmith and Password SuperSecretPassword! then click "Login"
AI: [{"action": "TYPE", "hint": "Username", "value": "tomsmith"},{"action": "TYPE", "hint": "Password", "value": "SuperSecretPassword!"},{"action": "CLICK", "hint": "Login"}]

Example 2 (English): User: Go to google.com and search for "dogs" then press Enter
AI: [{"action": "GOTO", "url": "https://google.com"},{"action": "TYPE", "hint": "Search box", "value": "dogs"},{"action": "PRESS", "key": "Enter"}]

Example 3 (Thai): User: ไปที่ facebook.com แล้วใส่ email "test@test.com" และรหัสผ่าน "pass123" จากนั้นกด "เข้าสู่ระบบ"
AI: [{"action": "GOTO", "url": "https://facebook.com"},{"action": "TYPE", "hint": "Email", "value": "test@test.com"},{"action": "TYPE", "hint": "รหัสผ่าน", "value": "pass123"},{"action": "CLICK", "hint": "เข้าสู่ระบบ"}]

Example 4 (English): User: After logging in, find out what the account balance is
AI: [{"action": "READ", "question": "What is the account balance?"}]

Now, analyze this user request:
User: ${instruction}
AI:`;

    try {
        const response = await fetch(
            `${AI_API}?q=${encodeURIComponent(prompt)}&uid=puppeteer-pro-planner&imageUrl=&apikey=${AI_KEY}`
        );
        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        const jsonMatch = (data.response || "").match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (!jsonMatch) throw new Error("AI did not return a valid JSON plan.");
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("AI Plan generation failed:", error);
        bot.sendMessage(ADMIN_CHAT_ID, `⚠️ ไม่สามารถสร้างแผนจาก AI ได้: ${error.message}`);
        return null;
    }
}

// ===== 🚀 ตัวจัดการการทำงาน (Execution Engine) =====

async function handleCommonOverlays(page) {
    const selectors = [
        '[id*="cookie"] button', '[class*="cookie"] button',
        '[aria-label*="close" i]', '[title*="close" i]',
        'button:has-text("Accept"), button:has-text("Allow"), button:has-text("ตกลง"), button:has-text("ยอมรับทั้งหมด")'
    ];
    for (const selector of selectors) {
        try {
            const elements = await page.$$(selector);
            for (const el of elements) {
                if (el && await el.isIntersectingViewport()) {
                    await bot.sendMessage(ADMIN_CHAT_ID, `🪄 พบ Pop-up/Cookie banner... กำลังพยายามปิด...`);
                    await el.click({delay: 100});
                    await delay(1000);
                    return;
                }
            }
        } catch {}
    }
}

async function executePlan(page, instruction) {
    try {
        await bot.sendMessage(ADMIN_CHAT_ID, "🧠 กำลังวิเคราะห์คำสั่งและสร้างแผนการทำงาน...");
        const plan = await getAIPlan(instruction);

        if (!plan || !Array.isArray(plan)) {
            throw new Error("ไม่สามารถสร้างแผนการทำงานจาก AI ได้ หรือแผนไม่ถูกต้อง");
        }

        const planText = plan.map(s => `- ${s.action}: ${s.hint || s.url || s.question || s.key}`).join('\n');
        await bot.sendMessage(ADMIN_CHAT_ID, `✅ **แผนการทำงานที่ AI สร้างขึ้น:**\n${planText}`);

        for (const [index, step] of plan.entries()) {
            await humanPause(800,1500);
            await handleCommonOverlays(page);
            await bot.sendMessage(ADMIN_CHAT_ID, `⏳ [${index+1}/${plan.length}] กำลังทำ: **${step.action}** "${step.hint || step.url || step.question || step.key}"...`);

            let elementId, elementHandle;

            switch (step.action.toUpperCase()) {
                case "TYPE":
                case "CLICK":
                    await bot.sendMessage(ADMIN_CHAT_ID, `🤖 AI กำลัง 'มองหา' องค์ประกอบที่เหมาะสมที่สุดบนหน้าจอ...`);
                    const visibleElements = await getVisibleInteractiveElements(page);
                    if (visibleElements.length === 0) throw new Error("ไม่พบองค์ประกอบที่สามารถโต้ตอบได้บนหน้าจอเลย");
                    
                    const targetType = step.action.toUpperCase() === "TYPE" ? 'an input field' : 'a button or link';
                    elementId = await askAIToChooseElement(step.hint, targetType, visibleElements);

                    if (!elementId) {
                        await screenshot(page, `หาไม่เจอ: ${step.hint}`);
                        throw new Error(`AI ไม่สามารถหาองค์ประกอบสำหรับ "${step.hint}" ที่มองเห็นบนหน้าจอได้`);
                    }
                    
                    elementHandle = await page.$(`[data-pptr-id="${elementId}"]`);
                    if (!elementHandle) throw new Error(`พบ ID: ${elementId} แต่ไม่พบ Element Handle ในหน้าเว็บ (อาจเป็นปัญหาของเว็บแอปพลิเคชัน)`);
                    
                    await bot.sendMessage(ADMIN_CHAT_ID, `✅ AI เลือกองค์ประกอบสำหรับ "${step.hint}" ได้แล้ว!`);
                    
                    await page.evaluate(el => el.scrollIntoView({ block: "center", behavior: "smooth" }), elementHandle);
                    await humanPause(300,600);
                    await page.evaluate(el => {
                        el.style.transition = 'all 0.3s ease';
                        el.style.boxShadow = '0 0 15px 5px rgba(0, 191, 255, 0.9)';
                        el.style.border = '3px solid #00BFFF';
                        el.style.borderRadius = '8px';
                    }, elementHandle);
                    await screenshot(page, `กำลังจะ ${step.action} ที่: "${step.hint}"`);
                    await humanPause(1000,1700);
                    await page.evaluate(el => { el.style.boxShadow = ''; el.style.border = ''; el.style.borderRadius = ''; }, elementHandle);

                    if (step.action.toUpperCase() === "TYPE") {
                        await botState.cursor.click(elementHandle);
                        const isContentEditable = await elementHandle.evaluate(el => el.isContentEditable);
                        if (isContentEditable) {
                            await elementHandle.evaluate(el => el.textContent = '');
                        } else {
                            await elementHandle.click({ clickCount: 3 });
                            await page.keyboard.press('Backspace');
                        }
                        await botState.page.keyboard.type(step.value, { delay: 50 + Math.random()*100 });
                    } else {
                        await botState.cursor.click(elementHandle);
                    }
                    break;

                case "GOTO":
                    if (!step.url || !/^https?:\/\//i.test(step.url)) throw new Error(`URL สำหรับ GOTO ไม่ถูกต้อง: "${step.url}"`);
                    await page.goto(step.url, { waitUntil: "domcontentloaded", timeout: 90000 });
                    botState.cursor = createCursor(page);
                    break;
                
                case "READ":
                    const answer = await askAIToReadContent(page, step.question);
                    await bot.sendMessage(ADMIN_CHAT_ID, `💡 **คำตอบจาก AI:**\n${answer}`);
                    break;

                case "PRESS":
                    await page.keyboard.press(step.key);
                    await bot.sendMessage(ADMIN_CHAT_ID, `⌨️ กดปุ่ม: ${step.key}`);
                    break;
                
                default:
                    throw new Error(`ไม่รู้จัก Action: ${step.action}`);
            }
            await page.waitForNetworkIdle({idleTime: 500, timeout: 10000}).catch(() => {
                console.log("Network idle timeout, continuing anyway.");
            });
        }
        return true;
    } catch (e) {
        await bot.sendMessage(ADMIN_CHAT_ID, `❌ เกิดข้อผิดพลาดร้ายแรงระหว่างทำงาน:\n\`\`\`\n${e.message}\n\`\`\``, { parse_mode: 'Markdown' });
        console.error(e);
        if (page) await screenshot(page, "ภาพหน้าจอ ณ จุดที่เกิดข้อผิดพลาด");
        return false;
    }
}

// ===== 💬 ตัวจัดการแชท (Chat Flow Controller) =====

async function endMission() {
    await bot.sendMessage(ADMIN_CHAT_ID, "กำลังสิ้นสุดภารกิจและปิดเบราว์เซอร์...");
    if (botState.browser) {
        await botState.browser.close().catch(e => console.error("Error closing browser:", e));
    }
    botState = { browser: null, page: null, cursor: null, status: 'idle' };
    await bot.sendMessage(ADMIN_CHAT_ID, "ภารกิจสิ้นสุดแล้ว บอทพร้อมรับภารกิจใหม่", idleKeyboard);
}

bot.on("message", async (msg) => {
    const chatId = msg.chat.id.toString();
    if (chatId !== ADMIN_CHAT_ID) return;
    const text = (msg.text || "").trim();

    if (text === "/start" || text === "🛑 สิ้นสุดภารกิจ") {
        await endMission();
        return;
    }
    if (text === "🚀 เริ่มภารกิจใหม่") {
        if (botState.status !== 'idle') await endMission();
        botState.status = 'awaiting_url';
        await bot.sendMessage(chatId, "📌 กรุณาส่ง URL **เริ่มต้น** ของเว็บที่ต้องการทำงาน:");
        return;
    }

    switch (botState.status) {
        case 'awaiting_url':
            if (!text.toLowerCase().startsWith('http')) {
                await bot.sendMessage(chatId, "URL ไม่ถูกต้อง กรุณาส่ง URL ที่ขึ้นต้นด้วย http:// หรือ https://");
                return;
            }
            try {
                await bot.sendMessage(chatId, "🚀 กำลังเปิดเบราว์เซอร์และไปที่ URL แรก...");
                botState.browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
                botState.page = (await botState.browser.pages())[0] || await botState.browser.newPage();
                await botState.page.setViewport({ width: 1366, height: 768 });
                botState.cursor = createCursor(botState.page);
                await botState.page.goto(text, { waitUntil: "domcontentloaded", timeout: 90000 });
                await screenshot(botState.page, `📲 โหลดหน้าแรกสำเร็จ: ${text}`);
                botState.status = 'mission_active';
                await bot.sendMessage(chatId, "✅ เบราว์เซอร์พร้อมแล้ว!\n📝 **พิมพ์คำสั่งแรกที่ต้องการให้ทำได้เลย** (เช่น 'เลื่อนลง' หรือ 'คลิกปุ่มเข้าสู่ระบบ')", missionActiveKeyboard);
            } catch (e) {
                await bot.sendMessage(chatId, `❌ ไม่สามารถเปิด URL ได้:\n${e.message}`);
                await endMission();
            }
            break;

        case 'mission_active':
            const success = await executePlan(botState.page, text);
            if (success) {
                await screenshot(botState.page, "🎉 ทำงานล่าสุดเสร็จสิ้น");
                const currentUrl = botState.page.url();
                await bot.sendMessage(chatId, `✅ ภารกิจย่อยสำเร็จ!\n\n📍 ตอนนี้คุณอยู่ที่: \`${currentUrl}\`\n\n📝 **สามารถพิมพ์คำสั่งต่อไปได้เลย** หรือกด "สิ้นสุดภารกิจ"`, { ...missionActiveKeyboard, parse_mode: 'Markdown' });
            } else {
                await bot.sendMessage(chatId, "เกิดข้อผิดพลาด กรุณาตรวจสอบและลองอีกครั้ง หรือกด 'สิ้นสุดภารกิจ' เพื่อเริ่มต้นใหม่", missionActiveKeyboard);
            }
            break;

        default:
            await bot.sendMessage(chatId, "สวัสดีครับ! กรุณากด '🚀 เริ่มภารกิจใหม่' เพื่อเริ่มต้น", idleKeyboard);
            break;
    }
});


console.log("🤖 Telegram Bot v5.2 (Genesis Pro Plus) is running...");
bot.sendMessage(ADMIN_CHAT_ID, "✅ บอท (v5.2 Genesis Pro Plus) รีสตาร์ทและพร้อมทำงานแล้ว!", idleKeyboard).catch(err => {
    console.error("❌ เกิดข้อผิดพลาดร้ายแรงในการส่งข้อความเริ่มต้น!");
    console.error("กรุณาตรวจสอบว่า TELEGRAM_TOKEN และ ADMIN_CHAT_ID ในไฟล์โค้ดถูกต้องหรือไม่");
    console.error("Error Details:", err.response?.body || err.message);
});

