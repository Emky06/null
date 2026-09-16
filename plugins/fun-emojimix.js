import { sticker } from '../lib/sticker.js'
import MessageType from '@axtral_wizard/baileys'
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('+')) {
    return m.reply('Formato errato. Usa: .emojimix emoji1+emoji2')
  }

  let [emoji1, emoji2] = text.split('+')
  if (!emoji1 || !emoji2) {
    return m.reply('Devi inserire due emoji separate da "+"')
  }

  try {
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)

    if (!anu.results || anu.results.length === 0) {
      return m.reply('Nessun risultato trovato per questa combinazione di emoji.')
    }

    for (let res of anu.results) {
      let stiker = await sticker(false, res.url, global.packname, global.author)
      await conn.sendFile(m.chat, stiker, null, { asSticker: true })
    }
  } catch (e) {
    console.error(e)
    m.reply('Si è verificato un errore durante la generazione dello sticker.')
  }
}

handler.help = ['emojimix'].map(v => v + ' emoji1+emoji2')
handler.tags = ['fun']
handler.command = /^(emojimix)$/i
export default handler

const fetchJson = (url, options) => new Promise((resolve, reject) => {
  fetch(url, options)
    .then(response => response.json())
    .then(json => resolve(json))
    .catch(err => reject(err))
})