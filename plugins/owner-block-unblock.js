let handler = async (m, { text, conn, usedPrefix, command }) => {
  let why = `Esempio:\n${usedPrefix + command} @${m.sender.split("@")[0]}`

  let who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
    ? m.quoted.sender
    : text
    ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    : false

  if (!who) {
    return conn.reply(m.chat, why, m, { mentions: [m.sender] })
  }

  // evita di bloccare se stesso
  if (who === conn.user.jid) {
    return conn.reply(m.chat, 'Non puoi bloccare te stesso', m)
  }

  try {
    if (/^block$/i.test(command)) {
      await conn.updateBlockStatus(who, "block")
    } else if (/^unblock$/i.test(command)) {
      await conn.updateBlockStatus(who, "unblock")
    }

    conn.reply(m.chat, '✅ Fatto', m, { mentions: [who] })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Errore: ' + e.message, m)
  }
}

handler.command = /^(block|unblock)$/i
handler.rowner = true

export default handler