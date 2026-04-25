import gtts from 'node-gtts'
import { readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const defaultLang = 'it'

let handler = async (m, { conn, args }) => {
  let lang = args[0]
  let text = args.slice(1).join(' ')

  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }

  if (!text && m.quoted?.text) text = m.quoted.text
  if (!text) throw 'inserisci il testo'

  try {
    let res = await tts(text, lang)
    await conn.sendFile(m.chat, res, 'tts.wav', null, m, true)
  } catch (e) {
    let res = await tts(text, defaultLang)
    await conn.sendFile(m.chat, res, 'tts.wav', null, m, true)
  }
}

handler.help = ['tts <lang> <text>']
handler.tags = ['tools']
handler.command = /^g?tts$/i

export default handler

function tts(text, lang = 'it') {
  return new Promise((resolve, reject) => {
    try {
      if (!existsSync('./tmp')) mkdirSync('./tmp')

      let tts = gtts(lang)
      let filePath = join('./tmp', Date.now() + '.wav')

      tts.save(filePath, text, () => {
        try {
          const buffer = readFileSync(filePath)
          unlinkSync(filePath)
          resolve(buffer)
        } catch (e) {
          reject(e)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}