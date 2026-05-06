import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  
  let mime = (q.msg || q)?.mimetype || ''
  let isViewOnce = q.msg?.viewOnce || q.viewOnce || false
  let isGif = q.msg?.gifPlayback || false

  let captionText = m.quoted?.text ? `➠ ${m.quoted.text}` : (text?.trim() ? `➠ ${text.trim()}` : `➠`)
  let mentions = [...new Set([...(m.mentionedJid || []), ...users])]

  try {
    if (!m.quoted) {
      await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
      return
    }

    let media = await q.download?.().catch(() => null)
    
    let common = {
      mentions: mentions,
      contextInfo: { 
        mentionedJid: mentions,
        isForwarded: false
      },
      viewOnce: isViewOnce
    }

    if (isGif || (q.mtype === 'videoMessage' && isGif)) {
      await conn.sendMessage(m.chat, { 
        video: media, 
        gifPlayback: true, 
        caption: captionText,
        ...common 
      }, { quoted: m })
    } else if (q.mtype === 'imageMessage' || mime.includes('image')) {
      await conn.sendMessage(m.chat, { 
        image: media, 
        caption: captionText, 
        ...common 
      }, { quoted: m })
    } else if (q.mtype === 'videoMessage' || mime.includes('video')) {
      await conn.sendMessage(m.chat, { 
        video: media, 
        caption: captionText, 
        ...common 
      }, { quoted: m })
    } else if (q.mtype === 'audioMessage' || mime.includes('audio')) {
      await conn.sendMessage(m.chat, { 
        audio: media, 
        mimetype: 'audio/mp4', 
        ptt: isViewOnce ? true : (q.msg?.ptt || false),
        ...common 
      }, { quoted: m })
    } else if (q.mtype === 'stickerMessage') {
      await conn.sendMessage(m.chat, { 
        sticker: media, 
        ...common 
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
    }
  } catch (e) {
    console.error(e)
  }
}

handler.command = /^(hidetag|tag)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
