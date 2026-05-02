//Plugin fatto da Axtral_WiZaRd
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, 'storage', 'file-json', 'lastfm_users.json');

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}')

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

function getLastfmUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function saveLastfmUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

function getLastfmUsername(userId) {
  const users = getLastfmUsers()
  return users[userId] || null
}

function setLastfmUsername(userId, username) {
  const users = getLastfmUsers()
  users[userId] = username
  saveLastfmUsers(users)
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

async function generateTrackImage(track) {
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
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) {
      await conn.sendMessage(m.chat, { text: `❌ 𝐔𝐬𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐜𝐨𝐬𝐢̀: ${usedPrefix}setuser <username>` })
      return
    }

    setLastfmUsername(m.sender, username)
    await conn.sendMessage(m.chat, { text: `✅ 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 *${username}* 𝐬𝐚𝐥𝐯𝐚𝐭𝐨!` })
    return
  }

  if (command === 'fire') {
    const [target, track] = text.split('|').map(t => t.trim())

    if (target === m.sender) {
      await conn.sendMessage(m.chat, { text: '❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐞𝐭𝐭𝐞𝐫𝐭𝐢 🔥 𝐝𝐚 𝐬𝐨𝐥𝐨' }, { quoted: m })
      return
    }

    if (!global.db.data.users[target]) return

    global.db.data.users[target].fuochi =
      (global.db.data.users[target].fuochi || 0) + 1

    await conn.sendMessage(m.chat, {
      text: `🔥 @${m.sender.split('@')[0]} 𝐡𝐚 𝐦𝐞𝐬𝐬𝐨 𝐥𝐢𝐤𝐞 𝐚 *"${track}"* 𝐝𝐢 @${target.split('@')[0]}`,
      mentions: [m.sender, target]
    }, { quoted: m })

    return
  }

  if (command === 'cur') {
    const targetJid = getTargetJid(m, text)
    const user = getLastfmUsername(targetJid)

    if (!user) {
      await conn.sendMessage(
        m.chat,
        {
          text: `🎵 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞 Last.fm 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚

@${targetJid.split('@')[0]}, 𝐩𝐞𝐫 𝐮𝐬𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐦𝐮𝐬𝐢𝐜𝐚𝐥𝐢 𝐝𝐞𝐯𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 Last.fm.

📱 𝐔𝐬𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
.setuser <𝐭𝐮𝐨_𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞>

💡 𝐍𝐨𝐧 𝐡𝐚𝐢 Last.fm?
𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐬𝐮𝐥 𝐬𝐢𝐭𝐨, 𝐜𝐨𝐧𝐧𝐞𝐭𝐭𝐢 𝐬𝐮 𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚 𝐟𝐚𝐫𝐞 𝐬𝐜𝐫𝐨𝐛𝐛𝐥𝐢𝐧𝐠 𝐝𝐞𝐥𝐥𝐚 𝐭𝐮𝐚 𝐦𝐮𝐬𝐢𝐜𝐚!`,
          mentions: [targetJid]
        },
        { quoted: m }
      )
      return
    }

    const tracks = await getRecentTracks(user, 2)
    if (!tracks.length) return conn.sendMessage(m.chat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' })

    const current = tracks[0]
    const last = tracks[1]
    const detailedTrack = await getTrackInfo(user, current.artist['#text'], current.name)

    const userPlaycount = parseInt(detailedTrack?.userplaycount) || 0
    const globalPlaycount = parseInt(detailedTrack?.playcount) || 0
    const globalListeners = parseInt(detailedTrack?.listeners) || 0

    const buffer = await generateTrackImage(current)

    const caption = current['@attr']?.nowplaying === 'true'
      ? `🎧 𝐈𝐧 𝐫𝐢𝐩𝐫𝐨𝐝𝐮𝐳𝐢𝐨𝐧𝐞 𝐨𝐫𝐚 • @${targetJid.split('@')[0]}\n\n` +
        `🎵 *${current.name}*\n🎤 ${current.artist['#text']}\n💿 ${current.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n` +
        `🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${globalListeners.toLocaleString()}`
      : `⏹️ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐛𝐫𝐚𝐧𝐨 𝐝𝐢 @${targetJid.split('@')[0]}:\n\n` +
        `🎵 *${current.name}*\n🎤 ${current.artist['#text']}\n💿 ${current.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n` +
        `🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${globalListeners.toLocaleString()}`

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption,
      mentions: conn.parseMention(caption),
      footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
      buttons: [
        {
          buttonId: `${usedPrefix}fire ${targetJid}|${current.name}`,
          buttonText: { displayText: "🔥" },
          type: 1
        },
        {
          buttonId: `${usedPrefix}play1 ${current.artist['#text']} ${current.name}`,
          buttonText: { displayText: "⬇️ 𝐒𝐜𝐚𝐫𝐢𝐜𝐚 𝐚𝐮𝐝𝐢𝐨" },
          type: 1
        }
      ],
      headerType: 4
    })
    return
  }

  if (command === 'cronologia') {
    const user = getLastfmUsername(m.sender)
    if (!user) return

    const tracks = await getRecentTracks(user, 5)
    if (!tracks.length) return conn.sendMessage(m.chat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐫𝐨𝐧𝐨𝐥𝐨𝐠𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' })

    const trackList = tracks.map((t, i) => {
      const icon = t['@attr']?.nowplaying === 'true' ? '▶️' : `${i + 1}.`
      return `${icon} ${t.name}\n   🎤 ${t.artist['#text']}`
    }).join('\n\n')

    const cron = `📜 *𝐂𝐫𝐨𝐧𝐨𝐥𝐨𝐠𝐢𝐚 𝐝𝐢 ${user}*\n\n${trackList}`
    await conn.sendMessage(m.chat, { text: cron })
    return
  }
}

handler.command = ['setuser', 'cur', 'cronologia', 'fire']
handler.group = true

export default handler