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
              
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');
              
              body {
                  width: 1000px;
                  height: 600px;
                  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                  font-family: 'Poppins', sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  overflow: hidden;
              }
              
              .bg-pattern {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  background-image: url('https://cdn2.unrealengine.com/Dynamic%2Fblog%2Fbrawl-stars-hay-day-pop-up%2Fbs_mobile_blog_thumb-1920x1080-6ce4fcc3122c.jpg');
                  background-size: cover;
                  background-position: center;
                  opacity: 0.15;
                  filter: blur(5px);
              }
              
              .card {
                  position: relative;
                  width: 920px;
                  height: 520px;
                  background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(30,30,50,0.9) 100%);
                  border-radius: 40px;
                  backdrop-filter: blur(10px);
                  border: 2px solid rgba(255,215,0,0.3);
                  box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
                  overflow: hidden;
              }
              
              .header {
                  background: linear-gradient(90deg, #ffd700, #ff8c00);
                  padding: 20px 30px;
                  text-align: center;
              }
              
              .header h1 {
                  font-size: 28px;
                  font-weight: 900;
                  color: #1a1a2e;
                  text-transform: uppercase;
                  letter-spacing: 2px;
              }
              
              .content {
                  padding: 30px;
                  display: flex;
                  gap: 30px;
              }
              
              .icon-section {
                  flex: 1;
                  text-align: center;
              }
              
              .player-icon {
                  width: 150px;
                  height: 150px;
                  background: linear-gradient(135deg, #ffd700, #ff8c00);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 15px;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                  border: 3px solid #ffd700;
              }
              
              .player-icon span {
                  font-size: 70px;
              }
              
              .player-name {
                  font-size: 28px;
                  font-weight: 800;
                  color: #ffd700;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                  margin-bottom: 5px;
              }
              
              .player-tag {
                  font-size: 16px;
                  color: #aaa;
                  margin-bottom: 15px;
              }
              
              .club-info {
                  background: rgba(255,215,0,0.15);
                  border-radius: 20px;
                  padding: 10px;
                  margin-top: 15px;
              }
              
              .club-info p {
                  color: #ffd700;
                  font-size: 14px;
                  font-weight: 600;
              }
              
              .stats-section {
                  flex: 2;
              }
              
              .stats-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
                  margin-bottom: 20px;
              }
              
              .stat-card {
                  background: rgba(255,255,255,0.08);
                  border-radius: 20px;
                  padding: 12px 15px;
                  border: 1px solid rgba(255,215,0,0.2);
              }
              
              .stat-label {
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #ffd700;
                  font-weight: 600;
                  margin-bottom: 5px;
              }
              
              .stat-value {
                  font-size: 28px;
                  font-weight: 800;
                  color: white;
                  line-height: 1;
              }
              
              .victories-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 12px;
                  margin-top: 15px;
              }
              
              .victory-card {
                  background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.1));
                  border-radius: 15px;
                  padding: 10px;
                  text-align: center;
                  border: 1px solid rgba(255,215,0,0.3);
              }
              
              .victory-value {
                  font-size: 22px;
                  font-weight: 800;
                  color: #ffd700;
              }
              
              .victory-label {
                  font-size: 10px;
                  color: #ccc;
                  margin-top: 3px;
              }
              
              .brawler-stats {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 15px;
                  padding-top: 15px;
                  border-top: 1px solid rgba(255,215,0,0.2);
              }
              
              .brawler-stat {
                  text-align: center;
                  flex: 1;
              }
              
              .brawler-stat-value {
                  font-size: 24px;
                  font-weight: 800;
                  color: #ffd700;
              }
              
              .brawler-stat-label {
                  font-size: 10px;
                  color: #aaa;
              }
          </style>
      </head>
      <body>
          <div class="bg-pattern"></div>
          <div class="card">
              <div class="header">
                  <h1>⭐ BRAWL STARS PROFILE ⭐</h1>
              </div>
              <div class="content">
                  <div class="icon-section">
                      <div class="player-icon">
                          <span>🎮</span>
                      </div>
                      <div class="player-name">${data.name || 'Unknown'}</div>
                      <div class="player-tag">${data.tag || tag}</div>
                      <div class="club-info">
                          <p>🏆 ${data.club?.name ? 'Club: ' + data.club.name : 'Nessun Club'}</p>
                      </div>
                  </div>
                  <div class="stats-section">
                      <div class="stats-grid">
                          <div class="stat-card">
                              <div class="stat-label">🏆 TROFEI</div>
                              <div class="stat-value">${(data.trophies || 0).toLocaleString()}</div>
                          </div>
                          <div class="stat-card">
                              <div class="stat-label">⭐ RECORD</div>
                              <div class="stat-value">${(data.highestTrophies || 0).toLocaleString()}</div>
                          </div>
                          <div class="stat-card">
                              <div class="stat-label">💥 ESPERIENZA</div>
                              <div class="stat-value">${data.expLevel || 0}</div>
                          </div>
                          <div class="stat-card">
                              <div class="stat-label">🎮 BRAWLERS</div>
                              <div class="stat-value">${data.brawlers?.length || 0}</div>
                          </div>
                      </div>
                      
                      <div class="victories-grid">
                          <div class="victory-card">
                              <div class="victory-value">${victories3v3.toLocaleString()}</div>
                              <div class="victory-label">🎯 3v3</div>
                          </div>
                          <div class="victory-card">
                              <div class="victory-value">${victoriesSolo.toLocaleString()}</div>
                              <div class="victory-label">👤 SOLO</div>
                          </div>
                          <div class="victory-card">
                              <div class="victory-value">${victoriesDuo.toLocaleString()}</div>
                              <div class="victory-label">👥 DUO</div>
                          </div>
                      </div>
                      
                      <div class="brawler-stats">
                          <div class="brawler-stat">
                              <div class="brawler-stat-value">${totalPlayed.toLocaleString()}</div>
                              <div class="brawler-stat-label">🎮 PARTITE TOTALI</div>
                          </div>
                          <div class="brawler-stat">
                              <div class="brawler-stat-value">${data.brawlers?.filter(b => b.trophies > 0).length || 0}</div>
                              <div class="brawler-stat-label">⭐ BRAWLER SBLOCATI</div>
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