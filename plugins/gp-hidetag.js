import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m

  let captionText
  if (m.quoted && m.quoted.text) {
    captionText = `➠ ${m.quoted.text}`
  } else if (text?.trim()) {
    captionText = `➠ ${text.trim()}`
  } else {
    captionText = `➠`
  }

  let specificMentions = []
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    for (let mention of m.mentionedJid) {
      const userId = mention.split('@')[0].replace('+', '')
      const mentionJid = userId + '@s.whatsapp.net'
      specificMentions.push(mentionJid)
      
      if (captionText.includes('@')) {
        captionText = captionText.replace(new RegExp(`@${userId.replace('+', '')}`, 'g'), `@${userId}`)
      }
    }
    var mentions = [...new Set([...specificMentions, ...users])]
  } else {
    var mentions = users
  }

  try {
    let quoted = m.quoted ? m.quoted : m
    
    if (!m.quoted) {
      await conn.sendMessage(
        m.chat,
        { text: captionText, mentions: mentions },
        { quoted: m }
      )
      return
    }
    
    let mime = (quoted.msg || quoted)?.mimetype || ''
    let isViewOnce = quoted.msg?.viewOnce || quoted.viewOnce || false
    let isGif = quoted.msg?.gifPlayback === true || mime === 'image/gif' || mime === 'video/gif' 
    
    let media = await quoted.download?.()
    if (!media && mime) throw 'Errore nel download del media'

    let baseMessageOptions = {
        mentions: mentions,
        contextInfo: { mentionedJid: mentions }
    }

    if (isViewOnce) baseMessageOptions.viewOnce = true;
    
    if (captionText && quoted.mtype !== 'audioMessage' && quoted.mtype !== 'stickerMessage') {
        baseMessageOptions.caption = captionText;
    }

    if (isGif || (quoted.mtype === 'videoMessage' && isGif)) {
        await conn.sendMessage(m.chat, { 
            video: media, 
            gifPlayback: true, 
            mimetype: 'video/mp4',
            ...baseMessageOptions 
        }, { quoted: m })

    } else if (quoted.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, ...baseMessageOptions }, { quoted: m })

    } else if (quoted.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, mimetype: 'video/mp4', ...baseMessageOptions }, { quoted: m })

    } else if (quoted.mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/mp4', 
            fileName: `Hidetag.mp3`,
            ...baseMessageOptions
        }, { quoted: m })

    } else if (quoted.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { 
            sticker: media, 
            ...baseMessageOptions 
        }, { quoted: m })

    } else {
        await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
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
