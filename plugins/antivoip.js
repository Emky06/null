// ANTIVOIP by Onix, di Riad

setInterval(async () => {
  let chats = global.db.data.chats
  for (let chatId in chats) {
  
    if (!chats[chatId].antivoip) continue
    try {
      
      const pending = await conn.groupRequestParticipantsList(chatId)
      if (pending.length) {
        for (let p of pending) {
          const jid = p.jid
          const number = jid.split('@')[0]

          // Rifiuta se non inizia con 39 o se dopo 39 c'è 0
          if (!number.startsWith('39') || number.slice(2).startsWith('0')) {
            await conn.groupRequestParticipantsUpdate(chatId, [jid], 'reject')
          }
        }
      }
    } catch (e) {
      // Silenzioso
    }
  }
}, 1000) // ogni 1 secondo

export default {}