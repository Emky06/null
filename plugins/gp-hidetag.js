import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  
  let mention
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    mention = m.mentionedJid[0]
  } else if (m.quoted) {
    mention = m.quoted.sender
  } else {
    mention = m.sender
  }

  const userId = mention.split('@')[0].replace('+', '')
  const mentionJid = userId + '@s.whatsapp.net'

  let captionText
  if (m.quoted && m.quoted.text) {
    let quotedText = m.quoted.text
    if (quotedText.includes('@')) {
      quotedText = quotedText.replace(/@\d+/g, `@${userId}`)
    }
    captionText = `➠ ${quotedText}`
  } else if (text?.trim()) {
    let inputText = text.trim()
    if (inputText.includes('@')) {
      inputText = inputText.replace(/@\d+/g, `@${userId}`)
    }
    captionText = `➠ ${inputText}`
  } else {
    captionText = `➠ @${userId}`
  }

  const mentions = [mentionJid, ...users.filter(u => u !== mentionJid)]

  try {
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted)?.mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)

    if (isMedia) {
      let media = await quoted.download?.()
      if (!media) throw 'Errore nel download del media'

      if (quoted.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, mentions: mentions, caption: captionText }, { quoted: m })
      } else if (quoted.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, mentions: mentions, caption: captionText, mimetype: 'video/mp4' }, { quoted: m })
      } else if (quoted.mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { audio: media, mentions: mentions, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: m })
      } else if (quoted.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { sticker: media, mentions: mentions }, { quoted: m })
      }
    } else {
      await conn.sendMessage(
        m.chat,
        { text: captionText, mentions: mentions },
        { quoted: m }
      )
    }
  } catch (e) {
    console.error(e)
    await conn.sendMessage(
      m.chat,
      { text: '❌ Errore nel tagging. Forse il messaggio non è valido o il media non può essere scaricato.' },
      { quoted: m }
    )
  }
}

handler.command = /^(hidetag|tag)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler