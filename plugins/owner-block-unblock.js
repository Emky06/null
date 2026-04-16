let handler = async (m, { text, conn, usedPrefix, command }) => {
  let why = `Esempio:\n${usedPrefix + command} @utente o 393XXXXXXXXX`

  let input = m.mentionedJid?.[0]
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
    if (who === conn.user.id || who === conn.user.jid) {
      return conn.reply(m.chat, '❌ Non puoi bloccare te stesso', m)
    }

    await conn.query({
      tag: 'iq',
      attrs: {
        xmlns: 'blocklist',
        to: '@s.whatsapp.net',
        type: 'set'
      },
      content: [{
        tag: command === 'block' ? 'block' : 'unblock',
        attrs: {},
        content: [{
          tag: 'item',
          attrs: { jid: who }
        }]
      }]
    })

    conn.reply(m.chat, '✅ Fatto', m, { mentions: [who] })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Errore reale:\n' + e.message, m)
  }
}

handler.command = /^(block|unblock)$/i
handler.rowner = true

export default handler