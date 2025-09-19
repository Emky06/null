let handler = async (m, { conn }) => {
  let groupMetadata = await conn.groupMetadata(m.chat)
  let groupMembers = groupMetadata.participants.map(p => p.id)
  let usersWarned = Object.entries(global.db.data.users)
    .filter(([jid, data]) => data.warn && groupMembers.includes(jid))

  let caption = `⚠️ *LISTA WARN* ⚠️\n*╭•━━━━━━━━━━━━━━━━━━•*\n┃ *Tot : ${usersWarned.length} User*`

  for (let i = 0; i < usersWarned.length; i++) {
    let [jid, user] = usersWarned[i]
    let tag = `@${jid.split('@')[0]}`
    let motivi = user.warnReasons?.length
      ? user.warnReasons.map((motivo, idx) => `┃  ${idx + 1}. ${motivo.replace(/@\S+/g, '').trim() || 'Motivo vuoto'}`).join('\n')
      : '┃  Nessun motivo specificato'

    caption += `\n┃\n┃ *${i + 1}.* ${tag} (${user.warn}/3)\n┃ *𝐌𝐨𝐭𝐢𝐯𝐢❓:*\n${motivi}\n┣━━━━━━━━━━━━━━━━━━•`
  }

  caption += `\n*╰•━━━━━━━━━━━━━━━━━━•*`
  m.reply(caption, null, { mentions: conn.parseMention(caption) })
}

handler.command = /^(listawarn|listadv|advlist)$/i
export default handler