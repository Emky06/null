import fs from 'fs'
import acrcloud from 'acrcloud'
let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (/audio|video/.test(mime)) {
    if ((q.msg || q).seconds > 20) return m.reply('╰⊱⚠️⊱ *ATTENZIONE | WARNING* ⊱⚠️⊱╮\n\nIl file che hai caricato è troppo grande, ti consigliamo di tagliare il file in un frammento più piccolo. 10-20 secondi di audio sono sufficienti per l\'identificazione')
    await conn.reply(m.chat, wait, m)
    let media = await q.download()
    let ext = mime.split('/')[1]
    fs.writeFileSync(`./tmp/${m.sender}.${ext}`, media)
    let res = await acr.identify(fs.readFileSync(`./tmp/${m.sender}.${ext}`))
    let { code, msg } = res.status
    if (code !== 0) throw msg
    let { title, artists, album, genres, release_date } = res.metadata.music[0]
    let txt = `
RISULTATO DELLA RICERCA

• 📌 TITOLO: ${title}
• 👨‍🎤 ARTISTA: ${artists !== undefined ? artists.map(v => v.name).join(', ') : 'Non trovato'}
• 💾 ALBUM: ${album.name || 'Non trovato'}
• 🌐 GENERE: ${genres !== undefined ? genres.map(v => v.name).join(', ') : 'Non trovato'}
• 📆 DATA DI PUBBLICAZIONE: ${release_date || 'Non trovato'}
`.trim()
    fs.unlinkSync(`./tmp/${m.sender}.${ext}`)

    const messageOptions = {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402109887104@newsletter',
          serverMessageId: '',
          newsletterName: `𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕`
        },
      }
    };

    // Invia il messaggio con inoltro
    m.reply(txt, null, { ...messageOptions })
  } else throw '╰⊱❗️⊱ *USO ERRATO* ⊱❗️⊱╮\n\nRISPONDI A UN AUDIO O VIDEO'
}
handler.command = /^shazam$/i
export default handler