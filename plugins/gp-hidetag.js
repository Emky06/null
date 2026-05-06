import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  
  let isViewOnce = q.mtype === 'viewOnceMessageV2' || q.mtype === 'viewOnceMessage'
  let type = isViewOnce ? Object.keys(q.message)[0] : q.mtype
  let msg = isViewOnce ? q.message[type].message[Object.keys(q.message[type].message)[0]] : (q.msg || q)

  let captionText = m.quoted?.text ? `➠ ${m.quoted.text}` : (text?.trim() ? `➠ ${text.trim()}` : `➠`)
  let mentions = [...new Set([...(m.mentionedJid || []), ...users])]

  try {
    if (!m.quoted) {
      await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
      return
    }

    let media = await q.download?.().catch(() => null)
    let isGif = msg?.gifPlayback || q.msg?.gifPlayback || false

    let opt = {
      mentions: mentions,
      contextInfo: { 
        mentionedJid: mentions,
        isForwarded: false
      },
      viewOnce: isViewOnce
    }

    if (isGif || type === 'videoMessage' && isGif) {
      await conn.sendMessage(m.chat, { 
        video: media, 
        gifPlayback: true, 
        caption: captionText,
        ...opt 
      }, { quoted: m })
    } else if (type === 'imageMessage' || (isViewOnce && type.includes('image'))) {
      await conn.sendMessage(m.chat, { image: media, caption: captionText, ...opt }, { quoted: m })
    } else if (type === 'videoMessage' || (isViewOnce && type.includes('video'))) {
      await conn.sendMessage(m.chat, { video: media, caption: captionText, ...opt }, { quoted: m })
    } else if (type === 'audioMessage' || (isViewOnce && type.includes('audio'))) {
      await conn.sendMessage(m.chat, { 
        audio: media, 
        mimetype: 'audio/mp4', 
        ptt: isViewOnce ? true : (msg?.ptt || false),
        ...opt 
      }, { quoted: m })
    } else if (type === 'stickerMessage') {
      await conn.sendMessage(m.chat, { sticker: media, ...opt }, { quoted: m })
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
