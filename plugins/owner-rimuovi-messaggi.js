//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, text }) => {
  let user = m.mentionedJid?.[0] || m.quoted?.sender
  if (!user) {
    return m.reply("❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐥𝐚 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐞!")
  }

  let userData = global.db.data.users[user]
  if (!userData) {
    return m.reply("❌ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨!")
  }

  let numero = parseInt(text.match(/\d+/)?.[0] || 0)
  if (numero <= 0) {
    return m.reply("❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐯𝐚𝐥𝐢𝐝𝐨!")
  }

  if (!userData.messaggi || userData.messaggi < numero) {
    return conn.reply(
      m.chat,
      `❌ 𝐋'𝐮𝐭𝐞𝐧𝐭𝐞 @${user.split('@')[0]} 𝐧𝐨𝐧 𝐡𝐚 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢.`,
      m,
      { mentions: [user] }
    )
  }

  userData.messaggi -= numero

  const quotedMessage = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: `𝐑𝐢𝐦𝐨𝐬𝐬𝐢 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨`,
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
      text: `🗑️ 𝐇𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 *${numero}* 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞!`,
      mentions: [user]
    },
    { quoted: quotedMessage }
  )
}

handler.command = /^(rimuovi)$/i
handler.owner = true

export default handler