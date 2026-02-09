//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const whitelistFile = './autorizzati-antinuke.json'

const readWhitelist = () => {
  if (!fs.existsSync(whitelistFile)) return {}
  return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'))
}

let handler = async (m, { conn, usedPrefix, text }) => {
  const whitelist = readWhitelist()
  const groupWhitelist = whitelist[m.chat]?.autorizzati || []

  const senderNumber = m.sender.split('@')[0]
  const botNumber = conn.user.jid
  const ownerNumbers = (global.owner || []).map(o => o[0])

  const isAuthorized =
    groupWhitelist.includes(m.sender) ||
    ownerNumbers.includes(senderNumber) ||
    senderNumber + '@s.whatsapp.net' === botNumber

  if (!isAuthorized) {
    return m.reply('⛔ 𝐍𝐨𝐧 𝐬𝐞𝐢 𝐚𝐮𝐭𝐨𝐫𝐢𝐳𝐳𝐚𝐭𝐨 𝐚 𝐮𝐬𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨.')
  }

  let user

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0]
  } else if (m.quoted?.sender) {
    user = m.quoted.sender
  } else if (text) {
    if (text.endsWith('@s.whatsapp.net') || text.endsWith('@c.us')) {
      user = text.trim()
    } else {
      let numberInput = text.split(' ').join('')
      let number = numberInput.replace(/\D/g, '')
      if (number.length < 8 || number.length > 15) {
        return m.reply('⚠️ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.')
      }
      user = number + '@s.whatsapp.net'
    }
  }

  if (!user) {
    return m.reply(`❌ 𝐃𝐞𝐯𝐢 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞, 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐨 𝐢𝐧𝐬𝐞𝐫𝐢𝐫𝐞 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐩𝐞𝐫 𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐝𝐞𝐫𝐥𝐨.`)
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
  } catch (e) {
    console.error('Errore durante demote:', e)
    m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥𝐚 𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞.')
  }
}

handler.command = /^(demote|retrocedi|togliadmin|r)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler