// Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const toMathematicalAlphanumericSymbols = number => {
  const map = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  }
  return number.toString().split('').map(digit => map[digit] || digit).join('')
}

const handler = async (m, { conn, usedPrefix, command }) => {
  let message = ""
  for (const [ownerNumber] of global.owner) {
    message += `\nwa.me/${ownerNumber}`
  }

  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  const user = global.db.data.users[mention] || {}

  // tutte le chat che il bot conosce
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)

  // filtra i gruppi veri (niente community/bacheche)
  const groupsIn = await Promise.all(
    chats
      .filter(([id]) => id.endsWith('@g.us'))
      .map(async ([id, data]) => {
        try {
          const meta = data.metadata || (await conn.groupMetadata(id))
          if (meta?.isCommunity || meta?.announce || meta?.read_only) return null
          return [id, data]
        } catch {
          return null
        }
      })
  )
  const groupsFiltered = groupsIn.filter(Boolean)

  // chat private vere (solo utenti @s.whatsapp.net)
  const privateChats = chats.filter(([id]) => id.endsWith('@s.whatsapp.net'))

  // conteggi database
  const totalreg = Object.keys(global.db.data.users).length
  const rtotalreg = Object.values(global.db.data.users).filter(user => user.instagram).length
  const totalPlugins = Object.keys(global.plugins).length

  const thumbnail = fs.readFileSync('icone/logobot.png')

  let prova = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: `𝐈𝐧𝐟𝐨 ${global.nomebot}`,
        jpegThumbnail: thumbnail,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  conn.sendMessage(m.chat, {
    text: `════════•⊰✦⊱•════════
𝐏𝐞𝐫 𝐯𝐞𝐝𝐞𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐮𝐬𝐚 ${usedPrefix}𝐦𝐞𝐧𝐮

➣ 𝐆𝐫𝐮𝐩𝐩𝐢: ${toMathematicalAlphanumericSymbols(groupsFiltered.length)}
➣ 𝐂𝐡𝐚𝐭 𝐩𝐫𝐢𝐯𝐚𝐭𝐞: ${toMathematicalAlphanumericSymbols(privateChats.length)}
➣ 𝐂𝐡𝐚𝐭 𝐭𝐨𝐭𝐚𝐥𝐢: ${toMathematicalAlphanumericSymbols(groupsFiltered.length + privateChats.length)}
➣ 𝐔𝐭𝐞𝐧𝐭𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢: ${toMathematicalAlphanumericSymbols(totalreg)}
➣ 𝐈𝐠 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢: ${toMathematicalAlphanumericSymbols(rtotalreg)}/${toMathematicalAlphanumericSymbols(totalreg)}
➣ 𝐏𝐥𝐮𝐠𝐢𝐧𝐬: ${toMathematicalAlphanumericSymbols(totalPlugins)}
➣ 𝐎𝐰𝐧𝐞𝐫: ${message}
════════•⊰✦⊱•════════`
  }, { quoted: prova })
}

handler.command = ['infobot']
export default handler