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
        groupJid: "",
        inviteCode: "",
        groupName: "",
        caption: "⚠️ 𝐀𝐧𝐭𝐢-𝐓𝐫𝐚𝐯𝐚 𝐚𝐭𝐭𝐢𝐯𝐨 ⚠️",
        jpegThumbnail: null
      }
    }
  }

  if (chat.antitrava && m.text.length > 6000) { // Quantità massima di caratteri accettati
    conn.sendMessage(
      m.chat,
      `*𝐓𝐞𝐬𝐭𝐨 𝐥𝐮𝐧𝐠𝐨 𝐫𝐢𝐥𝐞𝐯𝐚𝐭𝐨, 𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐭𝐫𝐚𝐯𝐚*\n${isBotAdmin ? '' : '𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐀𝐃𝐌𝐈𝐍 𝐄 𝐍𝐎𝐍 𝐏𝐎𝐒𝐒𝐎 𝐅𝐀𝐑𝐄 𝐍𝐈𝐄𝐍𝐓𝐄 :/'}`,
      m
    )

    if (isBotAdmin) {
      conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
      setTimeout(() => {
        conn.sendMessage(
          m.chat,
          { 
            text: `𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 ✓\n\n𝐓𝐞𝐬𝐭𝐨 𝐥𝐮𝐧𝐠𝐨 𝐫𝐢𝐥𝐞𝐯𝐚𝐭𝐨 𝐝𝐚 @${m.sender.split("@")[0]}, 𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐭𝐫𝐚𝐯𝐚. `, 
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