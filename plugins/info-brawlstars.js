//Plugin fatto da Axtral_WiZaRd
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE = 'https://api.brawlstars.com/v1'
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NWU3ZTk5LWRhZWMtNDVmMC1iYTY5LTBmZTM5NDRkN2EzZCIsImlhdCI6MTc3NzY4MjQ5NCwic3ViIjoiZGV2ZWxvcGVyLzE1YzBiZTMxLWFmMmEtNDczNi1lZjA3LWVjMGI0MWY5ZDc2MCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiOTQuMzMuODQuMTMiXSwidHlwZSI6ImNsaWVudCJ9XX0.f-ibcd-XSJqRFZg-Sm-Md4XS0WMJSfC7SIM4idBT3Z5nb1MYjasaD06lU81UcKpR9bd-Wb7xCQ_9DRC1hn1b3A'
const BROWSERLESS_KEY = '2URLFvIaT2R9pY97626b5125ee35d7a9af4d8e0cd1261901d'

const DB_FILE = path.resolve(process.cwd(), 'storage', 'file-json', 'tag-brawlstars.json')

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '{}')

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

async function retryScreenshot(html, retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, {
                html,
                options: { type: 'jpeg', quality: 90 },
                viewport: { width: 1000, height: 600 }
            }, { responseType: 'arraybuffer', timeout: 15000 });
            return Buffer.from(response.data);
        } catch (e) {
            console.error('Screenshot Error:', e.message);
            if (e.response?.status === 429) {
                console.warn(`Rate limit hit, retrying after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else if (e.response?.status === 400) {
                console.error('Bad request to Browserless API. HTML may be invalid.');
                throw e;
            } else {
                throw e;
            }
        }
    }
    throw new Error('Max retries reached for screenshot');
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

    let tag = args[0].toUpperCase()
    if (!tag.startsWith('#')) tag = '#' + tag

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

    let target = m.sender

    if (Array.isArray(m.mentionedJid) && m.mentionedJid.length > 0) {
      target = m.mentionedJid[0]
    } else if (m.quoted?.sender) {
      target = m.quoted.sender
    }

    let tag = args[0]

    if (!tag) {
      tag = db[target]?.tag
    }

    if (!tag || typeof tag !== 'string' || !tag.includes('#')) {
      return await conn.reply(
        m.chat,
        '❗ Nessun tag salvato per questo utente.\nUsa .setbrawl #TAG',
        m
      )
    }

    tag = String(tag).toUpperCase().replace(/[^A-Z0-9#]/g, '')
    if (!tag.startsWith('#')) tag = '#' + tag

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

      const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
              * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Lilita One', cursive; }
              
              body {
                  width: 1000px; height: 600px;
                  display: flex; align-items: center; justify-content: center;
                  background-color: #0d1323; overflow: hidden; position: relative;
              }
              
              .bg-image {
                  position: absolute; top: -10%; left: -10%; width: 120%; height: 120%;
                  background-image: url('https://wallpapercave.com/wp/wp4263657.jpg');
                  background-size: cover; background-position: center;
                  filter: blur(12px) brightness(0.4); z-index: 0;
              }
              
              .card {
                  z-index: 1; width: 940px; height: 540px;
                  background: rgba(18, 25, 46, 0.92);
                  border: 5px solid #3c6efd; border-radius: 30px;
                  display: flex; flex-direction: column;
                  box-shadow: 0 0 40px rgba(0,0,0,0.8); overflow: hidden;
              }
              
              .header {
                  background: linear-gradient(180deg, #FFD700 0%, #FF8C00 100%);
                  padding: 15px; text-align: center;
                  border-bottom: 5px solid #000;
              }
              
              .header h1 {
                  font-size: 46px; color: #fff;
                  -webkit-text-stroke: 2px #000;
                  text-shadow: 3px 3px 0 #000;
                  text-transform: uppercase; letter-spacing: 2px;
              }
              
              .content { display: flex; flex: 1; padding: 25px; gap: 20px; }
              
              .left-panel {
                  width: 32%; background: rgba(0,0,0,0.35);
                  border-radius: 20px; padding: 20px;
                  display: flex; flex-direction: column; align-items: center;
                  border: 2px solid rgba(255,255,255,0.1);
              }
              
              .player-icon {
                  width: 150px; height: 150px;
                  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
                  border: 5px solid #fff; border-radius: 25px;
                  display: flex; align-items: center; justify-content: center;
                  font-size: 80px; margin-bottom: 20px;
                  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
              }
              
              .player-name {
                  font-size: 36px; color: #FFD700; text-align: center;
                  -webkit-text-stroke: 1.5px #000; text-shadow: 2px 2px 0 #000;
                  margin-bottom: 5px;
              }
              
              .player-tag {
                  font-size: 18px; color: #aab; background: rgba(0,0,0,0.6);
                  padding: 5px 15px; border-radius: 10px; margin-bottom: 25px;
              }
              
              .club-badge {
                  width: 100%; background: linear-gradient(180deg, #ff3366, #cc0033);
                  color: #fff; text-align: center; padding: 12px;
                  border: 3px solid #fff; border-radius: 15px;
                  font-size: 18px; box-shadow: 0 5px 15px rgba(0,0,0,0.4);
              }
              
              .right-panel { width: 68%; display: flex; flex-direction: column; gap: 15px; }
              
              .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              
              .stat-box {
                  background: rgba(255,255,255,0.05); border: 2.5px solid rgba(255,255,255,0.1);
                  border-radius: 18px; padding: 12px 20px;
                  display: flex; align-items: center; justify-content: space-between;
              }
              
              .stat-info { text-align: right; }
              .stat-title { font-size: 14px; color: #8899aa; text-transform: uppercase; }
              .stat-value { 
                  font-size: 32px; color: #fff; 
                  -webkit-text-stroke: 1px #000; text-shadow: 2px 2px 0 #000;
              }
              
              .victories-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
              
              .v-box { padding: 15px 10px; border-radius: 18px; text-align: center; border: 3px solid rgba(0,0,0,0.3); }
              .v-3v3 { background: #3c6efd; }
              .v-solo { background: #2ecc71; }
              .v-duo { background: #f39c12; }
              
              .v-label { font-size: 11px; color: rgba(255,255,255,0.9); margin-bottom: 5px; text-transform: uppercase; }
              .v-val { font-size: 26px; color: #fff; -webkit-text-stroke: 1px #000; text-shadow: 2px 2px 0 #000; }
              
              .bottom-stats { display: flex; gap: 15px; }
              .bottom-box {
                  flex: 1; background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.05);
                  border-radius: 18px; padding: 15px; text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="bg-image"></div>
          <div class="card">
              <div class="header"><h1>BRAWL STARS PROFILE</h1></div>
              <div class="content">
                  <div class="left-panel">
                      <div class="player-icon">⭐</div>
                      <div class="player-name">${data.name || 'Unknown'}</div>
                      <div class="player-tag">${data.tag || tag}</div>
                      <div class="bottom-box" style="width: 100%; margin-top: auto; background: rgba(255, 46, 99, 0.2); border: 2px solid #FF2E63;">
    <div class="v-label" style="color: #FF2E63;">CLUB</div>
    <div class="player-name" style="font-size: 24px; color: #fff; margin: 0;">
        ${data.club?.name ? data.club.name : 'NESSUNO'}
    </div>
</div>

                  </div>
                  <div class="right-panel">
                      <div class="stats-grid">
                          <div class="stat-box">
                              <span class="stat-title">🏆 TROFEI</span>
                              <span class="stat-value" style="color: #FFD700;">${(data.trophies || 0).toLocaleString()}</span>
                          </div>
                          <div class="stat-box">
                              <span class="stat-title">⭐ RECORD</span>
                              <span class="stat-value" style="color: #FFD700;">${(data.highestTrophies || 0).toLocaleString()}</span>
                          </div>
                          <div class="stat-box">
                              <span class="stat-title">💥 LIVELLO</span>
                              <span class="stat-value" style="color: #d633ff;">${data.expLevel || 0}</span>
                          </div>
                          <div class="stat-box">
                              <span class="stat-title">🎮 BRAWLERS</span>
                              <span class="stat-value" style="color: #33ccff;">${data.brawlers?.length || 0}</span>
                          </div>
                      </div>
                      <div class="victories-row">
                          <div class="v-box v-3v3">
                              <div class="v-label">3v3 VITTORIE</div>
                              <div class="v-val">${victories3v3.toLocaleString()}</div>
                          </div>
                          <div class="v-box v-solo">
                              <div class="v-label">SOLO VITTORIE</div>
                              <div class="v-val">${victoriesSolo.toLocaleString()}</div>
                          </div>
                          <div class="v-box v-duo">
                              <div class="v-label">DUO VITTORIE</div>
                              <div class="v-val">${victoriesDuo.toLocaleString()}</div>
                          </div>
                      </div>
                      <div class="bottom-stats">
                           <div class="bottom-box">
                              <div class="v-label">PARTITE TOTALI</div>
                              <div class="v-val" style="color: #33ccff; font-size: 30px;">${totalPlayed.toLocaleString()}</div>
                          </div>
                          <div class="bottom-box">
                              <div class="v-label">BRAWLERS USATI</div>
                              <div class="v-val" style="color: #FFD700; font-size: 30px;">${data.brawlers?.filter(b => b.trophies > 0).length || 0}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`

      const imageBuffer = await retryScreenshot(html)

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

      await conn.sendMessage(m.chat, {
        image: imageBuffer,
        caption: msg,
        mentions: [target]
      }, { quoted: m })

    } catch (err) {
      console.error(err)
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
handler.group = true

export default handler