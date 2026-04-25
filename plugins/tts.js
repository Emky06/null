import gtts from 'node-gtts'
import { unlinkSync } from 'fs'
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

  let filePath = join(tmpdir(), `${Date.now()}.wav`)
  let tts = gtts(lang)

  try {
    await new Promise((resolve, reject) => {
      tts.save(filePath, text, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await conn.sendMessage(m.chat, {
      audio: { url: filePath },
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: m })

    setTimeout(() => {
      try { unlinkSync(filePath) } catch {}
    }, 5000)

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Errore TTS')
  }
}

handler.command = /^g?tts$/i
handler.tags = ['tools']
handler.help = ['tts <lang> <testo>']

export default handler