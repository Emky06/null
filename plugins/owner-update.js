import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  await m.react('🕓')
  if (conn.user.jid == conn.user.jid) {
    try {
      // Forza aggiornamento dalla repo remota
      let stdout = execSync(
        'git fetch --all && git reset --hard origin/main',
        { encoding: 'utf-8' }
      )
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
