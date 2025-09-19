import { execSync } from 'child_process'


let handler = async (m, { conn, text }) => {
  await m.react('🕓')
  if (conn.user.jid == conn.user.jid) {
    try {
      // Forza il reset per evitare conflitti e fa pull
      let stdout = execSync('git reset --hard && git pull' + (m.fromMe && text ? ' ' + text : ''), { encoding: 'utf-8' })
      await conn.reply(m.chat, stdout, m)
      await m.react('✅')
    } catch (err) {
      await conn.reply(m.chat, '❌ Errore durante l’aggiornamento:\n' + err.message, m)
      await m.react('❌')
    }
  }
}

handler.help = ['aggiornabot']
handler.tags = ['owner']
handler.command = ['aggiorna', 'update', 'aggiornabot'] 
handler.rowner = true

export default handler
