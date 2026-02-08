//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

async function handler(m, { isBotAdmin, isOwner, text, conn }) {
  if (!isBotAdmin) return m.reply('ⓘ 𝐃𝐞𝐯𝐨 𝐞𝐬𝐬𝐞𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐩𝐞𝐫 𝐩𝐨𝐭𝐞𝐫 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞.')

  const mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.quoted
  if (!mention) return m.reply('ⓘ 𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞.')

  const motivo = text
    ? text.replace(/@[\d\-]+/, '').trim() || 'non specificato'
    : 'non specificato'

  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if (mention === ownerBot) return m.reply('ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐢𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭.')
  if (mention === conn.user.jid) return m.reply('ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐢𝐥 𝐛𝐨𝐭.')
  if (mention === m.sender) return m.reply('ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐢𝐦𝐨𝐯𝐞𝐫𝐞 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.')

  let groupMetadata
  try {
    groupMetadata = await conn.groupMetadata(m.chat)
  } catch {
    return m.reply('ⓘ Errore nel recupero dei dati del gruppo.')
  }

  const decodedMention = conn.decodeJid(mention)

  const utente = groupMetadata.participants.find(p => {
    const jid = conn.decodeJid(p.id || p.jid)
    return jid === decodedMention
  })

  if (!utente) return m.reply('ⓘ L’utente non è presente nel gruppo.')

  const owner = utente.admin === 'superadmin'
  const admin = utente.admin === 'admin'

  const prems = global.db?.data?.groups?.[m.chat]?.prems || []

  const mod = prems.some(u => {
    const jid = u.includes('@s.whatsapp.net') ? u : `${u}@s.whatsapp.net`
    return jid === decodedMention
  })

  if (owner) return m.reply('> ⚠️ 𝐀𝐧𝐭𝐢-𝐊𝐢𝐜𝐤\n> ⓘ 𝐋\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐡𝐞 𝐡𝐚𝐢 𝐩𝐫𝐨𝐯𝐚𝐭𝐨 𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐞̀ 𝐢𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.')
  if (admin) return m.reply('> ⚠️ 𝐀𝐧𝐭𝐢-𝐊𝐢𝐜𝐤\n> ⓘ 𝐋\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐡𝐞 𝐡𝐚𝐢 𝐩𝐫𝐨𝐯𝐚𝐭𝐨 𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐞̀ 𝐚𝐝𝐦𝐢𝐧.')
  if (mod) return m.reply('> ⚠️ 𝐀𝐧𝐭𝐢-𝐊𝐢𝐜𝐤\n> ⓘ 𝐋\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐡𝐞 𝐡𝐚𝐢 𝐩𝐫𝐨𝐯𝐚𝐭𝐨 𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞.')

  const fake = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '𝐑𝐢𝐦𝐨𝐳𝐢𝐨𝐧𝐞 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...',
        jpegThumbnail: fs.readFileSync('./icone/kick.png'),
      }
    },
    participant: "0@s.whatsapp.net"
  }

  const userTag = `@${decodedMention.split`@`[0]}`
  const senderTag = `@${m.sender.split`@`[0]}`

  const messaggio = 
`╭━━━[ *Rimozione utente* ]━━━╮
┃ 👤 𝐔𝐭𝐞𝐧𝐭𝐞: ${userTag}
┃ ⚠️ 𝐑𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚: ${senderTag}
┃ ❓ 𝐌𝐨𝐭𝐢𝐯𝐨: ${motivo}
╰━━━━━━━━━━━━━━━━━━━╯`

  conn.reply(m.chat, messaggio, fake, { mentions: [decodedMention, m.sender] })
  conn.groupParticipantsUpdate(m.chat, [decodedMention], 'remove')
}

handler.customPrefix = /kick|kamehameha|getout|avadakedavra|sparisci|caccola|vongole|puffo|allahuakbar/i
handler.command = new RegExp
handler.admin = true

export default handler