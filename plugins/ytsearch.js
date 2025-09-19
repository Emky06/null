//by kinderino
import ytSearch from 'yt-search'

const handler = async (m, { conn, text }) => {
  const jid = m.chat
  if (!text?.trim()) return m.reply('📌 Inserisci il nome del video da cercare.', m)

  const searchResults = await ytSearch(text)
  const videos = searchResults.videos.slice(0, 5)
  if (!videos.length) return m.reply('❌ Nessun risultato trovato.', m)

  const cards = videos.map(video => ({
    image: { url: video.thumbnail },
    title: video.title,
    body: `📺 *Durata:* ${video.timestamp}\n👁️ *Visualizzazioni:* ${video.views.toLocaleString()}\n👤 *Canale:* ${video.author.name}`,
    footer: '🎬 YouTube Search Result'
  }))

  await conn.sendMessage(jid, {
    text: '🎬 Ecco i risultati della tua ricerca:',
    title: '🔎 YouTube Search',
    footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫',
    cards
  }, { quoted: m })

  const formatButtons = videos.map((v, i) => ({
    buttonId: `.ytformat ${i}`,
    buttonText: { displayText: `${i + 1}` },
    type: 1
  }))

  await conn.sendMessage(jid, {
    text: '🔢 *Seleziona un video dai risultati sopra per scegliere il formato da scaricare:*',
    footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫',
    buttons: formatButtons,
    headerType: 1
  }, { quoted: m })

  conn.ytCache = conn.ytCache || {}
  conn.ytCache[jid] = videos
}

handler.command = ['ytsearch']
handler.help = ['.ytsearch <titolo>']
handler.tags = ['downloader']

export default handler