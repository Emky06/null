//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

async function handler(m, { conn, isBotAdmin, isOwner, text }) {
  if (!isBotAdmin) return m.reply('ⓘ 𝐃𝐞𝐯𝐨 𝐞𝐬𝐬𝐞𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐩𝐞𝐫 𝐩𝐨𝐭𝐞𝐫 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞.')

  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
  if (!mention) return m.reply('ⓘ 𝐌𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞.')

  const motivo = text
    ? text.replace(/@[\d\-]+/, '').trim() || 'non specificato'
    : 'non specificato'

  if (mention === conn.user.jid) return m.reply('ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐢𝐥 𝐛𝐨𝐭.')
  if (mention === m.sender) return m.reply('ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐢𝐦𝐨𝐯𝐞𝐫𝐞 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.')

  let groupMetadata
  try {
    groupMetadata = await conn.groupMetadata(m.chat)
  } catch {
    return m.reply('ⓘ Errore nel recupero dei dati del gruppo.')
  }

  const decodedMention = conn.decodeJid(mention)

const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
if (ownerJids.includes(decodedMention)) return m.reply('> ⚠️ 𝐀𝐧𝐭𝐢-𝐊𝐢𝐜𝐤\n> ⓘ 𝐋\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐡𝐞 𝐡𝐚𝐢 𝐩𝐫𝐨𝐯𝐚𝐭𝐨 𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 𝐞̀ 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫 𝐝𝐞𝐥 𝐛𝐨𝐭.')

  const participants = groupMetadata.participants || []
  const normalizedParticipants = participants.map(u => {
    const normalizedId = conn.decodeJid(u.id)
    return { ...u, id: normalizedId, jid: u.jid || normalizedId }
  })

  const utente = normalizedParticipants.find(u =>
    u.id === decodedMention || u.jid === decodedMention
  )
  if (!utente) return m.reply('ⓘ 𝐋’𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐞̀ 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.')

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
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: '𝐑𝐢𝐦𝐨𝐳𝐢𝐨𝐧𝐞 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...',
        jpegThumbnail: fs.readFileSync('./icone/kick.png')
      }
    },
    participant: "0@s.whatsapp.net"
  }

  const userTag = `@${decodedMention.split`@`[0]}`
  const senderTag = `@${m.sender.split`@`[0]}`

  const messaggio =
`╭━━〔 💀 *𝐒𝐌𝐀𝐑𝐓𝐈𝐄𝐒 𝐊𝐈𝐋𝐋𝐄𝐑* 💀 〕━━╮
┃ ☠️ ${userTag} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨.
┃ 🩸 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐩𝐢𝐞𝐭𝐚̀ 𝐝𝐚 𝐩𝐚𝐫𝐭𝐞 𝐝𝐢 ${senderTag}
┃ ⚡ 𝐌𝐨𝐭𝐢𝐯𝐨: ${motivo}
┃ 🕯️ 𝐂𝐡𝐞 𝐢𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐫𝐢𝐭𝐫𝐨𝐯𝐢 𝐥𝐚 𝐩𝐚𝐜𝐞...
╰━━━━━━━━━━━━━━━━━━━━━━╯`

  conn.reply(m.chat, messaggio, fake, { mentions: [decodedMention, m.sender] })
  conn.groupParticipantsUpdate(m.chat, [decodedMention], 'remove')
}

handler.customPrefix = /smartieskiller/i
handler.command = new RegExp
handler.premium = true
handler.group = true

export default handler