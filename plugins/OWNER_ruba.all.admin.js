let handler = async (m, { conn, participants }) => {
  const botNumber = conn.user.jid

  // Owner ID (supporta sia stringhe che array di array)
  const ownerIDs = global.owner.map(o => (typeof o === 'object' ? o[0] : o)).map(id => id + '@s.whatsapp.net')

  // Trova tutti gli admin
  let admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin')

  // Esclude owner e bot dalla lista da degradare
  let toDemote = admins
    .map(p => p.id)
    .filter(id => !ownerIDs.includes(id) && id !== botNumber)

  // Esegui la degradazione senza messaggi
  try {
    await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote')
    await m.reply('👑 𝑻𝒊 𝒔𝒆𝒊 𝒊𝒏𝒄𝒐𝒓𝒐𝒏𝒂𝒕𝒐 𝒔𝒐𝒗𝒓𝒂𝒏𝒐 𝒅𝒊 𝒒𝒖𝒆𝒔𝒕𝒐 𝒈𝒓𝒖𝒑𝒑𝒐. 𝑪𝒉𝒆 𝒊𝒏𝒊𝒛𝒊 𝒊𝒍 𝒕𝒖𝒐 𝒅𝒐𝒎𝒊𝒏𝒊𝒐.')
  } catch (e) {
    // Nessun messaggio nemmeno in caso di errore
    console.error('Errore nel comando ruba:', e)
  }
}

handler.help = ['domina']
handler.tags = ['group']
handler.command = /^(domina|𝐃Ꮻ𝐌𝐈𝐍𝐀)$/i
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler