// Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  }
  return number.toString().split('').map(d => map[d] || d).join('')
}

const formatDate = date => {
  const day = toMathematicalAlphanumericSymbols(String(date.getDate()).padStart(2, '0'))
  const month = toMathematicalAlphanumericSymbols(String(date.getMonth() + 1).padStart(2, '0'))
  const year = toMathematicalAlphanumericSymbols(String(date.getFullYear()))
  return `${day}/${month}/${year}`
}

let handler = async (m, { conn, usedPrefix }) => {
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)

  const groupsFiltered = (
    await Promise.all(
      chats
        .filter(([id]) => id.endsWith('@g.us'))
        .map(async ([id, data]) => {
          try {
            const meta = data.metadata || await conn.groupMetadata(id)
            if (meta?.isCommunity || meta?.announce || meta?.read_only) return null
            return id
          } catch {
            return null
          }
        })
    )
  ).filter(Boolean)

  const totalUsers = Object.keys(global.db.data.users).length
  const totalPlugins = Object.keys(global.plugins).length

  const ownerNumber = global.owner?.[0]?.[0] || ''
  const ownerLink = ownerNumber
    ? `https://wa.me/${toMathematicalAlphanumericSymbols(ownerNumber)}`
    : 'Non disponibile'

  const creationDate = `${toMathematicalAlphanumericSymbols(16)}/${toMathematicalAlphanumericSymbols(2)}/${toMathematicalAlphanumericSymbols(2025)}`

  const quoted = {
    key: {
      participants: '0@s.whatsapp.net',
      fromMe: false,
      id: 'InfoBot'
    },
    message: {
      locationMessage: {
        name: '𝐈𝐧𝐟𝐨𝐁𝐨𝐭',
        jpegThumbnail: fs.readFileSync('icone/logobot.png')
      }
    },
    participant: '0@s.whatsapp.net'
  }

  const text = `
╭━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *𝐈𝐧𝐟𝐨𝐁𝐨𝐭* 🤖
┃
┃➤ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐞:
┃   ${ownerLink}
┃
┃➤ 𝐍𝐨𝐦𝐞 𝐁𝐨𝐭:
┃   𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
┃
┃➤ 𝐒𝐭𝐚𝐭𝐨:
┃   _Online_
┃
┃➤ 𝐂𝐫𝐞𝐚𝐭𝐨 𝐢𝐥:
┃   ${creationDate}
┃
┃➤ 𝐆𝐫𝐮𝐩𝐩𝐢: ${toMathematicalAlphanumericSymbols(groupsFiltered.length)}
┃➤ 𝐔𝐭𝐞𝐧𝐭𝐢: ${toMathematicalAlphanumericSymbols(totalUsers)}
┃➤ 𝐏𝐥𝐮𝐠𝐢𝐧𝐬: ${toMathematicalAlphanumericSymbols(totalPlugins)}
┃➤ 𝐌𝐞𝐧𝐮: ${usedPrefix}menu
╰━━━━━━━━━━━━━━━━━━━╯
`.trim()

  await conn.sendMessage(m.chat, { text }, { quoted })
}

handler.command = ['infobot', 'botinfo']
handler.tags = ['menu']
handler.help = ['infobot']

export default handler