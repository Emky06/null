function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let handler = async (m, { conn, isAdmin, isBotAdmin, args }) => {
  if (!m.isGroup) return m.reply("Questo comando si usa solo nei gruppi.")
  if (!isBotAdmin) return m.reply("Devo essere admin per accettare le richieste.")
  if (!isAdmin) return m.reply("Solo gli admin del gruppo possono usare questo comando.")

  try {
    const groupId = m.chat
    const pending = await conn.groupRequestParticipantsList(groupId)
    const filtroPrefisso = args[0] 

    if (!pending.length) return m.reply("𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 𝐝𝐚 𝐚𝐜𝐜𝐞𝐭𝐭𝐚𝐫𝐞❌")

    let accettati = 0

    for (let p of pending) {
      const numero = p.jid.split('@')[0]

      if (!filtroPrefisso || numero.startsWith(filtroPrefisso)) {
        try {
          await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'approve')
          accettati++
          await sleep(800) // ⏱️ Aspetta tot secondi per evitare rate limit
        } catch (e) {
          console.log(`[ERRORE] Non sono riuscito ad accettare ${p.jid}:`, e)
        }
      }
    }

    if (accettati === 0) {
      return m.reply(filtroPrefisso ? `Nessuna richiesta con prefisso +${filtroPrefisso}.` : "Nessuna richiesta accettata.")
    }

    const messaggioFinale = filtroPrefisso
      ? `✅ Accettate ${accettati} richieste con prefisso +${filtroPrefisso}.`
      : `✅ Accettate ${accettati} richieste.`

    m.reply(messaggioFinale)

  } catch (err) {
    console.error('[ERRORE ACCETTA]', err)
    m.reply("Errore durante l'accettazione delle richieste.")
  }
}

handler.command = ['accetta1']
handler.tags = ['gruppo']
handler.help = ['accetta1 [prefisso] - accetta le richieste (es. .accetta1 39)']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler