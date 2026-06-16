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

    const html = `
    <html>    
    <head>    
        <style>    
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');    
            body { margin: 0; padding: 0; width: 1000px; height: 600px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; background: #000; overflow: hidden; }    
            .background { position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); }    
            .glass-card { position: relative; width: 880px; height: 480px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 50px; display: flex; align-items: center; padding: 45px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }    
            .avatar { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }    
            .details { flex: 1; margin-left: 50px; color: white; }    
            .username { font-size: 48px; font-weight: 800; letter-spacing: -1.5px; margin-bottom: 10px; }    
            .stats { margin-top: 20px; }    
            .stat-item { display: flex; align-items: baseline; margin-bottom: 15px; }    
            .stat-label { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.5); width: 120px; }    
            .stat-value { font-size: 28px; font-weight: 800; color: #32d74b; }    
            .country { font-size: 18px; color: rgba(255,255,255,0.6); margin-top: 10px; display: flex; align-items: center; gap: 8px; }    
        </style>    
    </head>    
    <body>    
        <div class="background"></div>    
        <div class="glass-card">    
            <img src="${avatarUrl}" class="avatar" />    
            <div class="details">    
                <div class="username">@${user.name}</div>    
                <div class="stats">    
                    <div class="stat-item">    
                        <div class="stat-label">ASCOLTI</div>    
                        <div class="stat-value">${parseInt(user.playcount).toLocaleString()}</div>    
                    </div>    
                    <div class="stat-item">    
                        <div class="stat-label">ARTISTI</div>    
                        <div class="stat-value">${parseInt(user.artist_count).toLocaleString()}</div>    
                    </div>    
                    <div class="country">🌍 ${user.country || 'N/A'}</div>    
                    <div class="country">📅 Registrato: ${registeredDate}</div>    
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

function getTargetJid(m, text) {
    if (m.quoted?.sender) return m.quoted.sender
    if (m.mentionedJid?.length) return m.mentionedJid[0]
    const jid = normalizeJid(text)
    if (jid) return jid
    return m.sender
}

const handler = async (m, { conn, args, usedPrefix, text, command }) => {
    let targetChat = m.chat
    let targetQuote = m

    if (command === 'firec') {
        const targetJid = getTargetJid(m, text)
        const trackName = args.slice(1).join(' ') || 'brano'

        if (targetJid === m.sender) {
            await conn.sendMessage(targetChat, { text: '❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐞𝐭𝐭𝐞𝐫𝐭𝐢 🔥 𝐝𝐚 𝐬𝐨𝐥𝐨' }, { quoted: targetQuote })
            return
        }

        if (!global.db.data.users[targetJid]) {
            global.db.data.users[targetJid] = {}
        }

        global.db.data.users[targetJid].fuochi = (global.db.data.users[targetJid].fuochi || 0) + 1

        await conn.sendMessage(targetChat, {
            text: `🔥 @${m.sender.split('@')[0]} 𝐡𝐚 𝐦𝐞𝐬𝐬𝐨 🔥 𝐚 *"${trackName}"* 𝐝𝐢 @${targetJid.split('@')[0]}`,
            mentions: [m.sender, targetJid]
        }, { quoted: targetQuote })
        return
    }

    if (command === 'curc') {
        const targetJid = getTargetJid(m, text)
        const user = getLastfmUsername(targetJid)

        if (!user) {
            await conn.sendMessage(
                targetChat,
                {
                    text: `🎵 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞 Last.fm 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚

@${targetJid.split('@')[0]}, 𝐩𝐞𝐫 𝐮𝐬𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐦𝐮𝐬𝐢𝐜𝐚𝐥𝐢 𝐝𝐞𝐯𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 Last.fm.

📱 𝐔𝐬𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
.setuser <𝐭𝐮𝐨_𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞>

💡 𝐍𝐨𝐧 𝐡𝐚𝐢 Last.fm?
𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐬𝐮𝐥 𝐬𝐢𝐭𝐨, 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐢 𝐬𝐮 𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚 𝐟𝐚𝐫𝐞 𝐬𝐜𝐫𝐨𝐛𝐛𝐥𝐢𝐧𝐠 𝐝𝐞𝐥𝐥𝐚 𝐭𝐮𝐚 𝐦𝐮𝐬𝐢𝐜𝐚!`,
                    mentions: [targetJid]
                },
                { quoted: targetQuote }
            )
            return
        }

        const tracks = await getRecentTracks(user, 2)
        if (!tracks.length) {
            await conn.sendMessage(targetChat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' })
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
            ? `🎧 𝐈𝐧 𝐫𝐢𝐩𝐫𝐨𝐝𝐮𝐳𝐢𝐨𝐧𝐞 𝐨𝐫𝐚 • @${targetJid.split('@')[0]}\n\n` +
              `🎵 *${current.name}*\n🎤 ${current.artist['#text']}\n💿 ${current.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n` +
              `🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${globalListeners.toLocaleString()}`
            : `⏹️ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐛𝐫𝐚𝐧𝐨 𝐝𝐢 @${targetJid.split('@')[0]}:\n\n` +
              `🎵 *${current.name}*\n🎤 ${current.artist['#text']}\n💿 ${current.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n` +
              `🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${globalListeners.toLocaleString()}`

        await conn.sendMessage(targetChat, {
            image: buffer,
            caption: caption,
            mentions: [targetJid],
            footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
            buttons: [
                {
                    buttonId: `${usedPrefix}firec ${targetJid}|${current.name}`,
                    buttonText: { displayText: "🔥" },
                    type: 1
                }
            ],
            headerType: 4
        })
        return
    }

    if (command === 'profilolastfmc') {
        const targetJid = getTargetJid(m, text)
        const user = getLastfmUsername(targetJid)

        if (!user) {
            await conn.sendMessage(
                targetChat,
                {
                    text: `🎵 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞 Last.fm 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚

@${targetJid.split('@')[0]}, 𝐩𝐞𝐫 𝐮𝐬𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐦𝐮𝐬𝐢𝐜𝐚𝐥𝐢 𝐝𝐞𝐯𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 Last.fm.

📱 𝐔𝐬𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
.setuser <𝐭𝐮𝐨_𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞>

💡 𝐍𝐨𝐧 𝐡𝐚𝐢 Last.fm?
𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐬𝐮𝐥 𝐬𝐢𝐭𝐨, 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐢 𝐬𝐮 𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚 𝐟𝐚𝐫𝐞 𝐬𝐜𝐫𝐨𝐛𝐛𝐥𝐢𝐧𝐠 𝐝𝐞𝐥𝐥𝐚 𝐭𝐮𝐚 𝐦𝐮𝐬𝐢𝐜𝐚!`,
                    mentions: [targetJid]
                },
                { quoted: targetQuote }
            )
            return
        }

        const userInfo = await getUserInfo(user)

        if (!userInfo || userInfo.error) {
            await conn.sendMessage(targetChat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' })
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
                mentions: [targetJid]
            }, { quoted: targetQuote })
            return
        }

        await conn.sendMessage(targetChat, {
            image: buffer,
            caption: `👤 *Profilo Last.fm di @${targetJid.split('@')[0]}*`,
            mentions: [targetJid]
        }, { quoted: targetQuote })
        return
    }
}

handler.command = ['curc', 'profilolastfmc', 'firec']
handler.group = true

export default handler