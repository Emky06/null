//Plugin fatto da Axtral_WiZaRd
import gtts from 'node-gtts'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'

const defaultLang = 'la'

let handler = async (m, { conn, args }) => {
  let lang = args[0]
  let text = args.slice(1).join(' ')

  if (!text && m.quoted?.text) text = m.quoted.text
  if (!text) return m.reply('❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐭𝐞𝐬𝐭𝐨')

  if (!lang || lang.length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }

  let mp3 = join(tmpdir(), `${Date.now()}.mp3`)
  let ogg = join(tmpdir(), `${Date.now()}.ogg`)

  let tts = gtts(lang)

  try {
    await new Promise((resolve, reject) => {
      tts.save(mp3, text, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -y -i ${mp3} -ar 48000 -ac 1 -c:a libopus ${ogg}`, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await conn.sendMessage(m.chat, {
      audio: { url: ogg },
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: m })

    // 4. cleanup
    setTimeout(() => {
      try {
        unlinkSync(mp3)
        unlinkSync(ogg)
      } catch {}
    }, 5000)

  } catch (e) {
    console.error(e)
    m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐓𝐓𝐒')
  }
}

handler.command = /^g?tts$/i
handler.group = true

export default handler