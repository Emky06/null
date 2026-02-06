//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, isOwner, isAdmin, isPrems }) => {
  if (!isOwner && !isAdmin && !isPrems) return m.reply('⚠️ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮𝐨̀ 𝐞𝐬𝐬𝐞𝐫𝐞 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐬𝐨𝐥𝐨 𝐝𝐚 𝐚𝐝𝐦𝐢𝐧 𝐞 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢.')

  let groupMetadata = await conn.groupMetadata(m.chat)
  let groupMembers = groupMetadata.participants.map(u => u.jid)

  let usersWarned = Object.entries(global.db.data.users)
    .filter(([jid, user]) => user.warn && user.warn > 0 && groupMembers.includes(jid))

  if (!usersWarned.length) return m.reply('⚠️ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐨𝐧 𝐰𝐚𝐫𝐧 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.')

  let caption = `⚠️ 𝐋𝐈𝐒𝐓𝐀 𝐖𝐀𝐑𝐍 ⚠️\n╭•━━━━━━━━━━━━━━━━━━•\n┃ 𝐓𝐨𝐭: ${usersWarned.length} 𝐔𝐬𝐞𝐫`

  for (let i = 0; i < usersWarned.length; i++) {
    let [jid, user] = usersWarned[i]
    let tag = `@${jid.split('@')[0]}`
    let motivi = (user.warnReasons && user.warnReasons.length)
      ? user.warnReasons.map((motivo, idx) => `┃  ${idx + 1}. ${motivo || '𝐌𝐨𝐭𝐢𝐯𝐨 𝐯𝐮𝐨𝐭𝐨'}`).join('\n')
      : '┃  𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐨𝐭𝐢𝐯𝐨 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐭𝐨'

    caption += `\n┃\n┃ ${i + 1}. ${tag} (${user.warn}/3)\n┃ 𝐌𝐨𝐭𝐢𝐯𝐢:\n${motivi}\n┣━━━━━━━━━━━━━━━━━━•`
  }

  caption += `\n╰•━━━━━━━━━━━━━━━━━━•`

  m.reply(caption, null, { mentions: conn.parseMention(caption) })
}

handler.command = /^(listawarn|listadv|advlist)$/i
handler.group = true
export default handler