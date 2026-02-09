//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text, args }) => {
  if (!text) throw '𝐐𝐮𝐚𝐧𝐭𝐢 𝐬𝐨𝐥𝐝𝐢 𝐯𝐮𝐨𝐢 𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐚𝐫𝐞 𝐢𝐧 𝐛𝐚𝐧𝐜𝐚?'

  let users = global.db.data.users
  const who = m.sender
  const limiteGiornaliero = 1500
  const tempoLimite = 24 * 60 * 60 * 1000 // 24 ore in millisecondi
  const oraAttuale = Date.now()

  if (!users[who].depositiOggi) {
    users[who].depositiOggi = {
      totale: 0,
      timestamp: 0
    }
  }

  if (oraAttuale - users[who].depositiOggi.timestamp > tempoLimite) {
    users[who].depositiOggi.totale = 0
    users[who].depositiOggi.timestamp = oraAttuale
  }

  let deposito

  if (text.toLowerCase() === 'tutto' || text.toLowerCase() === 'all') {
    if (users[who].money <= 0) throw '𝐍𝐨𝐧 𝐡𝐚𝐢 𝐬𝐨𝐥𝐝𝐢 𝐝𝐚 𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐚𝐫𝐞!'

    let disponibileNelLimite = limiteGiornaliero - users[who].depositiOggi.totale
    if (disponibileNelLimite <= 0) {
      let tempoRimanente = (users[who].depositiOggi.timestamp + tempoLimite) - oraAttuale
      let ore = Math.floor(tempoRimanente / (1000 * 60 * 60))
      let minuti = Math.floor((tempoRimanente % (1000 * 60 * 60)) / (1000 * 60))
      let secondi = Math.floor((tempoRimanente % (1000 * 60)) / 1000)

      throw `🚫 Hai raggiunto il limite di deposito di 1500 € ogni 24 ore.\n⏳ Puoi depositare di nuovo tra *${ore}h ${minuti}m ${secondi}s*`
    }

   
    deposito = Math.min(users[who].money, disponibileNelLimite)
  } else {
    deposito = parseInt(text.split(' ')[0])
    if (isNaN(deposito)) throw `𝐍𝐨𝐧 𝐡𝐚𝐢 𝐢𝐧𝐬𝐞𝐫𝐢𝐭𝐨 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨`
    if (deposito < 0) throw `𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐚𝐫𝐞 ${deposito.toLocaleString('it-IT')} €`
    if (deposito > users[who].money) throw `𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢 𝐧𝐞𝐥 𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨👛`
    if ((users[who].depositiOggi.totale + deposito) > limiteGiornaliero) {
      let rimasto = limiteGiornaliero - users[who].depositiOggi.totale
      let tempoRimanente = (users[who].depositiOggi.timestamp + tempoLimite) - oraAttuale
      let ore = Math.floor(tempoRimanente / (1000 * 60 * 60))
      let minuti = Math.floor((tempoRimanente % (1000 * 60 * 60)) / (1000 * 60))
      let secondi = Math.floor((tempoRimanente % (1000 * 60)) / 1000)

      throw `🚫 Hai raggiunto il limite di deposito di 1500 € ogni 24 ore.\n💰 Ti restano *${rimasto.toLocaleString('it-IT')} €* da poter depositare.\n⏳ Puoi depositare di nuovo tra *${ore}h ${minuti}m ${secondi}s*`
    }
  }

  users[who].bank += deposito
  users[who].money -= deposito
  users[who].ultimodeposito = deposito
  users[who].depositiOggi.totale += deposito

  if (users[who].depositiOggi.timestamp === 0)
    users[who].depositiOggi.timestamp = oraAttuale

  let testo = `════════ •⊰✦⊱• ════════
𝐇𝐨 𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐚𝐭𝐨 *${deposito.toLocaleString('it-IT')}* € 𝐬𝐮𝐥 𝐭𝐮𝐨 𝐜𝐨𝐧𝐭𝐨

🏦 𝐁𝐚𝐧𝐜𝐚: ${users[who].bank.toLocaleString('it-IT')} €
💵 𝐂𝐨𝐧𝐭𝐚𝐧𝐭𝐢: ${users[who].money.toLocaleString('it-IT')} €
📅 𝐋𝐢𝐦𝐢𝐭𝐞 𝟐𝟒𝐡: ${users[who].depositiOggi.totale.toLocaleString('it-IT')} / ${limiteGiornaliero.toLocaleString('it-IT')} €
════════ •⊰✦⊱• ════════`

  conn.reply(m.chat, testo, m)
}

handler.command = /^deposita|deposit$/i
export default handler