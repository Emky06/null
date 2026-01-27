let handler = async (m, { conn, participants, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return

  const ownerJids = global.owner
    .map(o => (typeof o === 'object' ? o[0] : o) + '@s.whatsapp.net')

  const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'

  let admins = participants.filter(
    p => p.admin === 'admin' || p.admin === 'superadmin'
  )

  let toDemote = admins
    .map(p => p.jid)
    .filter(jid =>
      jid &&
      jid !== botJid &&
      !ownerJids.includes(jid)
    )

  if (!toDemote.length) return

  try {
    await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote')

    await m.reply(
      '👑 𝑻𝒊 𝒔𝒆𝒊 𝒊𝒏𝒄𝒐𝒓𝒐𝒏𝒂𝒕𝒐 𝒔𝒐𝒗𝒓𝒂𝒏𝒐 𝒅𝒊 𝒒𝒖𝒆𝒔𝒕𝒐 𝒈𝒓𝒖𝒑𝒑𝒐.\n𝑪𝒉𝒆 𝒊𝒏𝒊𝒛𝒊 𝒊𝒍 𝒕𝒖𝒐 𝒅𝒐𝒎𝒊𝒏𝒊𝒐.'
    )
  } catch (e) {
    console.error('Errore nel comando domina:', e)
  }
}

handler.help = ['domina']
handler.tags = ['group']
handler.command = /^(domina|𝐃Ꮻ𝐌𝐈𝐍𝐀)$/i
handler.group = true
handler.owner = true

export default handler