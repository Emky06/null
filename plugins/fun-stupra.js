import * as baileys from '@whiskeysockets/baileys';

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

let handler = async (m, { conn, text }) => {
  if (!text && !m.quoted && !m.mentionedJid?.length) throw '🥵𝐓𝐚𝐠𝐠𝐚 𝐜𝐡𝐢 𝐝𝐞𝐬𝐢𝐝𝐞𝐫𝐢 𝐬𝐭𝐮𝐩𝐫𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨🥵'

  let user = m.mentionedJid?.[0] || m.quoted?.sender
  if (!user) throw '🥵𝐓𝐚𝐠𝐠𝐚 𝐜𝐡𝐢 𝐝𝐞𝐬𝐢𝐝𝐞𝐫𝐢 𝐬𝐭𝐮𝐩𝐫𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨🥵'

  const frames = [
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,
    `● Ɑ͞ ̶█▀█▄͞ ̶͞ ̶͞ لں͞`,
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,
    `● Ɑ͞ ̶█▀█▄͞ ̶͞ ̶͞ لں͞`,
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,
    `● Ɑ͞ ̶█▀█▄̶͞ ̶͞ ̶͞ لں͞`,
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,
    `● Ɑ͞ ̶█▀█▄̶͞ ̶͞ ̶͞ لں͞`,
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,
    `● Ɑ͞ ̶█▀█▄̶͞ ̶͞ ̶͞ لں͞`,
    `● █▀█▄🩸Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,
  ]

  let msg = await conn.reply(m.chat, frames[0], m)

  for (let i = 1; i < frames.length; i++) {
    await delay(300)
    await conn.sendMessage(m.chat, {
      text: frames[i],
      edit: msg.key
    })
  }

  // Aspetta 1 secondo e poi aggiungi la frase sotto
  await delay(800)
  await conn.sendMessage(m.chat, {
    text: `${frames[frames.length - 1]}\n\n@${user.split('@')[0]} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨/𝐚 𝐬𝐭𝐮𝐩𝐫𝐚𝐭𝐨/𝐚 𝐩𝐞𝐫 𝐛𝐞𝐧𝐞 𝐜𝐨𝐦𝐞 𝐮𝐧𝐚 𝐩𝐮𝐭𝐭𝐚𝐧𝐚, 𝐨𝐫𝐚 𝐧𝐨𝐧 𝐫𝐢𝐞𝐬𝐜𝐞 𝐧𝐞𝐦𝐦𝐞𝐧𝐨 𝐚 𝐫𝐞𝐠𝐠𝐞𝐫𝐬𝐢 𝐢𝐧 𝐩𝐢𝐞𝐝𝐢🥵`,
    edit: msg.key,
    mentions: [user]
  })
}

handler.command = ['stupra']
export default handler