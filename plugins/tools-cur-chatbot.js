//Plugin fatto da Axtral_WiZaRd
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(process.cwd(), 'storage', 'file-json', 'lastfm_users.json');

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}')

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'
const BROWSERLESS_KEY = global.browserless;

function getLastfmUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function getLastfmUsername(userId) {
    const users = getLastfmUsers()
    const normalizedId = userId.split('@')[0]
    for (const [key, value] of Object.entries(users)) {
        if (key.startsWith(normalizedId)) {
            return value
        }
    }
    return null
}

async function getRecentTracks(username, limit = 2) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`
    const res = await fetch(url)
    const json = await res.json()
    return json?.recenttracks?.track || []
}

async function getTrackInfo(username, artist, track) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${username}&format=json`
    const res = await fetch(url)
    const json = await res.json()
    return json?.track
}

async function getUserInfo(username) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${LASTFM_API_KEY}&format=json`
    const res = await fetch(url)
    const json = await res.json()
    return json?.user
}

async function generateTrackImageBrowserless(track) {
    let imageUrl = 
        track.image?.find(i => i.size === 'extralarge')?.['#text'] ||
        track.image?.find(i => i.size === 'large')?.['#text'] ||
        track.image?.find(i => i.size === 'medium')?.['#text']

    if (!imageUrl || imageUrl.trim() === '') {
        const fallbackPath = path.join(__dirname, '../icone/cur.jpg')
        const fallbackBuffer = fs.readFileSync(fallbackPath)
        const fallbackBase64 = fallbackBuffer.toString('base64')
        imageUrl = `data:image/jpeg;base64,${fallbackBase64}`
    }

    const isNowPlaying = track['@attr']?.nowplaying === 'true'
    const statusColor = isNowPlaying ? '#32d74b' : '#ff3b30'
    const statusText = isNowPlaying ? 'In Riproduzione' : 'Ultimo Ascoltato'

    const html = `
    <html>    
    <head>    
        <style>    
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');    
            body { margin: 0; padding: 0; width: 1000px; height: 600px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; background: #000; overflow: hidden; }    
            .background { position: absolute; width: 100%; height: 100%; background: url('${imageUrl}') center/cover; filter: blur(30px) brightness(0.7); opacity: 0.7; }    
            .glass-card { position: relative; width: 880px; height: 480px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 50px; display: flex; align-items: center; padding: 45px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }    
            .album-art { width: 340px; height: 340px; border-radius: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); object-fit: cover; }    
            .details { flex: 1; margin-left: 50px; color: white; }    
            .status { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: ${statusColor}; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }    
            .track-name { font-size: 44px; font-weight: 800; line-height: 1.1; margin-bottom: 10px; letter-spacing: -1.5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 400px; }    
            .artist-name { font-size: 26px; color: rgba(255,255,255,0.6); font-weight: 600; margin-bottom: 30px; }    
        </style>    
    </head>    
    <body>    
        <div class="background"></div>    
        <div class="glass-card">    
            <img src="${imageUrl}" class="album-art" />    
            <div class="details">    
                <div class="status"><span style="width:10px; height:10px; background:currentColor; border-radius:50%; box-shadow: 0 0 1px currentColor;"></span>${statusText}</div>    
                <div class="track-name">${track.name}</div>    
                <div class="artist-name">${track.artist['#text']}</div>    
            </div>    
        </div>    
    </body>    
    </html>`

    for (let i = 0; i < 5; i++) {
        try {
            const response = await axios.post(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, {
                html,
                options: { type: 'jpeg', quality: 90 },
                viewport: { width: 1000, height: 600 }
            }, { responseType: 'arraybuffer', timeout: 15000 });
            return Buffer.from(response.data);
        } catch (e) {
            if (i === 4) throw e;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function generateProfileImageBrowserless(user) {
    const avatarUrl = user.image?.find(i => i.size === 'extralarge')?.['#text'] ||
                      user.image?.find(i => i.size === 'large')?.['#text'] ||
                      'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'

    const registeredDate = new Date(user.registered?.unixtime * 1000).toLocaleDateString('it-IT')
    const age = user.age > 0 ? user.age : 'N/A'
    const gender = user.gender === 'm' ? 'Maschio' : user.gender === 'f' ? 'Femmina' : 'N/A'
    const subscriber = user.subscriber === '1' ? 'Sì' : 'No'
    const realname = user.realname || user.name
    const country = user.country || 'N/A'
    const playcount = parseInt(user.playcount || 0).toLocaleString()
    const playlists = user.playlists || 0

    const html = `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
            body { margin: 0; padding: 0; width: 1000px; height: 600px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; background: #000; overflow: hidden; }
            .background { position: absolute; width: 100%; height: 100%; background: url('${avatarUrl}') center/cover; filter: blur(30px) brightness(0.7); opacity: 0.7; }
            .glass-card { position: relative; width: 880px; height: 480px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 50px; display: flex; align-items: center; padding: 35px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
            .album-art { width: 340px; height: 340px; border-radius: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); object-fit: cover; }
            .details { flex: 1; margin-left: 45px; color: white; display: flex; flex-direction: column; justify-content: center; }
            .status { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #0a84ff; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
            .track-name { font-size: 40px; font-weight: 800; line-height: 1.1; margin-bottom: 4px; letter-spacing: -1.5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 420px; }
            .artist-name { font-size: 22px; color: rgba(255,255,255,0.6); font-weight: 600; margin-bottom: 20px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .stat-item { background: rgba(255, 255, 255, 0.04); padding: 12px 15px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.05); }
            .stat-item:last-child { grid-column: span 2; } 
            .stat-label { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; font-weight: 800; margin-bottom: 2px; }
            .stat-value { font-size: 18px; font-weight: 700; color: #fff; }
        </style>
    </head>
    <body>
        <div class="background"></div>
        <div class="glass-card">
            <img src="${avatarUrl}" class="album-art" />
            <div class="details">
                <div class="status"><span style="width:10px; height:10px; background:currentColor; border-radius:50%; box-shadow: 0 0 1px currentColor;"></span>Profilo Utente</div>
                <div class="track-name">${user.name}</div>
                <div class="artist-name">${realname}</div>
                <div class="stats-grid">
                    <div class="stat-item"><div class="stat-label">Paese</div><div class="stat-value">${country}</div></div>
                    <div class="stat-item"><div class="stat-label">Età</div><div class="stat-value">${age}</div></div>
                    <div class="stat-item"><div class="stat-label">Genere</div><div class="stat-value">${gender}</div></div>
                    <div class="stat-item"><div class="stat-label">Iscritto Dal</div><div class="stat-value">${registeredDate}</div></div>
                    <div class="stat-item"><div class="stat-label">Ascolti Totali</div><div class="stat-value">${playcount}</div></div>
                    <div class="stat-item"><div class="stat-label">Subscriber</div><div class="stat-value">${subscriber}</div></div>
                    <div class="stat-item"><div class="stat-label">Playlists</div><div class="stat-value">${playlists}</div></div>
                </div>
            </div>
        </div>
    </body>
    </html>`

    for (let i = 0; i < 5; i++) {
        try {
            const response = await axios.post(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, {
                html,
                options: { type: 'jpeg', quality: 90 },
                viewport: { width: 1000, height: 600 }
            }, { responseType: 'arraybuffer', timeout: 15000 });
            return Buffer.from(response.data);
        } catch (e) {
            if (i === 4) throw e;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function generateTrackImageJimp(track) {
    const width = 600
    const height = 600

    let imageUrl = 
        track.image?.find(i => i.size === 'extralarge')?.['#text'] ||
        track.image?.find(i => i.size === 'large')?.['#text'] ||
        track.image?.find(i => i.size === 'medium')?.['#text']

    if (!imageUrl || imageUrl.trim() === '') {
        imageUrl = path.join(__dirname, '../icone/cur.jpg')
    }

    try {
        const img = await Jimp.read(imageUrl)
        img.cover(width, height)
        return await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch (e) {
        const fallback = await Jimp.read(path.join(__dirname, '../icone/cur.jpg'))
        fallback.cover(width, height)
        return await fallback.getBufferAsync(Jimp.MIME_JPEG)
    }
}

function normalizeJid(input) {
    if (!input) return null
    const num = input.replace(/[^0-9]/g, '')
    if (!num) return null
    return num + '@s.whatsapp.net'
}

const handler = async (m, { conn, args, usedPrefix, text, command }) => {
   
    let targetChat = m.chat;
    let targetQuote = m;
    let actualSender = m.sender;
    let actualText = text || '';

    if (text && text.includes('| ROUTE:')) {
        const parts = text.split('| ROUTE:');
        actualText = parts[0].trim();
        const routeInfo = parts[1];
        const routeMatch = routeInfo.match(/(.+) \| QUOTE:(.+) \| SENDER:(.+)/);
        if (routeMatch) {
            targetChat = routeMatch[1].trim();
            const quoteId = routeMatch[2].trim();
            actualSender = routeMatch[3].trim();
            targetQuote = { key: { remoteJid: targetChat, fromMe: false, id: quoteId, participant: actualSender }, message: { conversation: "Origin Request" } };
        }
    }
    text = actualText;

    if (command === 'firec') {
    const [target, track] = text.split('|').map(t => t?.trim())
    
    if (!target || !track) {
        await conn.sendMessage(targetChat, { text: `❌ 𝐔𝐬𝐨: ${usedPrefix}firec @utente|brano` }, { quoted: targetQuote })
        return
    }

    const targetJid = target.includes('@') ? target.trim() : target.trim() + '@s.whatsapp.net'

    if (targetJid === actualSender) {
        await conn.sendMessage(targetChat, { text: '❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐞𝐭𝐭𝐞𝐫𝐭𝐢 🔥 𝐝𝐚 𝐬𝐨𝐥𝐨' }, { quoted: targetQuote })
        return
    }

    if (!global.db.data.users[targetJid]) return

    global.db.data.users[targetJid].fuochi = (global.db.data.users[targetJid].fuochi || 0) + 1

    await conn.sendMessage(targetChat, {
        text: `🔥 @${actualSender.split('@')[0]} 𝐡𝐚 𝐦𝐞𝐬𝐬𝐨 𝐥𝐢𝐤𝐞 𝐚 *"${track}"* 𝐝𝐢 @${targetJid.split('@')[0]}`,
        mentions: [actualSender, targetJid]
    }, { quoted: targetQuote })
    return
}

    if (command === 'curc') {
        let targetUser = actualSender;

        if (m.mentionedJid?.length) {
            targetUser = m.mentionedJid[0];
        } else if (m.quoted?.sender) {
            targetUser = m.quoted.sender;
        } else if (actualText.includes('@')) {
            const tagMatch = actualText.match(/@(\d+)/);
            if (tagMatch) {
                targetUser = tagMatch[1] + '@s.whatsapp.net';
            }
        }

        const user = getLastfmUsername(targetUser)

        if (!user) {
            await conn.sendMessage(
                targetChat,
                {
                    text: `🎵 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞 Last.fm 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚

@${targetUser.split('@')[0]}, 𝐩𝐞𝐫 𝐮𝐬𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐦𝐮𝐬𝐢𝐜𝐚𝐥𝐢 𝐝𝐞𝐯𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 Last.fm.

📱 𝐔𝐬𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
.setuser <𝐭𝐮𝐨_𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞>

💡 𝐍𝐨𝐧 𝐡𝐚𝐢 Last.fm?
𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐬𝐮𝐥 𝐬𝐢𝐭𝐨, 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐢 𝐬𝐮 𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚 𝐟𝐚𝐫𝐞 𝐬𝐜𝐫𝐨𝐛𝐛𝐥𝐢𝐧𝐠 𝐝𝐞𝐥𝐥𝐚 𝐭𝐮𝐚 𝐦𝐮𝐬𝐢𝐜𝐚!`,
                    mentions: [targetUser]
                },
                { quoted: targetQuote }
            )
            return
        }

        const tracks = await getRecentTracks(user, 2)
        if (!tracks.length) {
            await conn.sendMessage(targetChat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' }, { quoted: targetQuote })
            return
        }

        const current = tracks[0]
        const detailedTrack = await getTrackInfo(user, current.artist['#text'], current.name)

        const userPlaycount = parseInt(detailedTrack?.userplaycount) || 0
        const globalPlaycount = parseInt(detailedTrack?.playcount) || 0
        const globalListeners = parseInt(detailedTrack?.listeners) || 0

        let buffer

        try {
            if (BROWSERLESS_KEY) {
                buffer = await generateTrackImageBrowserless(current)
            } else {
                throw new Error('Browserless key non configurata')
            }
        } catch (e) {
            console.error('Browserless failed, using Jimp fallback:', e.message)
            buffer = await generateTrackImageJimp(current)
        }

        const caption = current['@attr']?.nowplaying === 'true'
            ? `🎧 𝐈𝐧 𝐫𝐢𝐩𝐫𝐨𝐝𝐮𝐳𝐢𝐨𝐧𝐞 𝐨𝐫𝐚 • @${targetUser.split('@')[0]}\n\n` +
              `🎵 *${current.name}*\n🎤 ${current.artist['#text']}\n💿 ${current.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n` +
              `🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${globalListeners.toLocaleString()}`
            : `⏹️ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐛𝐫𝐚𝐧𝐨 𝐝𝐢 @${targetUser.split('@')[0]}:\n\n` +
              `🎵 *${current.name}*\n🎤 ${current.artist['#text']}\n💿 ${current.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n` +
              `🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${globalListeners.toLocaleString()}`

        await conn.sendMessage(targetChat, {
            image: buffer,
            caption: caption,
            mentions: [targetUser],
            footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
            buttons: [
                {
                    buttonId: `${usedPrefix}firec ${targetUser}|${current.name}`,
                    buttonText: { displayText: "🔥" },
                    type: 1
                }
            ],
            headerType: 4
        }, { quoted: targetQuote })
        return
    }

    if (command === 'profilolastfmc') {
    let targetUser = actualSender;

    if (m.mentionedJid?.length) {
        targetUser = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        targetUser = m.quoted.sender;
    } else if (actualText.includes('@')) {
        const tagMatch = actualText.match(/@(\d+)/);
        if (tagMatch) {
            targetUser = tagMatch[1] + '@s.whatsapp.net';
        }
    }

    const user = getLastfmUsername(targetUser)

    if (!user) {
        await conn.sendMessage(
            targetChat,
            {
                text: `🎵 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞 Last.fm 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚

@${targetUser.split('@')[0]}, 𝐩𝐞𝐫 𝐮𝐬𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐦𝐮𝐬𝐢𝐜𝐚𝐥𝐢 𝐝𝐞𝐯𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 Last.fm.

📱 𝐔𝐬𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
.setuser <𝐭𝐮𝐨_𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞>

💡 𝐍𝐨𝐧 𝐡𝐚𝐢 Last.fm?
𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐬𝐮𝐥 𝐬𝐢𝐭𝐨, 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐢 𝐬𝐮 𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚 𝐟𝐚𝐫𝐞 𝐬𝐜𝐫𝐨𝐛𝐛𝐥𝐢𝐧𝐠 𝐝𝐞𝐥𝐥𝐚 𝐭𝐮𝐚 𝐦𝐮𝐬𝐢𝐜𝐚!`,
                mentions: [targetUser]
            },
            { quoted: targetQuote }
        )
        return
    }

    const userInfo = await getUserInfo(user)

    if (!userInfo || userInfo.error) {
        await conn.sendMessage(targetChat, { text: '❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐫𝐞𝐜𝐮𝐩𝐞𝐫𝐚𝐫𝐞 𝐢𝐥 𝐩𝐫𝐨𝐟𝐢𝐥𝐨.' }, { quoted: targetQuote })
        return
    }

    let buffer

    try {
        if (BROWSERLESS_KEY) {
            buffer = await generateProfileImageBrowserless(userInfo)
        } else {
            throw new Error('Browserless key non configurata')
        }
    } catch (e) {
        console.error('Browserless failed for profile:', e.message)
        await conn.sendMessage(targetChat, {
            text: `👤 *${userInfo.name}*\n🌍 ${userInfo.country || 'N/A'}\n🎵 Ascolti totali: ${parseInt(userInfo.playcount).toLocaleString()}\n🎤 Artisti ascoltati: ${parseInt(userInfo.artist_count).toLocaleString()}\n📅 Registrato: ${new Date(userInfo.registered?.unixtime * 1000).toLocaleDateString('it-IT')}`,
            mentions: [targetUser]
        }, { quoted: targetQuote })
        return
    }

    let cleanUser = targetUser.split('@')[0];
    const caption = `👤 *Profilo di* @${cleanUser}
👤 *Nome:* ${userInfo.name}
🌍 *Paese:* ${userInfo.country || 'N/A'}

> \`𝑶𝒓𝒊𝒈𝒊𝒏✦\``;

    await conn.sendMessage(targetChat, {
        image: buffer,
        caption: caption,
        footer: '𝑶𝒓𝒊𝒈𝒊𝒏✦',
        mentions: [targetUser]
    }, { quoted: targetQuote })
    return
}
}

handler.command = ['curc', 'profilolastfmc', 'firec']

export default handler