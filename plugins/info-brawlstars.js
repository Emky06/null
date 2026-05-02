import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE = 'https://api.brawlstars.com/v1'
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NWU3ZTk5LWRhZWMtNDVmMC1iYTY5LTBmZTM5NDRkN2EzZCIsImlhdCI6MTc3NzY4MjQ5NCwic3ViIjoiZGV2ZWxvcGVyLzE1YzBiZTMxLWFmMmEtNDczNi1lZjA3LWVjMGI0MWY5ZDc2MCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiOTQuMzMuODQuMTMiXSwidHlwZSI6ImNsaWVudCJ9XX0.f-ibcd-XSJqRFZg-Sm-Md4XS0WMJSfC7SIM4idBT3Z5nb1MYjasaD06lU81UcKpR9bd-Wb7xCQ_9DRC1hn1b3A'

const DB_FILE = path.join(__dirname, '..', 'brawl_users.json')

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '{}')

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function extractTarget(m, args) {
  let target = m.sender

  if (Array.isArray(m.mentionedJid) && m.mentionedJid.length > 0) {
    target = m.mentionedJid[0]
  } else if (m.quoted?.sender) {
    target = m.quoted.sender
  } else if (args?.length) {
    const raw = args.join(' ')
    const num = raw.replace(/[^0-9]/g, '')
    if (num) target = num + '@s.whatsapp.net'
  }

  return target
}

function formatTag(input) {
  if (!input) return null

  input = String(input).trim().toUpperCase().replace(/\s/g, '')

  if (/^\d+$/.test(input)) return `#${input}`
  if (!input.startsWith('#')) return `#${input}`

  return input
}

let handler = async (m, { conn, command, args }) => {
  const db = loadDB()

  if (command === 'setbrawl') {
    if (!args[0]) {
      return await conn.reply(
        m.chat,
        '🎮 Salva il tuo tag con\n`.setbrawl #ILTUOTAG`\nPoi potrai usare `.brawl` per vedere le statistiche',
        m
      )
    }

    let tag = formatTag(args[0])

    if (!db[m.sender]) db[m.sender] = {}
    db[m.sender].tag = tag

    saveDB(db)

    return await conn.reply(
      m.chat,
      `✅ Tag salvato: ${tag}\nUsa .brawl per vedere il tuo profilo.`,
      m
    )
  }

  if (command === 'brawl') {
    const db = loadDB()

    const target = extractTarget(m, args)

    let input = args.join(' ').trim()

    let tag = null

    if (!input) {
      tag = db[target]?.tag
    } else {
      input = input.replace(/\s/g, '')
      tag = formatTag(input)
    }

    if (!tag || typeof tag !== 'string') {
      return await conn.reply(
        m.chat,
        '❗ Nessun tag salvato per questo utente.\nUsa .setbrawl #TAG o inserisci un tag valido',
        m
      )
    }

    if (!tag.startsWith('#')) {
      return await conn.reply(
        m.chat,
        '❗ Tag non valido.\nUsa .setbrawl #TAG',
        m
      )
    }

    const encodedTag = encodeURIComponent(tag)

    try {
      const res = await fetch(`${API_BASE}/players/${encodedTag}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })

      if (!res.ok) {
        return await conn.reply(m.chat, '❌ Errore API', m)
      }

      const data = await res.json()

      const victories3v3 = data['3vs3Victories'] || 0
      const victoriesSolo = data['soloVictories'] || 0
      const victoriesDuo = data['duoVictories'] || 0
      const totalPlayed = victories3v3 + victoriesSolo + victoriesDuo

      const header =
        target === m.sender
          ? '𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐭𝐮𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬:'
          : `𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬 𝐝𝐢 @${target.split('@')[0]}:`

      const msg = `
${header}

👤 𝐆𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞: *${data.name}*
🏷️ 𝐓𝐚𝐠 𝐩𝐫𝐨𝐟𝐢𝐥𝐨: *${data.tag}*
🏆 𝐓𝐫𝐨𝐟𝐞𝐢 𝐚𝐭𝐭𝐮𝐚𝐥𝐢: *${data.trophies || 0}*
⭐ 𝐑𝐞𝐜𝐨𝐫𝐝 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐭𝐫𝐨𝐟𝐞𝐢: *${data.highestTrophies || 0}*
💥 𝐏𝐮𝐧𝐭𝐢 𝐞𝐬𝐩𝐞𝐫𝐢𝐞𝐧𝐳𝐚: *${data.expLevel || 0}*

🎯 𝟑𝐯𝟑 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞: *${victories3v3}*
🎯 𝐒𝐨𝐥𝐨 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞: *${victoriesSolo}*
🎯 𝐃𝐮𝐨 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞: *${victoriesDuo}*

🧩 𝐁𝐫𝐚𝐰𝐥𝐞𝐫𝐬: *${data.brawlers?.length || 0}*
🧩 𝐏𝐚𝐫𝐭𝐢𝐭𝐞 𝐭𝐨𝐭𝐚𝐥𝐢: *${totalPlayed}*

🏅 𝐂𝐥𝐮𝐛: ${data.club?.name || '𝐍𝐞𝐬𝐬𝐮𝐧𝐨'}
`.trim()

      return await conn.sendMessage(
        m.chat,
        {
          text: msg,
          mentions: [target]
        },
        { quoted: m }
      )

    } catch (err) {
      return await conn.reply(
        m.chat,
        '⚠️ Si è verificato un errore durante la richiesta (API o connessione).',
        m
      )
    }
  }
}

handler.help = ['setbrawl <tag>', 'brawl [tag]']
handler.tags = ['info']
handler.command = /^(setbrawl|brawl)$/i

export default handler