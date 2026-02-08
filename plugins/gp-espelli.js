import fs from 'fs'

async function handler(m, { isOwner, text, conn }) {
  if (!m.isGroup) return m.reply('ⓘ Questo comando funziona solo nei gruppi.')

  // FUNZIONE PER CONTROLLARE SE UN UTENTE È ADMIN O SUPERADMIN
  async function isUserAdmin(conn, chatId, senderId) {  
      try {  
          const decodedSender = conn.decodeJid(senderId);  
          const groupMeta = (conn.chats[chatId] || {}).metadata || await conn.groupMetadata(chatId).catch(_ => null) || {};  
          return groupMeta.participants?.some(p =>  
              (conn.decodeJid(p.id) === decodedSender || p.jid === decodedSender) &&  
              (p.admin === 'admin' || p.admin === 'superadmin')  
          ) || false;  
      } catch {  
          return false;  
      }  
  }

  const isBotAdmin = await isUserAdmin(conn, m.chat, conn.user.jid)
  if (!isBotAdmin) return m.reply('ⓘ 𝐃𝐞𝐯𝐨 𝐞𝐬𝐬𝐞𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐩𝐞𝐫 𝐩𝐨𝐭𝐞𝐫 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞.')

  const mention = m.mentionedJid?.[0] || m.quoted?.sender
  if (!mention) return m.reply('ⓘ 𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞.')

  const motivo = text ? text.replace(/@[\d\-]+/, '').trim() || 'non specificato' : 'non specificato'
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if ([ownerBot, conn.user.jid, m.sender].includes(mention)) {
      return m.reply('ⓘ Non puoi rimuovere il creator o te stesso.')
  }

  // CONTROLLA SE L'UTENTE DA KICKARE È ADMIN/SUPERADMIN
  const isTargetAdmin = await isUserAdmin(conn, m.chat, mention)

  // CONTROLLA SE È UN MODERATOR CUSTOM
  const prems = global.db?.data?.groups?.[m.chat]?.prems || []
  const isMod = prems.some(u => (u.includes('@s.whatsapp.net') ? u : `${u}@s.whatsapp.net`) === mention)

  if (isTargetAdmin) return m.reply('> ⚠️ 𝐀𝐧𝐭𝐢-𝐊𝐢𝐜𝐤\n> ⓘ L\'utente è admin o superadmin.')
  if (isMod) return m.reply('> ⚠️ 𝐀𝐧𝐭𝐢-𝐊𝐢𝐜𝐤\n> ⓘ L\'utente è un moderatore.')

  const fake = {
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
      message: { locationMessage: { name: '𝐑𝐢𝐦𝐨𝐳𝐢𝐨𝐧𝐞 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...', jpegThumbnail: fs.readFileSync('./icone/kick.png') } },
      participant: "0@s.whatsapp.net"
  }

  const userTag = `@${mention.split`@`[0]}`
  const senderTag = `@${m.sender.split`@`[0]}`
  const messaggio = 
`╭━━━[ *Rimozione utente* ]━━━╮
┃ 👤 𝐔𝐭𝐞𝐧𝐭𝐞: ${userTag}
┃ ⚠️ 𝐑𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚: ${senderTag}
┃ ❓ 𝐌𝐨𝐭𝐢𝐯𝐨: ${motivo}
╰━━━━━━━━━━━━━━━━━━━╯`

  conn.reply(m.chat, messaggio, fake, { mentions: [mention, m.sender] })
  conn.groupParticipantsUpdate(m.chat, [mention], 'remove')
}

handler.customPrefix = /kick|kamehameha|getout|avadakedavra|sparisci|caccola|vongole|puffo|allahuakbar/i
handler.command = new RegExp
handler.admin = true

export default handler