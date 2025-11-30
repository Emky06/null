const handler = async (m) => {
  const mention = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
  const user = global.db.data.users[mention]

  if (!user) return conn.reply(m.chat, 'Utente non trovato nel database.', m)

  const args = m.text.match(/\d+/)
  const numMoney = args ? parseInt(args[0]) : 0

  if (numMoney <= 0) {
    return conn.reply(m.chat, 'Inserisci un numero valido di money da aggiungere!', m)
  }

  user.money = (user.money || 0) + numMoney

  // Formattazione numerica
  const formattedMoney = new Intl.NumberFormat('it-IT').format(numMoney)
  const formattedTotalMoney = new Intl.NumberFormat('it-IT').format(user.money)

  if (mention === m.sender) {
    conn.reply(m.chat, `✅ Hai aggiunto ${formattedMoney}€ a te stesso. Ora hai un totale di ${formattedTotalMoney}€.`, m)
  } else {
    conn.reply(m.chat, `✅ Ho aggiunto ${formattedMoney}€ a @${mention.split('@')[0]}. Ora ha un totale di ${formattedTotalMoney}€.`, null, { mentions: [mention] })
  }
}

handler.command = /^(addmoney)$/i
handler.rowner = true
export default handler
