//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, text }) => {
  let user = m.mentionedJid?.[0] || m.quoted?.sender
  if (!user) {
    return m.reply("❌ 𝐃𝐞𝐯𝐢 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞!")
  }

  let numero = parseInt(text.match(/\d+/)?.[0] || 0)
  if (numero <= 0) {
    return m.reply("❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐯𝐚𝐥𝐢𝐝𝐨!")
  }

  global.db.data.users[user] = global.db.data.users[user] || {}
  global.db.data.users[user].messaggi =
    (global.db.data.users[user].messaggi || 0) + numero

  const quotedMessage = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: `𝐀𝐠𝐠𝐢𝐮𝐧𝐭𝐢 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨`,
        jpegThumbnail: fs.readFileSync(path.join('icone', 'spunta.png')),
        vcard: `BEGIN:VCARD
VERSION:3.0
FN:Unlimited
ORG:Unlimited
END:VCARD`
      }
    }
  }

  await conn.sendMessage(
    m.chat,
    {
      text: `✅ 𝐇𝐨 𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨 *${numero}* 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐚 @${user.split('@')[0]}!`,
      mentions: [user]
    },
    { quoted: quotedMessage }
  )
}

handler.command = /^aggiungi$/i
handler.owner = true

export default handler