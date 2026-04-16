let handler = async (m, { text, conn, usedPrefix, command }) => {
  let why = `Esempio:\n${usedPrefix + command} @utente o 393XXXXXXXXX`

  let input = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.quoted
    ? m.quoted.sender
    : text
    ? text.replace(/[^0-9]/g, '')
    : false

  if (!input) {
    return conn.reply(m.chat, why, m, { mentions: [m.sender] })
  }

  let who = input.includes('@s.whatsapp.net')
    ? input
    : input + '@s.whatsapp.net'

  try {
    // ✅ controllo se esiste su WhatsApp
    let cek = await conn.onWhatsApp(input)
    if (!cek || cek.length === 0) {
      return conn.reply(m.chat, '❌ Numero non registrato su WhatsApp', m)
    }

    who = cek[0].jid

    if (who === conn.user.jid) {
      return conn.reply(m.chat, '❌ Non puoi bloccare te stesso', m)
    }

    if (/^block$/i.test(command)) {
      await conn.updateBlockStatus(who, "block")
    } else {
      await conn.updateBlockStatus(who, "unblock")
    }

    conn.reply(m.chat, '✅ Fatto', m, { mentions: [who] })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Errore reale:\n' + JSON.stringify(e, null, 2), m)
  }
}

handler.command = /^(block|unblock)$/i
handler.rowner = true

export default handler