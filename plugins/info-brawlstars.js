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
              
              @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@700;800;900&display=swap');
              
              body {
                  width: 1000px;
                  height: 600px;
                  margin: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  overflow: hidden;
                  background-color: #0d1323;
              }
              
              .bg-image {
                  position: absolute;
                  top: -20px; left: -20px; right: -20px; bottom: -20px;
                  background-image: url('https://wallpapercave.com/wp/wp4263657.jpg');
                  background-size: cover;
                  background-position: center;
                  filter: blur(10px) brightness(0.5);
                  z-index: 0;
              }
              
              .card {
                  z-index: 1;
                  width: 900px;
                  height: 520px;
                  background: rgba(20, 28, 48, 0.85);
                  border: 4px solid #4a80ff;
                  border-radius: 20px;
                  box-shadow: 0 15px 35px rgba(0,0,0,0.8), inset 0 0 25px rgba(74, 128, 255, 0.15);
                  display: flex;
                  flex-direction: column;
                  backdrop-filter: blur(8px);
              }
              
              .header {
                  background: linear-gradient(180deg, #ffdf00 0%, #ff8c00 100%);
                  padding: 12px;
                  text-align: center;
                  border-bottom: 4px solid #000;
                  border-top-left-radius: 16px;
                  border-top-right-radius: 16px;
                  box-shadow: inset 0 -4px 0 rgba(255,255,255,0.2);
              }
              
              .header h1 {
                  font-family: 'Lilita One', cursive;
                  font-size: 38px;
                  color: #fff;
                  margin: 0;
                  -webkit-text-stroke: 1.5px #000;
                  text-shadow: 2px 2px 0px #000, 0px 4px 6px rgba(0,0,0,0.5);
                  letter-spacing: 2px;
              }
              
              .content {
                  display: flex;
                  flex: 1;
                  padding: 20px;
                  gap: 20px;
              }
              
              .left-panel {
                  width: 33%;
                  background: rgba(0, 0, 0, 0.35);
                  border-radius: 16px;
                  border: 2px solid rgba(255,255,255,0.08);
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
              }
              
              .player-icon {
                  width: 130px;
                  height: 130px;
                  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
                  border: 4px solid #fff;
                  border-radius: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 70px;
                  box-shadow: 0 8px 15px rgba(0,0,0,0.6);
                  margin-bottom: 20px;
                  filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));
              }
              
              .player-name {
                  font-family: 'Lilita One', cursive;
                  font-size: 34px;
                  color: #ffdf00;
                  text-align: center;
                  -webkit-text-stroke: 1.2px #000;
                  text-shadow: 2px 2px 0px #000;
                  margin-bottom: 6px;
                  line-height: 1.1;
              }
              
              .player-tag {
                  font-family: 'Nunito', sans-serif;
                  font-size: 16px;
                  font-weight: 800;
                  color: #b0c4de;
                  background: rgba(0,0,0,0.6);
                  padding: 4px 14px;
                  border-radius: 12px;
                  margin-bottom: 25px;
                  border: 1px solid rgba(255,255,255,0.1);
              }
              
              .club-badge {
                  font-family: 'Nunito', sans-serif;
                  font-weight: 900;
                  width: 100%;
                  background: linear-gradient(90deg, #ff3366, #cc0033);
                  color: #fff;
                  text-align: center;
                  padding: 12px;
                  border: 2px solid #fff;
                  border-radius: 12px;
                  font-size: 18px;
                  box-shadow: 0 6px 12px rgba(0,0,0,0.4);
                  text-transform: uppercase;
              }
              
              .right-panel {
                  width: 67%;
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
                  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
                  border: 2px solid rgba(255,255,255,0.1);
                  border-radius: 16px;
                  padding: 12px 20px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  box-shadow: inset 0 0 10px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.3);
              }
              
              .stat-icon { 
                  font-size: 38px; 
                  filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.6)); 
              }
              
              .stat-info { text-align: right; }
              
              .stat-title {
                  font-family: 'Nunito', sans-serif;
                  font-size: 13px;
                  font-weight: 900;
                  color: #9ab4d6;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  margin-bottom: 2px;
              }
              
              .stat-value {
                  font-family: 'Lilita One', cursive;
                  font-size: 32px;
                  color: #fff;
                  -webkit-text-stroke: 1px #000;
                  text-shadow: 2px 2px 0px #000;
              }
              
              .val-yellow { color: #ffdf00; }
              .val-purple { color: #d633ff; }
              .val-blue { color: #33ccff; }
              
              .victories-row {
                  display: flex;
                  gap: 15px;
              }
              
              .victory-box {
                  flex: 1;
                  background: linear-gradient(180deg, rgba(30,45,75,0.7), rgba(15,25,45,0.8));
                  border: 2px solid rgba(255,255,255,0.08);
                  border-radius: 16px;
                  padding: 14px 10px;
                  text-align: center;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              }
              
              .victory-title {
                  font-family: 'Nunito', sans-serif;
                  color: #9ab4d6;
                  font-size: 12px;
                  font-weight: 900;
                  margin-bottom: 6px;
                  text-transform: uppercase;
              }
              
              .victory-value {
                  font-family: 'Lilita One', cursive;
                  font-size: 32px;
                  color: #fff;
                  -webkit-text-stroke: 1.2px #000;
                  text-shadow: 2px 2px 0px #000;
              }
              
              .bottom-stats {
                  display: flex;
                  gap: 15px;
              }
              
              .bottom-box {
                  flex: 1;
                  background: rgba(0,0,0,0.3);
                  border: 2px solid rgba(255,255,255,0.08);
                  border-radius: 16px;
                  padding: 12px;
                  text-align: center;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              }
          </style>
      </head>
      <body>
          <div class="bg-image"></div>
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
                          <div class="stat-box">
                              <div class="stat-icon">🏆</div>
                              <div class="stat-info">
                                  <div class="stat-title">TROFEI</div>
                                  <div class="stat-value val-yellow">${(data.trophies || 0).toLocaleString()}</div>
                              </div>
                          </div>
                          <div class="stat-box">
                              <div class="stat-icon">⭐</div>
                              <div class="stat-info">
                                  <div class="stat-title">RECORD</div>
                                  <div class="stat-value val-yellow">${(data.highestTrophies || 0).toLocaleString()}</div>
                              </div>
                          </div>
                          <div class="stat-box">
                              <div class="stat-icon">💥</div>
                              <div class="stat-info">
                                  <div class="stat-title">LIV. ESP.</div>
                                  <div class="stat-value val-purple">${data.expLevel || 0}</div>
                              </div>
                          </div>
                          <div class="stat-box">
                              <div class="stat-icon">🎮</div>
                              <div class="stat-info">
                                  <div class="stat-title">BRAWLERS</div>
                                  <div class="stat-value val-blue">${data.brawlers?.length || 0}</div>
                              </div>
                          </div>
                      </div>
                      
                      <div class="victories-row">
                          <div class="victory-box">
                              <div class="victory-title">3v3 VITTORIE</div>
                              <div class="victory-value val-blue">${victories3v3.toLocaleString()}</div>
                          </div>
                          <div class="victory-box">
                              <div class="victory-title">SOLO VITTORIE</div>
                              <div class="victory-value" style="color: #00e600;">${victoriesSolo.toLocaleString()}</div>
                          </div>
                          <div class="victory-box">
                              <div class="victory-title">DUO VITTORIE</div>
                              <div class="victory-value" style="color: #ffaa00;">${victoriesDuo.toLocaleString()}</div>
                          </div>
                      </div>
                      
                      <div class="bottom-stats">
                           <div class="bottom-box">
                              <div class="stat-title">PARTITE TOTALI</div>
                              <div class="victory-value val-blue">${totalPlayed.toLocaleString()}</div>
                          </div>
                          <div class="bottom-box">
                              <div class="stat-title">BRAWLERS SBLOCCATI</div>
                              <div class="victory-value val-yellow">${data.brawlers?.filter(b => b.trophies > 0).length || 0}</div>
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