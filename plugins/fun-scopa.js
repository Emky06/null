import * as baileys from '@axtral_wizard/baileys';

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

let handler = async (m, { conn, text }) => {
  if (!text && !m.quoted && !m.mentionedJid?.length) throw '🤤𝐓𝐚𝐠𝐠𝐚 𝐜𝐡𝐢 𝐬𝐜𝐨𝐩𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨🥵'

  let user = m.mentionedJid?.[0] || m.quoted?.sender
  if (!user) throw '🤤𝐓𝐚𝐠𝐠𝐚 𝐜𝐡𝐢 𝐬𝐜𝐨𝐩𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨🥵'

  const frames = [
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,    // 0: Fuori (visibile)
    `● █▀█▄                     لں͞`,    // 1: Dentro (spazi fissi per bloccare il testo)
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,    // 2: Fuori
    `● █▀█▄                     لں͞`,    // 3: Dentro
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,    // 4: Fuori
    `● █▀█▄                     لں͞`,    // 5: Dentro
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,    // 6: Fuori
    `● █▀█▄                     لں͞`,    // 7: Dentro
    `● █▀█▄Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,    // 8: Fuori
    `● █▀█▄                     لں͞`,    // 9: Dentro
    `● █▀█▄💦Ɑ͞ ̶͞ ̶͞ ̶͞ لں͞`,   // 10: Finale con sborra
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
    text: `${frames[frames.length - 1]}\n\n🤤@${user.split('@')[0]} 𝐞̀ 𝐬𝐭𝐚𝐭𝐚/𝐨 𝐬𝐜𝐨𝐩𝐚𝐭𝐚/𝐨 𝐟𝐨𝐫𝐭𝐞 𝐚 90 𝐞 𝐨𝐫𝐚 𝐞̀ 𝐩𝐢𝐞𝐧𝐚/𝐨 𝐝𝐢 𝐬𝐛𝐨𝐫𝐫𝐚🥵`,
    edit: msg.key,
    mentions: [user]
  })
}

handler.command = ['scopa']
export default handler
