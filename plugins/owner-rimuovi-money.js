const handler = async (m) => {
  const mention = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender)
  const user = global.db.data.users[mention]

  if (!user) return conn.reply(m.chat, 'Utente non trovato nel database!', m)

  const args = m.text.match(/\d+/)
  const numMoney = args ? parseInt(args[0]) : 0

  if (numMoney <= 0) {
    return conn.reply(m.chat, 'Inserisci un numero valido di money da rimuovere!', m)
  }

  user.money = user.money || 0
  user.bank = user.bank || 0

  let daContanti = Math.min(user.money, numMoney)
  let restante = numMoney - daContanti
  let daBanca = Math.min(user.bank, restante)

  user.money -= daContanti
  user.bank -= daBanca

  const formattedMoney = new Intl.NumberFormat('it-IT').format(numMoney)
  const formattedContanti = new Intl.NumberFormat('it-IT').format(user.money)
  const formattedBanca = new Intl.NumberFormat('it-IT').format(user.bank)

  if (mention === m.sender) {
    conn.reply(m.chat, `Hai rimosso ${formattedMoney}€ da te stesso.\n💰 *Contanti:* ${formattedContanti}€\n🏦 *Banca:* ${formattedBanca}€`, m)
  } else {
    conn.reply(m.chat, `Ho rimosso ${formattedMoney}€ a @${mention.split('@')[0]}.\n💰 *Contanti:* ${formattedContanti}€\n🏦 *Banca:* ${formattedBanca}€`, null, { mentions: [mention] })
  }
}

handler.command = /^(rmoney)$/i
handler.rowner = true
export default handler
