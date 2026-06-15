//Fatto da Kinder
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, '../storage/file-json/lastfm_users.json');

const getDB = () =>
    fs.existsSync(databasePath)
        ? JSON.parse(fs.readFileSync(databasePath, 'utf-8'))
        : {};

const saveDB = (data) =>
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9';
const DEFAULT_COVER = './icone/cur.jpg';

if (!fs.existsSync(path.dirname(databasePath))) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

async function apiCall(method, params) {
    try {
        const query = new URLSearchParams({
            method,
            api_key: LASTFM_API_KEY,
            format: 'json',
            ...params
        });

        const res = await axios.get(
            `https://ws.audioscrobbler.com/2.0/?${query}`,
            { timeout: 10000 }
        );

        return res.data;
    } catch (e) {
        console.error('LastFM API Error:', e.message);
        return { error: e.response?.status || 'Unknown', message: e.message };
    }
}

async function fetchCover(lastFmImages, query, isArtist = false) {
    const sizes = ['mega', 'extralarge', 'large', 'medium', 'small'];

    for (const size of sizes) {
        const cover = lastFmImages?.find(i => i.size === size)?.['#text'];
        if (cover && cover.trim() && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
            return cover;
        }
    }

    return DEFAULT_COVER;
}

async function retryScreenshot(html, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setViewport({ width: 1000, height: 600 });
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const buffer = await page.screenshot({ type: 'jpeg', quality: 90 });

            await browser.close();
            return Buffer.from(buffer);
        } catch (e) {
            console.error('Screenshot Error:', e.message);
            if (browser) await browser.close().catch(() => {});

            if (i === retries - 1) throw e;

            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }
}

function handleFire(targetJid, senderJid, trackName, conn, targetQuote, targetChat) {
    if (targetJid === senderJid) {
        conn.sendMessage(targetChat, {
            text: '❌ Non puoi metterti 🔥 da solo'
        }, { quoted: targetQuote });
        return false;
    }

    if (!global.db.data.users[targetJid]) {
        global.db.data.users[targetJid] = {};
    }

    global.db.data.users[targetJid].fuochi =
        (global.db.data.users[targetJid].fuochi || 0) + 1;

    conn.sendMessage(targetChat, {
        text: `🔥 @${senderJid.split('@')[0]} ha messo 🔥 a *"${trackName}"* di @${targetJid.split('@')[0]}`,
        mentions: [senderJid, targetJid]
    }, { quoted: targetQuote });

    return true;
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
    const db = getDB();

    let targetChat = m.chat;
    let targetQuote = m;
    let actualSender = m.sender;

    const reply = (txt) =>
        conn.sendMessage(targetChat, { text: txt }, { quoted: targetQuote });

    let targetUser = m.sender;

    if (m.mentionedJid?.length) {
        targetUser = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        targetUser = m.quoted.sender;
    } else if (text?.includes('@')) {
        const match = text.match(/@(\d+)/);
        if (match) targetUser = match[1] + '@s.whatsapp.net';
    }

    const targetNumber = targetUser.split('@')[0];

    let user = null;
    for (const jidKey in db) {
        if (jidKey.startsWith(targetNumber)) {
            user = db[jidKey];
            break;
        }
    }

    if (command === 'firec') {
        const [target, track] = (text || '').split('|').map(t => t?.trim());
        if (!target || !track) {
            return reply(`❌ Uso: ${usedPrefix}firec @utente|brano`);
        }

        const targetJid = target.includes('@')
            ? target
            : target + '@s.whatsapp.net';

        handleFire(targetJid, actualSender, track, conn, targetQuote, targetChat);
        return;
    }

    if (command === 'curc') {
        try {
            const res = await apiCall('user.getrecenttracks', { user, limit: 1 });
            if (res.error) return reply('❌ Errore Last.fm');

            const track = res.recenttracks?.track?.[0];
            if (!track) return reply('❌ Nessun brano trovato.');

            const info = await apiCall('track.getInfo', {
                artist: track.artist['#text'],
                track: track.name,
                username: user
            });

            const isNowPlaying = track['@attr']?.nowplaying === 'true';

            const html = `
<html>
<body style="background:black;color:white;font-family:sans-serif">
<h1>${track.name}</h1>
<h2>${track.artist['#text']}</h2>
<p>${isNowPlaying ? 'NOW PLAYING' : 'LAST TRACK'}</p>
</body>
</html>`;

            const buffer = await retryScreenshot(html);

            await conn.sendMessage(targetChat, {
                image: buffer,
                caption: `🎧 *@${user}*\n🎵 ${track.name}\n👤 ${track.artist['#text']}`
            }, { quoted: targetQuote });

        } catch (e) {
            console.error(e);
            reply('❌ Errore comando curc');
        }
        return;
    }

    if (command === 'profilolastfmc') {
        try {
            const res = await apiCall('user.getinfo', { user });
            if (res.error) return reply('❌ Errore Last.fm');

            const u = res.user;

            const html = `
<html>
<body style="background:black;color:white;font-family:sans-serif">
<h1>${u.name}</h1>
<p>Playcount: ${u.playcount}</p>
<p>Country: ${u.country}</p>
</body>
</html>`;

            const buffer = await retryScreenshot(html);

            await conn.sendMessage(targetChat, {
                image: buffer,
                caption: `👤 *@${u.name}*\n🌍 ${u.country}\n🎵 Plays: ${u.playcount}`,
                mentions: [targetUser]
            }, { quoted: targetQuote });

        } catch (e) {
            console.error(e);
            reply('❌ Errore profilo');
        }
        return;
    }
};

handler.help = ['curc', 'firec', 'profilolastfmc'];
handler.command = ['curc', 'firec', 'profilolastfmc'];

export default handler;