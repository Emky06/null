//Plugin fatto da Axtral_WiZaRd
let activeDSGroups = {}

let handler = async (m, { conn, command }) => {
  const jid = m.chat
  if (!jid.endsWith('@g.us')) throw '❌ Questo comando funziona solo nei gruppi!'

  let chat = global.db.data.chats[jid] || (global.db.data.chats[jid] = {})

  if (command === 'autods' && m.text.toLowerCase().includes('off')) {
    if (chat.autoDS) {
      chat.autoDS = false

      if (activeDSGroups[jid]) {
        clearInterval(activeDSGroups[jid])
        delete activeDSGroups[jid]
      }

      return conn.sendMessage(jid, {
        text: '🛑 Auto .ds disattivato in questo gruppo.',
        footer: 'Puoi riattivarlo con .autods',
      }, { quoted: m })
    } else {
      return m.reply('⚠️ Auto .ds non era attivo in questo gruppo.')
    }
  }

  if (chat.autoDS) {
    return conn.sendMessage(jid, {
      text: '✅ Auto .ds è già attivo in questo gruppo.\n\nPer disattivarlo, usa il pulsante qui sotto.',
      buttons: [
        { buttonId: '.autods off', buttonText: { displayText: '🛑 Disattiva Auto .ds' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m })
  }

  chat.autoDS = true
  m.reply('✅ Auto .ds attivato! Ogni 30 minuti invierò `.ds`')

  await conn.sendMessage(jid, { text: `.ds` })

  startAutoDS(conn, jid)
}

handler.command = ['autods']
handler.tags = ['bot']
handler.rowner = true
handler.help = ['autods']
export default handler

function startAutoDS(conn, jid) {

  if (activeDSGroups[jid]) {
    clearInterval(activeDSGroups[jid])
    delete activeDSGroups[jid]
  }

  activeDSGroups[jid] = setInterval(async () => {
    let chat = global.db.data.chats[jid]
    if (!chat || !chat.autoDS) {
      clearInterval(activeDSGroups[jid])
      delete activeDSGroups[jid]
      return
    }

    await conn.sendMessage(jid, { text: `.ds` })
  }, 30 * 60 * 1000)
}

setInterval(() => {
  const conn = global.conn
  for (let jid in global.db.data.chats) {
    let chat = global.db.data.chats[jid]
    if (chat.autoDS && !activeDSGroups[jid]) {
      startAutoDS(conn, jid)
    }
  }
}, 10 * 1000)