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

    await conn.reply(m.chat, wait, m)

    let media = await q.download()
    let ext = mime.split('/')[1]
    let filePath = `./tmp/${m.sender}.${ext}`

    fs.writeFileSync(filePath, media)

    let res = await acr.identify(fs.readFileSync(filePath))
    let { code, msg } = res.status
    if (code !== 0) throw msg

    let { title, artists, album, genres, release_date } = res.metadata.music[0]

    let txt = `
RISULTATO DELLA RICERCA

• 📌 TITOLO: ${title}
• 👨‍🎤 ARTISTA: ${artists ? artists.map(v => v.name).join(', ') : 'Non trovato'}
• 💾 ALBUM: ${album?.name || 'Non trovato'}
• 🌐 GENERE: ${genres ? genres.map(v => v.name).join(', ') : 'Non trovato'}
• 📆 DATA DI PUBBLICAZIONE: ${release_date || 'Non trovato'}
`.trim()

    fs.unlinkSync(filePath)

    const messageOptions = {}
    m.reply(txt, null, messageOptions)

  } else {
    throw '╰⊱❗️⊱ *USO ERRATO* ⊱❗️⊱╮\n\nRISPONDI A UN AUDIO O VIDEO'
  }
}

handler.command = /^shazam$/i
export default handler