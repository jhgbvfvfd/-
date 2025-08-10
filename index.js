const express = require("express");
const fs = require("fs");
const path = require("path");
const admZip = require("adm-zip");
const axios = require("axios");

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
// Middleware to parse JSON bodies
app.use(express.json());

// Serve the HTML content
app.get("/", (req, res) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>Mana Shop X Cyber Cs</title>
<link href="https://fonts.googleapis.com/css2?family=Mitr&display=swap" rel="stylesheet" />
<style>
    * {
        box-sizing: border-box;
    }

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: 'Mitr', 'Segoe UI', sans-serif;
        background: #121212;
        overflow: hidden;
    }

    body {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: radial-gradient(circle, rgba(123, 57, 255, 0.15), #121212 60%);
    }

    #intro {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 9999;
        opacity: 1;
        transition: opacity 1.5s ease-out;
    }

    #intro.hidden {
        opacity: 0;
        pointer-events: none;
    }

    #intro h1 {
        color: white;
        font-size: 5.5vw;
        max-width: 90%;
        font-weight: 900;
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
        background-size: 200%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        margin: 0;
        text-align: center;
        animation: rainbow 6s linear infinite, introText 6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, textGlow 2.5s ease-in-out infinite;
        opacity: 0;
    }

    @keyframes rainbow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
    }

    @keyframes textGlow {
        0%, 100% {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 0 16px rgba(255, 255, 255, 0.3);
        }
        50% {
            text-shadow: 0 0 16px rgba(255, 255, 255, 0.8), 0 0 32px rgba(255, 255, 255, 0.5);
        }
    }

    @keyframes introText {
        0% { transform: translateY(100px) scale(0.5); opacity: 0; }
        60% { transform: translateY(0) scale(1.1); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    header {
        height: 40px;
        background: rgba(31, 31, 31, 0.7);
        backdrop-filter: blur(5px);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        flex-shrink: 0;
        border-bottom: 1px solid rgba(123, 57, 255, 0.5);
        position: relative;
        z-index: 10;
    }
    
    .header-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .header-content svg {
        width: 20px;
        height: 20px;
        fill: #d6bbff;
        filter: drop-shadow(0 0 5px #7b39ff);
    }

    header h1 {
        font-weight: 900;
        font-size: 3.5vw;
        max-width: 90%;
        margin: 0;
        user-select: none;
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
        background-size: 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
        animation: rainbow 6s linear infinite;
    }

    main {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 6px;
        overflow-y: auto;
    }

    .box {
        background: rgba(30, 30, 30, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 1px solid rgba(123, 57, 255, 0.5);
        box-shadow: 0 8px 32px 0 rgba(123, 57, 255, 0.2);
        padding: 12px;
        width: 88vw;
        max-width: 320px;
        text-align: center;
        color: #fff;
    }
    
    .input-container {
        position: relative;
        margin-bottom: 8px;
    }

    .input-container svg {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        fill: #b19aff;
    }
    
    input[type="text"] {
        width: 100%;
        padding: 10px 10px 10px 35px; /* Add padding for icon */
        font-size: 3.5vw;
        border-radius: 8px;
        border: 1px solid #b19aff;
        outline: none;
        background-color: #333;
        color: #fff;
        font-family: 'Mitr', 'Segoe UI', sans-serif;
        transition: all 0.3s ease;
    }

    input[type="text"]:focus {
        border-color: #7b39ff;
        box-shadow: 0 0 8px rgba(123, 57, 255, 0.6);
    }

    button {
        width: 100%;
        background: linear-gradient(45deg, #7b39ff, #5a1acc);
        color: white;
        border: none;
        padding: 10px;
        font-size: 3.8vw;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(123, 57, 255, 0.4);
        transition: all 0.3s ease;
        font-family: 'Mitr', 'Segoe UI', sans-serif;
        touch-action: manipulation;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(123, 57, 255, 0.6);
    }
    
    button:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(123, 57, 255, 0.4);
    }

    button svg {
        width: 18px;
        height: 18px;
        fill: white;
    }

    #menu h1 {
        font-weight: 900;
        font-size: 4.5vw;
        margin-bottom: 15px;
        user-select: none;
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
        background-size: 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
        animation: rainbow 6s linear infinite;
    }

    .btn-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }

    .switch-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: rgba(58, 42, 94, 0.8);
        border-radius: 8px;
        font-size: 3.5vw;
        font-weight: 700;
        color: #e6e6e6;
        user-select: none;
        font-family: 'Mitr', 'Segoe UI', sans-serif;
        border: 1px solid rgba(123, 57, 255, 0.3);
    }

    .switch-label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .switch-label svg {
        width: 20px;
        height: 20px;
        fill: #d6bbff;
    }
    
    .status-dev {
        background-color: #444;
        color: #aaa;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 3vw;
        font-weight: normal;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #555;
        transition: 0.3s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #7b39ff;
        box-shadow: 0 0 5px #7b39ff;
    }

    input:checked + .slider:before {
        transform: translateX(20px);
    }

    #toast {
        visibility: hidden;
        min-width: 140px;
        background-color: #d6bbff;
        color: #121212;
        text-align: center;
        border-radius: 8px;
        padding: 8px 12px;
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        opacity: 0;
        font-weight: 700;
        font-family: 'Mitr', 'Segoe UI', sans-serif;
        font-size: 3.2vw;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        transition: opacity 0.3s, visibility 0.3s, bottom 0.3s;
    }

    #toast.show {
        visibility: visible;
        opacity: 1;
        bottom: 30px;
    }

    #loadingOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        color: white;
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 9998;
    }

    .loader {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #7b39ff;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1.5s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

</style>
</head>
<body>
<div id="intro">
    <h1>Mana Shop X Cyber Cs</h1>
</div>

<header>
    <div class="header-content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 2.05v3.03c4.39.54 7.5 4.53 6.96 8.92C19.43 18.57 15.47 22 11 22c-4.43 0-8.39-3.43-8.92-7.95C1.54 9.58 4.61 6.08 9 5.54V2.05H6v-2h12v2h-5z"/></svg>
        <h1>Mana Shop X Cyber Cs</h1>
    </div>
</header>

<main>
    <div class="box" id="loginBox">
        <h2>กรอก KEY เพื่อเข้าสู่ระบบ</h2>
        <div class="input-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.62,18.54l-3.37,3.37a2.53,2.53,0,0,1-3.58,0l-.25-.25a2.53,2.53,0,0,1,0-3.58l9.13-9.13a2.54,2.54,0,0,1,3.58,0l.25.25a2.54,2.54,0,0,1,0,3.58l-3.37,3.37L16.2,14.8l2.12-2.12a4.5,4.5,0,0,0,0-6.37l-.25-.25a4.5,4.5,0,0,0-6.37,0L2.58,15.19a4.5,4.5,0,0,0,0,6.37l.25.25a4.5,4.5,0,0,0,6.37,0l2.12-2.12Z"/></svg>
            <input type="text" id="keyInput" placeholder="ใส่ KEY ของคุณ" />
        </div>
        <button onclick="login()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,6.5,9.47,1,1,0,0,0,.5.13,1,1,0,0,0,1-1V17.87a2.12,2.12,0,0,1,1-1.79,1,1,0,0,0,0-1.8,2.12,2.12,0,0,1-1-1.79V10a1,1,0,0,0-2,0v2.21a1,1,0,0,0,.55.89,1,1,0,0,0,1.11-.21l.13-.13a.5.5,0,0,1,.71,0l.13.13a1,1,0,0,0,1.11.21A1,1,0,0,0,13,12.21V10a1,1,0,0,0-2,0v2.21a4.15,4.15,0,0,0,2,3.66v2.5a1,1,0,0,0,1,1,1,1,0,0,0,.5-.13A9.89,9.89,0,0,0,22,12,10,10,0,0,0,12,2Z"/></svg>
            เข้าสู่ระบบ
        </button>
    </div>

    <div class="box" id="menu" style="display:none;">
        <h1>Mana Shop X Cyber Cs</h1>
        <div class="btn-container">
            <div class="switch-container">
                <label class="switch-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3a9 9 0 109 9c0-5-4-9-9-9zm0 16a7 7 0 117-7c0 3.8-3.2 7-7 7z"/><path d="M12 9a3 3 0 103 3c0-1.7-1.3-3-3-3z"/></svg>
                    ดูดหัว
                </label>
                <span class="status-dev">กำลังพัฒนา</span>
            </div>
            <div class="switch-container">
                <label class="switch-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
                    มองทะลุ
                </label>
                <label class="switch">
                    <input type="checkbox" data-name="มองทะลุ" onchange="toggleSwitch(this)">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="switch-container">
                <label class="switch-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                    กันแบน
                </label>
                <span class="status-dev">กำลังพัฒนา</span>
            </div>
        </div>
    </div>
</main>

<div id="toast"></div>
<div id="loadingOverlay">
    <div class="loader"></div>
    <p style="margin-top: 20px; font-weight: bold; font-size: 4vw;">กำลังดาวน์โหลดและติดตั้ง...</p>
</div>

<audio id="audioPlayer"></audio>
<audio id="clickSound" src="https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_generic_switch_flick_1.mp3" preload="auto"></audio>
<audio id="backgroundMusic" loop></audio>

<script>
    const validKey = "1234";
    const deviceId = getDeviceId();
    const assetZipUrl = 'http://menu.panelaimbot.com:5405/files/75YQP3WR.zip';
    const assetKey = 'resourceDownloaded';
    const soundMap = {
        'มองทะลุ': 'http://menu.panelaimbot.com:5405/files/10GCsCfD.mp3',
    };

    function getDeviceId() {
        let id = localStorage.getItem('deviceId');
        if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('deviceId', id);
        }
        return id;
    }

    function loadSwitchStates() {
        const switches = document.querySelectorAll('#menu input[type="checkbox"]');
        switches.forEach(checkbox => {
            const name = checkbox.dataset.name;
            const savedState = localStorage.getItem(name);
            if (savedState === 'true') {
                checkbox.checked = true;
            }
        });
    }

    function checkAndroidVersion() {
        const ua = navigator.userAgent;
        const androidMatch = ua.match(/Android (\\d+)/);
        if (androidMatch) {
            const version = parseInt(androidMatch[1], 10);
            if (version < 5) {
                alert('ข้อผิดพลาด: แอพนี้ไม่รองรับ Android เวอร์ชันต่ำกว่า 5');
                return false;
            } else if (version >= 11) {
                showToast('คำเตือน: Android 11+ อาจพบปัญหาการเข้าถึงไฟล์', false);
            }
        }
        return true;
    }

    async function login() {
        if (!checkAndroidVersion()) return;
        
        const key = document.getElementById("keyInput").value.trim();
        if (key === "") {
            showToast("กรุณาใส่ KEY ก่อน", false);
            return;
        }
        if (key !== validKey) {
            showToast("KEY ไม่ถูกต้อง", false);
            return;
        }

        const hasDownloaded = localStorage.getItem(assetKey) === 'true';
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("menu").style.display = "block";

        if (!hasDownloaded) {
            document.getElementById('loadingOverlay').style.display = 'flex';
            try {
                const response = await fetch('/download-and-install', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: assetZipUrl, deviceId })
                });
                if (response.ok) {
                    localStorage.setItem(assetKey, 'true');
                    console.log('Resource downloaded and installed successfully.');
                    showToast("ดาวน์โหลดทรัพยากรเสร็จสิ้น", true);
                } else {
                    throw new Error('Server error during download/install.');
                }
            } catch (error) {
                console.error('Error during resource download:', error);
                showToast("เกิดข้อผิดพลาดในการดาวน์โหลด", false);
            } finally {
                document.getElementById('loadingOverlay').style.display = 'none';
                loadSwitchStates();
            }
        } else {
            showToast("เข้าสู่ระบบสำเร็จ", true);
            loadSwitchStates();
        }
    }

    function showToast(message, isSuccess = true) {
        let toast = document.getElementById("toast");
        toast.innerText = message;
        toast.style.backgroundColor = isSuccess ? '#7b39ff' : '#ff4d4d';
        toast.style.color = isSuccess ? '#fff' : '#fff';
        toast.className = "show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    }

    async function toggleSwitch(checkbox) {
        const name = checkbox.dataset.name;
        const soundFile = soundMap[name];
        localStorage.setItem(name, checkbox.checked);

        document.getElementById("clickSound").currentTime = 0;
        document.getElementById("clickSound").play().catch(error => console.error('Error playing click sound:', error));

        let audio = document.getElementById("audioPlayer");
        const toastMessage = checkbox.checked ? "เปิด: " + name : "ปิด: " + name;
        showToast(toastMessage, checkbox.checked);

        if (checkbox.checked) {
            if (soundFile) {
                audio.src = soundFile;
                audio.loop = false;
                audio.play().catch(error => console.error('Error playing audio:', error));
            }
        } else {
            audio.pause();
            audio.currentTime = 0;
        }

        try {
            await fetch('/move-data-folder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: checkbox.checked ? 'enable' : 'disable', deviceId })
            });
        } catch (error) {
            console.error('Error moving data folder:', error);
            showToast('เกิดข้อผิดพลาดในการตั้งค่า', false);
        }

        fetch('/log-switch-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                status: checkbox.checked ? "on" : "off",
                timestamp: new Date().toISOString(),
                deviceId: getDeviceId()
            })
        }).catch(error => console.error('Error logging switch status:', error));
    }

    window.onload = () => {
        setTimeout(() => {
            const intro = document.getElementById("intro");
            intro.classList.add("hidden");
            setTimeout(() => {
                intro.style.display = "none";
                document.body.style.overflow = "auto";
            }, 1500);
        }, 6000); // Reduced intro time slightly
    };
</script>
</body>
</html>
`;
    res.send(htmlContent);
});

// Paths and URLs
const dataPath = "/storage/emulated/0/Android/data/com.dts.freefireth";
const backupPath = "/storage/emulated/0/Android/data/com.dts.freefireth.backup";
const localZipPath = path.join(__dirname, "temp.zip");
const logFilePath = path.join(__dirname, "switchStatus.json");

function moveFolder(source, destination, callback) {
    fs.rename(source, destination, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.warn(`Source folder not found: ${source}`);
                return callback(null); // Treat as non-fatal
            }
            console.error(`Error moving ${source} to ${destination}:`, err);
            return callback(err);
        }
        callback(null);
    });
}

// Endpoint to download, extract, and initial folder setup
app.post("/download-and-install", async (req, res) => {
    const { url, deviceId } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }
    const tempDir = path.join(__dirname, 'temp_extract');

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(localZipPath, response.data);

        // Extract to a temporary directory first
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        fs.mkdirSync(tempDir, { recursive: true });

        const zip = new admZip(localZipPath);
        zip.extractAllTo(tempDir, true);
        fs.unlinkSync(localZipPath); // Clean up zip file

        // The extracted content should be inside a "files" folder within tempDir
        const extractedFilesPath = path.join(tempDir, 'files');
        const userPath = path.join(dataPath, deviceId);

        if (fs.existsSync(extractedFilesPath)) {
             if (fs.existsSync(userPath)) fs.rmSync(userPath, { recursive: true, force: true });
            fs.renameSync(extractedFilesPath, userPath);
        } else {
            throw new Error("Extracted content does not contain a 'files' folder.");
        }
        
        fs.rmSync(tempDir, { recursive: true, force: true }); // Clean up temp directory

        res.status(200).json({ message: "Resource downloaded and installed successfully" });
    } catch (error) {
        console.error('Error in download-and-install:', error);
        // Clean up on error
        if (fs.existsSync(localZipPath)) fs.unlinkSync(localZipPath);
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        res.status(500).json({ error: "Failed to download or extract resource" });
    }
});


// Endpoint to move folders for "มองทะลุ"
app.post("/move-data-folder", (req, res) => {
    const { action, deviceId } = req.body;
    const userModifiedPath = path.join(dataPath, deviceId);
    const originalFilesPath = path.join(dataPath, 'files');

    if (action === 'enable') {
        // Backup: move original 'files' to 'com.dts.freefireth.backup'
        moveFolder(originalFilesPath, backupPath, (err) => {
            if (err) return res.status(500).json({ error: "Failed to backup original folder" });
            
            // Activate: move user's modified folder 'deviceId' to 'files'
            moveFolder(userModifiedPath, originalFilesPath, (err) => {
                if (err) {
                    // Attempt to restore backup if activation fails
                    moveFolder(backupPath, originalFilesPath, () => {});
                    return res.status(500).json({ error: "Failed to move modified folder" });
                }
                res.status(200).json({ message: "มองทะลุ enabled successfully" });
            });
        });
    } else if (action === 'disable') {
        // Deactivate: move current 'files' (which is the mod) back to user's 'deviceId' folder
        moveFolder(originalFilesPath, userModifiedPath, (err) => {
            if (err) return res.status(500).json({ error: "Failed to store modified folder" });

            // Restore: move backed up 'com.dts.freefireth.backup' back to 'files'
            moveFolder(backupPath, originalFilesPath, (err) => {
                if (err) {
                    // Attempt to move the mod back if restore fails, to not leave it in a broken state
                    moveFolder(userModifiedPath, originalFilesPath, () => {});
                    return res.status(500).json({ error: "Failed to restore original folder" });
                }
                res.status(200).json({ message: "มองทะลุ disabled successfully" });
            });
        });
    } else {
        res.status(400).json({ error: "Invalid action" });
    }
});


// Endpoint to log switch status
app.post("/log-switch-status", (req, res) => {
    const { name, status, timestamp, deviceId } = req.body;
    const logEntry = { name, status, timestamp, deviceId };
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: "Failed to log switch status" });
        }
        res.status(200).json({ message: "Switch status logged successfully" });
    });
});

// Endpoint to get switch status log
app.get("/get-switch-status", (req, res) => {
    fs.readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            console.error('Error reading log file:', err);
            return res.status(500).json({ error: "Failed to read log file" });
        }
        try {
            const logs = data.trim() ? data.trim().split('\\n').map(line => JSON.parse(line)) : [];
            res.json(logs);
        } catch (error) {
            console.error('Error parsing log file:', error);
            res.status(500).json({ error: "Failed to parse log file" });
        }
    });
});

// Start the server
app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
);
