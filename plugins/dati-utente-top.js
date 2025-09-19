// Plugin .utente
// by Youns + Axtral_WiZaRd

function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, excluded: { users: {}, chats: {} } } }
  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.excluded) global.db.data.excluded = { users: {}, chats: {} }
}

let handler = async (m, { conn, args }) => {
  ensureDB()

  let target
  if (m.quoted) {

    target = m.quoted.sender
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0]
  } else if (args[0]) {
    target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  } else {
    target = m.sender
  }

  if (!global.db.data.users[target]) global.db.data.users[target] = {}

  let total = 0
  let details = []
  for (let jid in global.db.data.chats) {
    let chat = global.db.data.chats[jid]
    if (global.db.data.excluded.chats[jid]) continue
    let count = chat?.utenti?.[target]?.messaggiGiornalieri || 0
    if (count > 0) {
      total += count
      let name = (await conn.groupMetadata(jid).catch(() => null))?.subject || jid
      details.push(`📍 ${name}: *${count}* 𝐦𝐬𝐠`)
    }
  }

  let caption = `📊 𝐈𝐧𝐟𝐨 𝐝𝐞𝐥𝐥'𝐮𝐭𝐞𝐧𝐭𝐞 @${target.split('@')[0]}\n\n`
  caption += `💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐭𝐨𝐭𝐚𝐥𝐢 𝐨𝐠𝐠𝐢: *${total}*\n\n💬𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐩𝐞𝐫 𝐠𝐫𝐮𝐩𝐩𝐨👥:\n\n`
  caption += details.length ? details.join('\n') : 'Nessun messaggio registrato nei gruppi.'

  conn.sendMessage(m.chat, { text: caption, mentions: [target] })
}

handler.command = /^(utente|user)$/i;
export default handler