import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  
  let type = Object.keys(q.msg || q)[0] || ''
  let msg = q.msg?.[type] || q.msg || q

  let captionText = m.quoted?.text ? `➠ ${m.quoted.text}` : (text?.trim() ? `➠ ${text.trim()}` : `➠`)
  let mentions = [...new Set([...(m.mentionedJid || []), ...users])]

  try {
    if (!m.quoted) {
      await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
      return
    }

    let media = null

    if (q.download) {
      media = await q.download().catch(() => null)
    }
    
    let isViewOnce = q.msg?.viewOnce || q.viewOnce || false
    let isGif = q.msg?.gifPlayback || q.gifPlayback || (q.mtype === 'videoMessage' && q.msg?.gifPlayback)

    let commonOptions = {
      mentions: mentions,
      contextInfo: { 
        mentionedJid: mentions,
        isForwarded: false
      },
      viewOnce: isViewOnce
    }

    if (isGif) {
      await conn.sendMessage(m.chat, { 
        video: media, 
        gifPlayback: true, 
        caption: captionText,
        ...commonOptions 
      }, { quoted: m })
    } else if (q.mtype === 'imageMessage' || type === 'imageMessage') {
      await conn.sendMessage(m.chat, { image: media, caption: captionText, ...commonOptions }, { quoted: m })
    } else if (q.mtype === 'videoMessage' || type === 'videoMessage') {
      await conn.sendMessage(m.chat, { video: media, caption: captionText, ...commonOptions }, { quoted: m })
    } else if (q.mtype === 'audioMessage' || type === 'audioMessage') {
      await conn.sendMessage(m.chat, { 
        audio: media, 
        mimetype: 'audio/mp4', 
        ptt: isViewOnce ? true : (q.msg?.ptt || false),
        ...commonOptions 
      }, { quoted: m })
    } else if (q.mtype === 'stickerMessage' || type === 'stickerMessage') {
      await conn.sendMessage(m.chat, { sticker: media, ...commonOptions }, { quoted: m })
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