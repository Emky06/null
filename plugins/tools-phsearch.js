// Codice di tools-phsearch.js

import cheerio from 'cheerio'
import axios from 'axios'

const handler = async (m, { conn, text, command }) => {

  if (!m) return
  const jid = (m.key?.remoteJid || m.chat || m.sender)
  if (!jid || typeof jid !== 'string') return

  if (!text?.trim()) {
    return conn.sendMessage(jid, { text: `🔞 Inserisci la ricerca che vuoi fare su Pornhub.\nEsempio: .${command} con la mia amica` }, { quoted: m })
  }

  try {
    const searchResults = await searchPornhub(text)
    const videos = searchResults.result.slice(0, 5)
    if (!videos.length) return conn.sendMessage(jid, { text: '😕 Nessun risultato trovato...' }, { quoted: m })

    const cards = videos.map(video => ({
      image: { url: video.thumbnail || 'https://di.phncdn.com/videos/202309/11/439988361/original/(m=qOcmJfVbeaAaGwObaaaa)(mh=Ll3-LXLeRDsht1HD)15.jpg' },
      title: video.title,
      body: `🕒 *Durata:* ${video.duration}\n👀 *Visualizzazioni:* ${video.views}`,
      footer: '🔞 Pornhub Search Result'
    }))

    await conn.sendMessage(jid, {
      text: '🔎 Ecco i risultati della tua ricerca:',
      title: '🔞 Pornhub Search',
      footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 🔥',
      cards
    }, { quoted: m })

    const formatButtons = videos.map((v, i) => ({
      buttonId: `.phlink ${i}`,
      buttonText: { displayText: `${i + 1}` },
      type: 1
    }))

    await conn.sendMessage(jid, {
      text: '🔢 *Seleziona un video dai risultati sopra per aprire il link:*',
      footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 🔥',
      buttons: formatButtons,
      headerType: 1
    }, { quoted: m })

    conn.phCache = conn.phCache || {}
    conn.phCache[jid] = videos

  } catch (e) {
    return conn.sendMessage(jid, { text: `❗ Errore: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['phsearch', 'pornhubsearch']
handler.help = ['.phsearch <ricerca>']
handler.tags = ['+18']
handler.admin = true

export default handler

async function searchPornhub(search) {
  try {
    const response = await axios.get(`https://www.pornhub.com/video/search?search=${encodeURIComponent(search)}`)
    const html = response.data
    const $ = cheerio.load(html)
    const result = []

    $('ul#videoSearchResult > li.pcVideoListItem').each(function(a, b) {
      const _title = $(b).find('a').attr('title')
      const _duration = $(b).find('var.duration').text().trim()
      const _views = $(b).find('var.views').text().trim()
      const _url = 'https://www.pornhub.com' + $(b).find('a').attr('href')
      const _thumb = $(b).find('img').attr('data-thumb_url') || $(b).find('img').attr('src')
      const hasil = { title: _title, duration: _duration, views: _views, url: _url, thumbnail: _thumb }
      result.push(hasil)
    })

    return { result }
  } catch (error) {
    console.error('❗ Errore nella ricerca Pornhub:', error)
    return { result: [] }
  }
}