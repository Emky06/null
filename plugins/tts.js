import gtts from 'node-gtts'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const defaultLang = 'la'

let handler = async (m, { conn, args }) => {
  let lang = args[0]
  let text = args.slice(1).join(' ')

  if (!text && m.quoted?.text) text = m.quoted.text

  if (!text) return m.reply('❌ Inserisci il testo')

  if (!lang || lang.length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }

  try {
    let filePath = join(tmpdir(), `${Date.now()}.mp3`)
    let tts = gtts(lang)

    await new Promise((resolve, reject) => {
      tts.save(filePath, text, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await conn.sendMessage(m.chat, {
      audio: { url: filePath },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

    // elimina dopo un piccolo delay (evita file lock)
    setTimeout(() => {
      try { unlinkSync(filePath) } catch {}
    }, 5000)

  } catch (err) {
    console.error(err)
    m.reply('⚠️ Errore TTS')
  }
}

handler.help = ['tts <lang> <testo>']
handler.tags = ['tools']
handler.command = /^g?tts$/i

export default handler