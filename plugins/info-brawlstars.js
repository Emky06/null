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
              * { margin: 0; padding: 0; box-sizing: border-box; }
              
              /* Font Stile Brawl Stars */
              @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
              
              body {
                  width: 1000px;
                  height: 600px;
                  background: radial-gradient(circle, #2fa3ff 0%, #004dc6 100%);
                  font-family: 'Lilita One', cursive;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  overflow: hidden;
              }
              
              .bg-stripes {
                  position: absolute;
                  top: 0; left: 0; right: 0; bottom: 0;
                  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 40px);
                  z-index: 0;
              }
              
              .card {
                  position: relative;
                  width: 900px;
                  height: 520px;
                  background: #f4f6f8;
                  border-radius: 24px;
                  border: 6px solid #000;
                  box-shadow: 10px 10px 0px rgba(0,0,0,0.5);
                  z-index: 1;
                  display: flex;
                  flex-direction: column;
              }
              
              .header {
                  background: #ffcc00;
                  padding: 15px;
                  border-bottom: 6px solid #000;
                  border-top-left-radius: 18px;
                  border-top-right-radius: 18px;
                  text-align: center;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: inset 0 -5px 0 rgba(200, 150, 0, 0.5);
              }
              
              .header h1 {
                  font-size: 40px;
                  color: #fff;
                  -webkit-text-stroke: 2px #000;
                  text-shadow: 3px 3px 0px #000;
                  letter-spacing: 2px;
              }
              
              .content {
                  display: flex;
                  flex: 1;
                  padding: 20px;
                  gap: 20px;
              }
              
              .left-panel {
                  width: 35%;
                  background: #fff;
                  border: 5px solid #000;
                  border-radius: 16px;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  box-shadow: 5px 5px 0px #000, inset 0 -4px 0px #e0e0e0;
              }
              
              .player-icon {
                  width: 140px;
                  height: 140px;
                  background: #33ccff;
                  border: 5px solid #000;
                  border-radius: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 4px 4px 0px #000, inset 0 -6px 0px rgba(0,0,0,0.2);
                  margin-bottom: 15px;
                  font-size: 70px;
              }
              
              .player-name {
                  font-size: 36px;
                  color: #fff;
                  -webkit-text-stroke: 1.5px #000;
                  text-shadow: 3px 3px 0px #000;
                  text-align: center;
                  line-height: 1.1;
                  margin-bottom: 8px;
              }
              
              .player-tag {
                  font-size: 20px;
                  color: #555;
                  background: #ddd;
                  padding: 4px 12px;
                  border-radius: 10px;
                  border: 3px solid #000;
                  margin-bottom: 15px;
                  box-shadow: inset 0 -3px 0px #bbb;
              }
              
              .club-badge {
                  width: 100%;
                  background: #ff3366;
                  color: #fff;
                  text-align: center;
                  padding: 10px;
                  border: 4px solid #000;
                  border-radius: 12px;
                  font-size: 22px;
                  -webkit-text-stroke: 1px #000;
                  text-shadow: 2px 2px 0px #000;
                  box-shadow: 3px 3px 0px #000, inset 0 -3px 0 rgba(0,0,0,0.2);
              }
              
              .right-panel {
                  width: 65%;
                  display: flex;
                  flex-direction: column;
                  gap: 15px;
              }
              
              .stats-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 15px;
              }
              
              .stat-box {
                  background: #fff;
                  border: 4px solid #000;
                  border-radius: 16px;
                  padding: 12px 15px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  box-shadow: 4px 4px 0px #000, inset 0 -4px 0 rgba(0,0,0,0.15);
              }
              
              .stat-icon {
                  font-size: 32px;
              }
              
              .stat-info {
                  text-align: right;
              }
              
              .stat-title {
                  font-size: 14px;
                  color: #000;
                  text-transform: uppercase;
                  margin-bottom: -2px;
              }
              
              .stat-value {
                  font-size: 32px;
                  color: #fff;
                  -webkit-text-stroke: 1.5px #000;
                  text-shadow: 2px 2px 0px #000;
              }
              
              .box-trophies { background: #ffcc00; }
              .box-record { background: #ff9900; }
              .box-exp { background: #cc33ff; }
              .box-brawlers { background: #33ccff; }
              
              .victories-row {
                  display: flex;
                  gap: 15px;
              }
              
              .victory-box {
                  flex: 1;
                  border: 4px solid #000;
                  border-radius: 16px;
                  padding: 10px;
                  text-align: center;
                  box-shadow: 4px 4px 0px #000, inset 0 -4px 0 rgba(0,0,0,0.2);
              }
              
              .victory-title {
                  color: #000;
                  font-size: 16px;
                  margin-bottom: 2px;
              }
              
              .victory-value {
                  font-size: 30px;
                  color: #fff;
                  -webkit-text-stroke: 1.5px #000;
                  text-shadow: 2px 2px 0px #000;
              }
              
              .box-3v3 { background: #ff4d4d; }
              .box-solo { background: #00e600; }
              .box-duo { background: #ffaa00; }
              
              .bottom-stats {
                  display: flex;
                  gap: 15px;
              }
              
              .bottom-box {
                  flex: 1;
                  background: #fff;
                  border: 4px solid #000;
                  border-radius: 16px;
                  padding: 10px 15px;
                  text-align: center;
                  box-shadow: 4px 4px 0px #000, inset 0 -4px 0 #e0e0e0;
              }
              
              .bottom-value {
                  font-size: 32px;
                  -webkit-text-stroke: 1.5px #000;
                  text-shadow: 2px 2px 0px #000;
              }
          </style>
      </head>
      <body>
          <div class="bg-stripes"></div>
          <div class="card">
              <div class="header">
                  <h1>BRAWL STARS PROFILE</h1>
              </div>
              <div class="content">
                  <div class="left-panel">
                      <div class="player-icon">🌟</div>
                      <div class="player-name">${data.name || 'Unknown'}</div>
                      <div class="player-tag">${data.tag || tag}</div>
                      <div class="club-badge">
                          ${data.club?.name ? '🛡️ ' + data.club.name : 'NO CLUB'}
                      </div>
                  </div>
                  
                  <div class="right-panel">
                      <div class="stats-grid">
                          <div class="stat-box box-trophies">
                              <div class="stat-icon">🏆</div>
                              <div class="stat-info">
                                  <div class="stat-title">TROFEI</div>
                                  <div class="stat-value">${(data.trophies || 0).toLocaleString()}</div>
                              </div>
                          </div>
                          <div class="stat-box box-record">
                              <div class="stat-icon">⭐</div>
                              <div class="stat-info">
                                  <div class="stat-title">RECORD</div>
                                  <div class="stat-value">${(data.highestTrophies || 0).toLocaleString()}</div>
                              </div>
                          </div>
                          <div class="stat-box box-exp">
                              <div class="stat-icon">💥</div>
                              <div class="stat-info">
                                  <div class="stat-title">LIV. ESP.</div>
                                  <div class="stat-value">${data.expLevel || 0}</div>
                              </div>
                          </div>
                          <div class="stat-box box-brawlers">
                              <div class="stat-icon">🎮</div>
                              <div class="stat-info">
                                  <div class="stat-title">BRAWLERS</div>
                                  <div class="stat-value">${data.brawlers?.length || 0}</div>
                              </div>
                          </div>
                      </div>
                      
                      <div class="victories-row">
                          <div class="victory-box box-3v3">
                              <div class="victory-title">3v3 VITTORIE</div>
                              <div class="victory-value">${victories3v3.toLocaleString()}</div>
                          </div>
                          <div class="victory-box box-solo">
                              <div class="victory-title">SOLO VITTORIE</div>
                              <div class="victory-value">${victoriesSolo.toLocaleString()}</div>
                          </div>
                          <div class="victory-box box-duo">
                              <div class="victory-title">DUO VITTORIE</div>
                              <div class="victory-value">${victoriesDuo.toLocaleString()}</div>
                          </div>
                      </div>
                      
                      <div class="bottom-stats">
                           <div class="bottom-box">
                              <div class="stat-title">PARTITE TOTALI</div>
                              <div class="bottom-value" style="color: #33ccff;">${totalPlayed.toLocaleString()}</div>
                          </div>
                          <div class="bottom-box">
                              <div class="stat-title">BRAWLERS SBLOCCATI</div>
                              <div class="bottom-value" style="color: #ffcc00;">${data.brawlers?.filter(b => b.trophies > 0).length || 0}</div>
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