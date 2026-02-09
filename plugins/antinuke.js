//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const whitelistFile = './autorizzati-antinuke.json'

if (!fs.existsSync(whitelistFile)) {
  fs.writeFileSync(whitelistFile, '{}', 'utf-8')
}

const readWhitelist = () => {
  return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'))
}

const writeWhitelist = data => {
  fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf-8')
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) return

  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
  const sender = m.key?.participant || m.participant || m.sender

  if (!ownerJids.includes(sender)) {
    return m.reply('❌ Solo gli owner possono usare questo comando.')
  }

  const whitelist = readWhitelist()
  if (!whitelist[m.chat]) whitelist[m.chat] = { autorizzati: [] }

  let targetJid = null

  if (m.quoted?.sender) targetJid = m.quoted.sender
  else if (m.mentionedJid?.length) targetJid = m.mentionedJid[0]
  else if (args[0]) targetJid = args[0].replace(/\D/g, '') + '@s.whatsapp.net'
  else return m.reply(`❌ Usa: ${usedPrefix + command} @user`)

  const metadata = await conn.groupMetadata(m.chat)
  const participants = metadata.participants.map(p => p.jid)

  if (!participants.includes(targetJid)) {
    return m.reply('❌ L’utente deve essere nel gruppo.')
  }

  if (command === 'addwhitelist') {
    if (whitelist[m.chat].autorizzati.includes(targetJid)) {
      return m.reply('⚠️ Utente già in whitelist.')
    }

    whitelist[m.chat].autorizzati.push(targetJid)
    writeWhitelist(whitelist)

    return m.reply(`✅ Utente aggiunto alla whitelist:\n@${targetJid.split('@')[0]}`)
  }

  if (command === 'delwhitelist') {
    whitelist[m.chat].autorizzati =
      whitelist[m.chat].autorizzati.filter(jid => jid !== targetJid)

    writeWhitelist(whitelist)

    return m.reply(`❌ Utente rimosso dalla whitelist:\n@${targetJid.split('@')[0]}`)
  }
}

handler.before = async function (m, { conn, participants, isBotAdmin }) {
  if (!m.isGroup || !isBotAdmin) return

  const chat = global.db.data.chats[m.chat]
  if (!chat?.antinuke) return

  const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
  const sender = m.key?.participant || m.participant || m.sender

  const whitelist = readWhitelist()
  const groupWhitelist = whitelist[m.chat]?.autorizzati || []

  let founderJid = null
  try {
    const metadata = await conn.groupMetadata(m.chat)
    founderJid = metadata.owner
  } catch {}

  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')

  const isAuthorized = jid =>
    groupWhitelist.includes(jid) ||
    jid === botJid ||
    jid === founderJid ||
    ownerJids.includes(jid)

  const cleanAdmins = async () => {
    const usersToDemote = participants
      .map(p => p.jid)
      .filter(jid =>
        jid &&
        jid !== botJid &&
        jid !== founderJid &&
        !ownerJids.includes(jid) &&
        !groupWhitelist.includes(jid)
      )

    if (!usersToDemote.length) return
    await conn.groupParticipantsUpdate(m.chat, usersToDemote, 'demote')
  }

  if ([29, 30, 21].includes(m.messageStubType)) {
    if (!isAuthorized(sender)) await cleanAdmins()
  }
}

handler.onParticipantUpdate = async function (m, { participants }) {
  const whitelist = readWhitelist()
  if (!whitelist[m.chat]) return

  for (const p of participants) {
    if (p.action === 'remove') {
      whitelist[m.chat].autorizzati =
        whitelist[m.chat].autorizzati.filter(jid => jid !== p.id)
    }
  }

  writeWhitelist(whitelist)
}

handler.command = ['addwhitelist', 'delwhitelist']
handler.group = true

export default handler