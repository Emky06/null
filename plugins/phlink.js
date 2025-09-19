// Codice di phlink.js
// Apre il link salvato da phsearch

let handler = async (m, { conn, args }) => {
  // Recupero sicuro di jid
  const jid = (m.key?.remoteJid || m.chat || m.sender)
  if (!jid || typeof jid !== 'string') return

  const index = parseInt(args[0])

  if (!conn.phCache || !conn.phCache[jid]) {
    return conn.sendMessage(jid, { text: '❌ Non ci sono risultati salvati, prima usa *.phsearch*' }, { quoted: m })
  }

  const videos = conn.phCache[jid]
  if (isNaN(index) || index < 0 || index >= videos.length) {          return conn.sendMessage(jid, { text: '❌ Indice non valido. Scegli un numero valido dai bottoni.' }, { quoted: m })
}

  const video = videos[index]
  await conn.sendMessage(jid, {
    text: `🔞 *Titolo:* ${video.title}\n🕒 *Durata:* ${video.duration}\n👀 *Views:* ${video.views}\n\n👉 *Link:* ${video.url}`,
    footer: 'Pornhub Link Opener',
  }, { quoted: m })
}

handler.command = ['phlink']
handler.tags = ['+18']
handler.help = ['.phlink <numero>']

export default handler