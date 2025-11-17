import * as fs from 'fs'

export async function before(m, { conn, isAdmin, isPrems, isBotAdmin, isOwner, usedPrefix }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1

  // Ignora se il messaggio è di owner, admin o del bot stesso
  if (isOwner || isAdmin || isPrems || m.fromMe) return !0

  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[this.user.jid] || {}
  let delet = m.key.participant
  let bang = m.key.id

  let fakemek = {
    key: {
      participant: "0@s.whatsapp.net",
      remoteJid: "0@s.whatsapp.net"
    },
    message: {
      groupInviteMessage: {
        groupJid: "51995386439-1616969743@g.us",
        inviteCode: "m",
        groupName: "P",
        caption: "𝐓𝐑𝐀𝐕𝐀-𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃",
        jpegThumbnail: null
      }
    }
  }

  if (chat.antitrava && m.text.length > 4000) { // Quantità massima di caratteri accettati
    conn.sendMessage(
      m.chat,
      `*𝐓𝐑𝐀𝐕𝐀 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎*\n${isBotAdmin ? '' : '𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐀𝐃𝐌𝐈𝐍 𝐄 𝐍𝐎𝐍 𝐏𝐎𝐒𝐒𝐎 𝐅𝐀𝐑𝐄 𝐍𝐈𝐄𝐍𝐓𝐄 :/'}`,
      m
    )

    if (isBotAdmin) {
      conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
      setTimeout(() => {
        conn.sendMessage(
          m.chat,
          { 
            text: `𝐂𝐎𝐆𝐋𝐈𝐎𝐍𝐄 𝐓𝐎𝐋𝐓𝐎 ✓\n\n• @${m.sender.split("@")[0]} 𝐇𝐀 𝐈𝐍𝐕𝐈𝐀𝐓𝐎 𝐔𝐍 𝐓𝐑𝐀𝐕𝐀`, 
            mentions: [m.sender] 
          },
          { quoted: fakemek, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 }
        )
      }, 0)
      setTimeout(() => {
        conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }, 1000)
    } else if (!bot.restrict) {
      return m.reply(`${lenguajeGB['smsSoloOwner']()}`)
    }
  }
  return !0
}