import fs from 'fs'

async function handler(m, { conn, isOwner, text, isBotAdmin }) {
if (!isOwner) return m.reply('ⓘ Solo il owner può usare questo comando.')

const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null) || text?.trim()
if (!mention) return m.reply('ⓘ Tagga o scrivi l’utente da bannare.')

const target = conn.decodeJid(mention)

// Ottieni tutte le chat partecipanti
let groups
try {
groups = await conn.groupFetchAllParticipating()
} catch {
return m.reply('ⓘ Errore nel recupero dei gruppi.')
}

let report = []

for (let [jid, group] of Object.entries(groups)) {
try {
if (!jid.endsWith('@g.us')) continue

// Controlla se il bot è admin nel gruppo
const botIsAdmin = group.participants?.some(p =>
conn.user.jid === conn.decodeJid(p.id) &&
(p.admin === 'admin' || p.admin === 'superadmin')
)

if (!botIsAdmin) continue

// Controlla se l’utente è nel gruppo
const participant = group.participants?.find(p =>
conn.decodeJid(p.id) === target
)

if (!participant) continue

await conn.groupParticipantsUpdate(jid, [target], 'remove')

report.push(`• ${group.subject || 'Gruppo senza nome'}`)
} catch {}
}

if (report.length === 0) {
return m.reply('ⓘ Nessun gruppo trovato o utente non presente nei gruppi gestiti.')
}

const reportText = `╭━━━[ *BANALL REPORT* ]━━━╮\n` +
`┃ 👤 Utente: ${target}\n` +
`┃ 📊 Gruppi colpiti: ${report.length}\n\n` +
report.join('\n') +
`\n╰━━━━━━━━━━━━━━━━━━━╯`

await m.reply(reportText)
}

handler.command = /^banall$/i
handler.group = false
handler.admin = false
handler.botAdmin = true

export default handler