// Codice di antinuke.js
// Plugin fatto da Axtral_WiZaRd

import fs from 'fs'
import path from 'path'

const whitelistFile = path.join('./db', 'autorizzati-antinuke.json')

// Funzioni di lettura e scrittura JSON
const readWhitelist = () => {
  if (!fs.existsSync(whitelistFile)) return {}
  return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'))
}

const writeWhitelist = (data) => {
  fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf-8')
}

// --- HANDLER PRINCIPALE ---
const handler = async (m, { conn, args, usedPrefix, participants, isBotAdmin }) => {

  // --- ANTINUKE ---
  if (m.isGroup && isBotAdmin) {
    const chat = global.db.data.chats[m.chat]
    if (chat?.antinuke) {

      const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
      const sender = m.key?.participant || m.participant || m.sender

      const whitelist = readWhitelist()
      const groupWhitelist = whitelist[m.chat]?.autorizzati || []

      let founderJid = null
      try { founderJid = (await conn.groupMetadata(m.chat)).owner } catch { founderJid = null }

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
            !ownerJids.includes(jid) &&
            !groupWhitelist.includes(jid) &&
            jid !== founderJid
          )
        if (!usersToDemote.length) return
        try { 
          await conn.groupParticipantsUpdate(m.chat, usersToDemote, 'demote')
          console.log('[ANTINUKE] Retrocessi:', usersToDemote)
        } catch(e) { console.error('[ANTINUKE] Errore:', e) }
      }

      if ([29, 30, 21].includes(m.messageStubType)) {
        if (!isAuthorized(sender)) await cleanAdmins()
      }
    }
  }

  // --- WHITELIST COMMANDS ---
  if (m.isGroup && ['addwhitelist', 'delwhitelist'].includes(m.command)) {

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
    const sender = m.key?.participant || m.participant || m.sender

    if (!ownerJids.includes(sender)) return m.reply('❌ Solo gli owner possono usare questo comando.')

    const whitelist = readWhitelist()
    if (!whitelist[m.chat]) whitelist[m.chat] = { autorizzati: [] }

    let targetJid
    if (m.quoted) targetJid = m.quoted.sender
    else if (args[0] && args[0].startsWith('@')) targetJid = args[0].replace('@','')+'@s.whatsapp.net'
    else if (args[0]) targetJid = args[0].replace(/\D/g,'')+'@s.whatsapp.net'
    else return m.reply('Specifica un utente da aggiungere o rimuovere.')

    const participantsList = (await conn.groupMetadata(m.chat)).participants.map(p=>p.jid)
    if (!participantsList.includes(targetJid)) return m.reply('L’utente deve essere nel gruppo.')

    switch (m.command) {
      case 'addwhitelist':
        if (!whitelist[m.chat].autorizzati.includes(targetJid)) {
          whitelist[m.chat].autorizzati.push(targetJid)
          writeWhitelist(whitelist)
          return m.reply(`✅ Utente aggiunto alla whitelist: ${targetJid}`)
        } else return m.reply('Utente già nella whitelist.')
      
      case 'delwhitelist':
        whitelist[m.chat].autorizzati = whitelist[m.chat].autorizzati.filter(jid => jid !== targetJid)
        writeWhitelist(whitelist)
        return m.reply(`❌ Utente rimosso dalla whitelist: ${targetJid}`)
    }
  }
}

// --- RIMOZIONE AUTOMATICA UTENTI USCITI ---
handler.onParticipantUpdate = async function(m, { participants }) {
  const whitelist = readWhitelist()
  if (!whitelist[m.chat]) return
  for (const p of participants) {
    if (p.action==='remove') {
      whitelist[m.chat].autorizzati = whitelist[m.chat].autorizzati.filter(jid => jid!==p.id)
    }
  }
  writeWhitelist(whitelist)
}

// --- HANDLER DEI COMANDI ALLA FINE ---
handler.command = ['addwhitelist', 'delwhitelist']
handler.group = true

export default handler