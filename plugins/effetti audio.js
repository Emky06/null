import { unlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

let handler = async (m, { conn, args, __dirname, usedPrefix, command }) => {
  try {
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let filter

    if (/bass/i.test(command))
      filter = '-af equalizer=f=94:width_type=o:width=2:g=30'

    if (/blown/i.test(command))
      filter = '-af acrusher=.1:1:64:0:log'

    if (/deep/i.test(command))
      filter = '-af atempo=4/4,asetrate=44500*2/3'

    if (/earrape/i.test(command))
      filter = '-af volume=12'

    if (/fast/i.test(command))
      filter = '-filter:a "atempo=1.63,asetrate=44100"'

    if (/fat/i.test(command))
      filter = '-filter:a "atempo=1.6,asetrate=22100"'

    if (/nightcore/i.test(command))
      filter = '-filter:a atempo=1.06,asetrate=44100*1.25'

    if (/reverse/i.test(command))
      filter = '-filter_complex "areverse"'

    if (/robot/i.test(command))
      filter = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'

    if (/slow/i.test(command))
      filter = '-filter:a "atempo=0.7,asetrate=44100"'

    if (/smooth/i.test(command))
      filter = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'

    if (/tupai|squirrel|chipmunk/i.test(command))
      filter = '-filter:a "atempo=0.5,asetrate=65100"'

    if (/audio/.test(mime)) {
      let filename = getRandom('.mp3')
      let inputPath = await quoted.download()
      let outputPath = join(__dirname, '../tmp/' + filename)

      exec(`ffmpeg -i ${inputPath} ${filter} ${outputPath}`, async (err) => {
        unlinkSync(inputPath)
        if (err) throw '_*Error!*_'

        let file = readFileSync(outputPath)

        conn.sendFile(
          m.chat,
          file,
          filename,
          null,
          m,
          true,
          { type: 'audioMessage', ptt: true }
        )
      })
    } else {
      throw `*[INFO] Rispondi a un audio con il comando ${usedPrefix + command}*`
    }
  } catch (e) {
    throw e
  }
}

handler.help = [
  'bass','blown','deep','earrape','fast',
  'fat','nightcore','reverse','robot',
  'slow','smooth','tupai'
].map(v => v + ' [reply audio]')

handler.tags = ['audio']

handler.command = /^(bass|blown|deep|earrape|fas?t|nightcore|reverse|robot|slow|smooth|tupai|squirrel|chipmunk)$/i

handler.limit = true

export default handler

const getRandom = (ext) => {
  return Math.floor(Math.random() * 10000) + ext
}