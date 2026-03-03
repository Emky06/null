import { unlinkSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execFile } from 'child_process'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn, __dirname, usedPrefix, command }) => {
  try {
    command = String(command).toLowerCase()

    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''

    if (!/audio/.test(mime)) {
      throw `*[INFO] Rispondi a un audio o vocale usando il comando ${usedPrefix + command}*`
    }

    // -------- EFFETTI --------
    let filterArgs

    switch (command) {
      case 'bass':
        filterArgs = ['-af', 'equalizer=f=94:width_type=o:width=2:g=30']
        break
      case 'deep':
        filterArgs = ['-af', 'atempo=1,asetrate=44500*2/3']
        break
      case 'reverse':
        filterArgs = ['-filter_complex', 'areverse']
        break
      case 'slow':
        filterArgs = ['-filter:a', 'atempo=0.7,asetrate=44100']
        break
      case 'fast':
        filterArgs = ['-filter:a', 'atempo=1.6,asetrate=44100']
        break
      default:
        throw '*Effetto non valido*'
    }

    // -------- DOWNLOAD CORRETTO --------
    const stream = await downloadContentFromMessage(
      quoted.msg || quoted,
      'audio'
    )

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    if (!buffer.length) throw '*Errore nel download dell’audio*'

    let inputPath = join(__dirname, '../tmp/' + getRandom('.mp3'))
    let outputPath = join(__dirname, '../tmp/' + getRandom('.mp3'))

    writeFileSync(inputPath, buffer)

    // -------- FFMPEG --------
    execFile(
      'ffmpeg',
      ['-i', inputPath, ...filterArgs, outputPath],
      async (err) => {
        try {
          if (existsSync(inputPath)) unlinkSync(inputPath)

          if (err) {
            console.error(err)
            throw '*Errore durante la conversione audio*'
          }

          let file = readFileSync(outputPath)

          await conn.sendFile(
            m.chat,
            file,
            'audio.mp3',
            null,
            m,
            true,
            { type: 'audioMessage', ptt: true }
          )

          if (existsSync(outputPath)) unlinkSync(outputPath)

        } catch (e) {
          console.error(e)
        }
      }
    )

  } catch (e) {
    throw e
  }
}

handler.command = /^(bass|deep|reverse|slow|fast)$/i
handler.tags = ['audio']
handler.help = ['bass','deep','reverse','slow','fast'].map(v => v + ' [reply audio]')
handler.limit = true

export default handler

function getRandom(ext) {
  return Math.floor(Math.random() * 10000) + ext
}