//Plugin fatto da Axtral_WiZaRd
import fetch from 'node-fetch';

const API_BASE = 'https://api.clashroyale.com/v1';


const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk2Zjc2YzQwLTcwMTEtNDdhOS05NTIzLWIyOGFjNzdkZDI5NiIsImlhdCI6MTc1NzM3NzA4NCwic3ViIjoiZGV2ZWxvcGVyL2YzMDRmODg5LTMxM2EtN mJiMS05Y2E5LTJmNGMxYzYwMmNmZSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI5NS4yMzguMjE5LjIyIl0sInR5cGUiOiJjbGllbnQifV19.8PnzmpK3NlntP5YwMUmYF4Qs-gbfgHrZ05VCuTBx8FfuLFPMkg_sx52xxSxwlCoWFaXrH_g35g4KDxHbMtQVOA';

let handler = async (m, { conn, command, args }) => {

  if (!global.db) global.db = { data: { users: {}, chats: {} } }
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}


  if (command && command.toLowerCase() === 'setclash') {
    if (!args[0]) return await conn.reply(m.chat, '🏫 Benvenuto! Salva il tuo profilo Clash Royale con:\n`.setclash #ABC123`\nCosì potrai vederlo sempre con `.clash`', m)

    let tag = args[0].toUpperCase()
    if (!tag.startsWith('#')) tag = '#' + tag
    global.db.data.users[m.sender].clashRoyale_ID = tag
    return await conn.reply(m.chat, `✅ Tag salvato: ${tag}\nUsa .clash per vedere il tuo profilo.`, m)
  }


  if (command && (command.toLowerCase() === 'clash' || command.toLowerCase() === 'royale')) {
    let tag = args[0]
    if (!tag) tag = global.db.data.users[m.sender].clashRoyale_ID
    if (!tag) return await conn.reply(m.chat, '❗ Nessun tag Clash Royale salvato. Usa `.setclash <tag>` per salvarlo o `.clash <tag>` per cercare un giocatore.', m)

    tag = tag.toUpperCase()
    if (!tag.startsWith('#')) tag = '#' + tag
    const encodedTag = encodeURIComponent(tag)

    try {
      const res = await fetch(`${API_BASE}/players/${encodedTag}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return await conn.reply(m.chat, `❌ Errore: ${res.status} – ${err.reason || err.message || 'unknown'}`, m)
      }

      const data = await res.json()

      const clanName = data.clan?.name || '𝐍𝐞𝐬𝐬𝐮𝐧𝐨'
      const clanTag = data.clan?.tag || ''
      const clanRole = data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : '𝐍𝐞𝐬𝐬𝐮𝐧𝐨'

      const msg = `
𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐭𝐮𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐂𝐥𝐚𝐬𝐡 𝐑𝐨𝐲𝐚𝐥𝐞:

👤 𝐆𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞: *${data.name}*
🏷️ 𝐓𝐚𝐠 𝐩𝐫𝐨𝐟𝐢𝐥𝐨: *${data.tag}*
🏆 𝐓𝐫𝐨𝐟𝐞𝐢 𝐚𝐭𝐭𝐮𝐚𝐥𝐢: *${data.trophies}*
⭐ 𝐑𝐞𝐜𝐨𝐫𝐝 𝐦𝐢𝐠𝐥𝐢𝐨𝐫𝐞: *${data.bestTrophies}*
🏟️ 𝐀𝐫𝐞𝐧𝐚: *${data.arena?.name || 'N/A'}*
✅ 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞: *${data.wins}*
❌ 𝐒𝐜𝐨𝐧𝐟𝐢𝐭𝐭𝐞: *${data.losses}*
🔁 𝐏𝐚𝐫𝐭𝐢𝐭𝐞 𝐭𝐨𝐭𝐚𝐥𝐢: *${data.battleCount || 'N/A'}*
👥 𝐂𝐥𝐚𝐧: *${clanName}* ${clanTag ? '(' + clanTag + ')' : ''}
🎖️ 𝐑𝐮𝐨𝐥𝐨: *${clanRole}*
`.trim()

      return await conn.reply(m.chat, msg, m)
    } catch (err) {
      console.error('[info-clash-royale] errore fetch:', err)
      return await conn.reply(m.chat, '⚠️ Si è verificato un errore durante la richiesta (API o connessione).', m)
    }
  }
};

handler.help = ['setclash <tag>', 'clash [tag]']
handler.tags = ['info']
handler.command = /^(setclash|clash|royale)$/i

export default handler;