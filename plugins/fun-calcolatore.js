import jimp from "jimp"
import { generateWAMessageFromContent } from "@whiskeysockets/baileys"
import fs from "fs"

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) 
    if (!m.mentionedJid[0] && !m.quoted) return 
  const mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.quoted

  if (command == 'gay') {
    let image
    try {
      const background = await jimp.read("./icone/lgbt.png")
      const picture = await jimp.read(await conn.profilePictureUrl(mention ? mention : m.sender, 'image'))
      image = await background.composite(picture.resize(518, 518), 0, 0, {
        mode: 'dstOver', 
        opacitySource: 1, 
        opacityDest: 1
      }).getBufferAsync('image/png')
    } catch { 
      image = fs.readFileSync("./icone/lgbt.jpg")
    }

    const format = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: ("@") + (mention ? mention : m.sender).split("@")[0] + (mention ? " é " : " 𝐬𝐞𝐢 ") + ("𝐠𝐚𝐲 𝐚𝐥 ") + Math.floor(Math.random() * 100) + ("%"), 
        contextInfo: { 
          externalAdReply: { 
            title: await conn.getName(mention ? mention : m.sender), 
            thumbnail: image, 
            sourceUrl: "https://wa.me/" + (mention ? mention.split("@")[0] : m.sender.split("@")[0])
          }, mentionedJid: [mention, m.sender] 
        }
      }
    }, { quoted: null })

    conn.relayMessage(m.chat, format.message, { messageId: format.key.id })
  }

  //════════════ ೋೋ ════════════

  if (command == 'frocio') {
    let image
    try {
      const background = await jimp.read("./icone/lgbt.png")
      const picture = await jimp.read(await conn.profilePictureUrl(mention ? mention : m.sender, 'image'))
      image = await background.composite(picture.resize(518, 518), 0, 0, {
        mode: 'dstOver', 
        opacitySource: 1, 
        opacityDest: 1
      }).getBufferAsync('image/png')
    } catch { 
      image = fs.readFileSync("./icone/lgbt.jpg")
    }

    const format = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: ("@") + (mention ? mention : m.sender).split("@")[0] + (mention ? " é " : " 𝐬𝐞𝐢 ") + ("𝐟𝐫𝐨𝐜𝐢𝐨 𝐚𝐥 ") + Math.floor(Math.random() * 100) + ("%"), 
        contextInfo: { 
          externalAdReply: { 
            title: await conn.getName(mention ? mention : m.sender), 
            thumbnail: image, 
            sourceUrl: "https://wa.me/" + (mention ? mention.split("@")[0] : m.sender.split("@")[0])
          }, mentionedJid: [mention, m.sender] 
        }
      }
    }, { quoted: null })

    conn.relayMessage(m.chat, format.message, { messageId: format.key.id })
  } 

  //════════════ ೋೋ ════════════

  if (command == 'lesbica') {
    let image
    try {
      const background = await jimp.read("./icone/lgbt.png")
      const picture = await jimp.read(await conn.profilePictureUrl(mention ? mention : m.sender, 'image'))
      image = await background.composite(picture.resize(518, 518), 0, 0, {
        mode: 'dstOver', 
        opacitySource: 1, 
        opacityDest: 1
      }).getBufferAsync('image/png')
    } catch { 
      image = fs.readFileSync("./icone/lgbt.jpg")
    }

    const format = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: ("@") + (mention ? mention : m.sender).split("@")[0] + (mention ? " é " : " 𝐬𝐞𝐢 ") + ("𝐥𝐞𝐬𝐛𝐢𝐜𝐚 𝐚𝐥 ") + Math.floor(Math.random() * 100) + ("%"), 
        contextInfo: { 
          externalAdReply: { 
            title: await conn.getName(mention ? mention : m.sender), 
            thumbnail: image, 
            sourceUrl: "https://wa.me/" + (mention ? mention.split("@")[0] : m.sender.split("@")[0])
          }, mentionedJid: [mention, m.sender] 
        }
      }
    }, { quoted: null })

    conn.relayMessage(m.chat, format.message, { messageId: format.key.id })
  }

  //════════════ ೋೋ ════════════

  if (command == 'nero') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐧𝐞𝐫𝐨 𝐚𝐥 ${Math.floor(Math.random() * 100)}% ⚫
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'nera') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐧𝐞𝐫𝐚 𝐚𝐥 ${Math.floor(Math.random() * 100)}% ⚫
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'puttana') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐩𝐮𝐭𝐭𝐚𝐧𝐚 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 🔞
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'criminale') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐜𝐫𝐢𝐦𝐢𝐧𝐚𝐥𝐞 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 🦹🏻‍♀️
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'drogato' || command == "drogata") {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐝𝐫𝐨𝐠𝐚𝐭𝐨/𝐚 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 💊
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'nazista') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐧𝐚𝐳𝐢𝐬𝐭𝐚 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 卐
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'comunista') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐜𝐨𝐦𝐮𝐧𝐢𝐬𝐭𝐚 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'clown') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐜𝐥𝐨𝐰𝐧 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 🤡
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }

  //════════════ ೋೋ ════════════

  if (command == 'puttaniere') {
    conn.reply(m.chat, `
@${(mention ? mention : m.sender).split("@")[0]} è 𝐩𝐮𝐭𝐭𝐚𝐧𝐢𝐞𝐫𝐞 𝐚𝐥 ${Math.floor(Math.random() * 100)}% 🔞
    `.trim(), m, {
      mentions: [mention ? mention : m.sender]
    })
  }
}

handler.help = ['gay', 'lesbica','puttana','puttaniere'].map(v => v + ' @tag | nombre')
handler.tags = ['calculator']
handler.command = /^gay|lesbica|frocio|puttana|nero|nera|puttaniere|criminale|drogato|drogata|nazista|comunista|clown/i

export default handler