//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, text }) => {
  const mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
  const user = global.db.data.users[mention]
  
  if (!user) return conn.reply(m.chat, '𝐔𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.', m)

  user.money = 0
  user.bank = 0

  if (mention === m.sender) {
    conn.reply(m.chat, '✅ 𝐇𝐚𝐢 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐨 𝐭𝐮𝐭𝐭𝐢 𝐢 𝐭𝐮𝐨𝐢 𝐬𝐨𝐥𝐝𝐢.', m)
  } else {
    conn.reply(m.chat, `✅ 𝐇𝐨 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐨 𝐭𝐮𝐭𝐭𝐢 𝐢 𝐬𝐨𝐥𝐝𝐢 𝐝𝐢 @${mention.split`@`[0]}`, null, { mentions: [mention] })
  }
}

handler.command = /^(azzeramoney)$/i
handler.rowner = true

export default handler
