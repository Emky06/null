let handler = async (m, { text, conn, command }) => {
  let input = m.mentionedJid?.[0]
    ? m.mentionedJid[0]
    : m.quoted
    ? m.quoted.sender
    : text
    ? text.replace(/[^0-9]/g, '')
    : false

  if (!input) return conn.reply(m.chat, 'Tagga o numero', m)

  let who = input.includes('@s.whatsapp.net')
    ? input
    : input + '@s.whatsapp.net'

  const timeout = (ms) =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )

  try {
    await Promise.race([
      conn.query({
        tag: 'iq',
        attrs: {
          xmlns: 'blocklist',
          to: '@s.whatsapp.net',
          type: 'set'
        },
        content: [{
          tag: command.includes('block') ? 'block' : 'unblock',
          attrs: {},
          content: [{
            tag: 'item',
            attrs: { jid: who }
          }]
        }]
      }),
      timeout(5000) // ⏱️ 5 secondi max
    ])

    conn.reply(m.chat, '✅ Fatto', m)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Errore: ' + e.message, m)
  }
}

handler.command = /^(block|unblock|blok|unblok)$/i
handler.owner = true

export default handler