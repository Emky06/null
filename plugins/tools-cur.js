//Plugin fatto da Axtral_WiZaRd
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}')

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
const saveUsers = users => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))

const getLastfmUsername = userId => getUsers()[userId]?.username || null

const initUser = (users, jid) => {
  if (!users[jid]) {
    users[jid] = {
      username: null,
      likes: 0,
      dislikes: 0,
      lastTracks: []
    }
  }
}

const setLastfmUsername = (userId, username) => {
  const users = getUsers()
  initUser(users, userId)
  users[userId].username = username
  saveUsers(users)
}

async function getRecentTrack(username) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
  const res = await fetch(url)
  const json = await res.json()
  return json?.recenttracks?.track?.[0]
}

async function getRecentTracks(username, limit = 5) {
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

  let imageUrl = track.image?.find(img => img.size === 'extralarge')?.['#text']

  try {
    if (!imageUrl) throw 'no image'
    const img = await Jimp.read(imageUrl)
    img.cover(width, height)
    return await img.getBufferAsync(Jimp.MIME_JPEG)
  } catch {
    const fallback = new Jimp(width, height, '#111111')
    return await fallback.getBufferAsync(Jimp.MIME_JPEG)
  }
}

const handler = async (m, { conn, usedPrefix, text, command }) => {

  if (m.message?.buttonsResponseMessage) {
    const id = m.message.buttonsResponseMessage.selectedButtonId
    if (!id.startsWith('like|') && !id.startsWith('dislike|')) return

    const [type, target] = id.split('|')
    if (m.sender === target) {
      return conn.sendMessage(m.chat, {
        text: '🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐥𝐢𝐤𝐞 𝐨 𝐝𝐢𝐬𝐥𝐢𝐤𝐞 𝐚 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.'
      })
    }

    const users = getUsers()
    initUser(users, target)

    if (type === 'like') users[target].likes++
    if (type === 'dislike') users[target].dislikes++

    saveUsers(users)

    return conn.sendMessage(m.chat, {
      text: `${type === 'like' ? '❤️' : '💔'} 𝐇𝐚𝐢 𝐫𝐞𝐚𝐠𝐢𝐭𝐨 𝐚 @${target.split('@')[0]}`,
      mentions: [target]
    })
  }

  if (command === 'setuser') {
    if (!text) {
      return conn.sendMessage(m.chat, {
        text: `❌ 𝐔𝐬𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐜𝐨𝐬𝐢̀: ${usedPrefix}setuser <username>`
      })
    }
    setLastfmUsername(m.sender, text.trim())
    return conn.sendMessage(m.chat, {
      text: `✅ 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 *${text.trim()}* 𝐬𝐚𝐥𝐯𝐚𝐭𝐨!`
    })
  }

  const user = getLastfmUsername(m.sender)
  if (!user) {
    return conn.sendMessage(m.chat, {
      text: `🎵 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞 Last.fm 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚\n\n𝐔𝐬𝐚:\n${usedPrefix}setuser <𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞>`
    })
  }

  if (command === 'cur') {
    const track = await getRecentTrack(user)
    if (!track) return conn.sendMessage(m.chat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐭𝐫𝐚𝐜𝐜𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' })

    const info = await getTrackInfo(user, track.artist['#text'], track.name)
    const userPlaycount = parseInt(info?.userplaycount) || 0
    const globalPlaycount = parseInt(info?.playcount) || 0
    const listeners = parseInt(info?.listeners) || 0

    const users = getUsers()
    initUser(users, m.sender)

    users[m.sender].lastTracks.unshift({
      track: track.name,
      artist: track.artist['#text']
    })
    users[m.sender].lastTracks = users[m.sender].lastTracks.slice(0, 3)
    saveUsers(users)

    const caption =
      track['@attr']?.nowplaying === 'true'
        ? `🎧 𝐈𝐧 𝐫𝐢𝐩𝐫𝐨𝐝𝐮𝐳𝐢𝐨𝐧𝐞 𝐨𝐫𝐚 • @${m.sender.split('@')[0]}\n\n🎵 *${track.name}*\n🎤 ${track.artist['#text']}\n💿 ${track.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${listeners.toLocaleString()}`
        : `⏹️ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐛𝐫𝐚𝐧𝐨 • @${m.sender.split('@')[0]}\n\n🎵 *${track.name}*\n🎤 ${track.artist['#text']}\n💿 ${track.album?.['#text'] || '𝐀𝐥𝐛𝐮𝐦 𝐬𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨'}\n\n🔁 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐢 ${userPlaycount}\n🌍 𝐀𝐬𝐜𝐨𝐥𝐭𝐢 𝐠𝐥𝐨𝐛𝐚𝐥𝐢 ${globalPlaycount.toLocaleString()}\n👥 𝐀𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐨𝐫𝐢 ${listeners.toLocaleString()}`

    const buffer = await generateTrackImage(track)

    return conn.sendMessage(m.chat, {
      image: buffer,
      caption,
      mentions: conn.parseMention(caption),
      footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
      buttons: [
        { buttonId: `${usedPrefix}like ${m.sender}`, buttonText: { displayText: '❤️ Like' }, type: 1 },
        { buttonId: `${usedPrefix}dislike ${m.sender}`, buttonText: { displayText: '💔 Dislike' }, type: 1 },
        { buttonId: `${usedPrefix}play1 ${track.artist['#text']} ${track.name}`, buttonText: { displayText: '⬇️ Scarica Audio' }, type: 1 }
      ],
      headerType: 4
    })
  }

  if (command === 'cronologia') {
    const tracks = await getRecentTracks(user, 5)
    if (!tracks.length) return conn.sendMessage(m.chat, { text: '❌ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐫𝐨𝐧𝐨𝐥𝐨𝐠𝐢𝐚 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.' })

    const list = tracks
      .map((t, i) => `${t['@attr']?.nowplaying ? '▶️' : `${i + 1}.`} ${t.name}\n   🎤 ${t.artist['#text']}`)
      .join('\n\n')

    return conn.sendMessage(m.chat, { text: `📜 *𝐂𝐫𝐨𝐧𝐨𝐥𝐨𝐠𝐢𝐚 𝐝𝐢 ${user}*\n\n${list}` })
  }

  if (command === 'ilmiocur') {
    let target = m.sender
    if (m.mentionedJid?.length) target = m.mentionedJid[0]
    if (m.quoted) target = m.quoted.sender

    const users = getUsers()
    if (!users[target]) {
      return conn.sendMessage(m.chat, { text: '❌ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐞̀ 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.' })
    }

    const u = users[target]
    const last = u.lastTracks.length
      ? u.lastTracks.map(t => `🎵 ${t.track}\n🎤 ${t.artist}`).join('\n\n')
      : 'Nessuna'

    return conn.sendMessage(m.chat, {
      text: `👤 *𝐏𝐫𝐨𝐟𝐢𝐥𝐨 𝐦𝐮𝐬𝐢𝐜𝐚𝐥𝐞*\n@${target.split('@')[0]}\n\n❤️ 𝐋𝐢𝐤𝐞: ${u.likes}\n💔 𝐃𝐢𝐬𝐥𝐢𝐤𝐞: ${u.dislikes}\n\n🕒 *𝐔𝐥𝐭𝐢𝐦𝐞 𝐜𝐚𝐧𝐳𝐨𝐧𝐢:*\n${last}`,
      mentions: [target]
    })
  }
}

handler.command = ['setuser', 'cur', 'cronologia', 'ilmiocur', 'like', 'dislike']
handler.group = true

export default handler