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
      return await conn.reply(m.chat, '🎮 Salva il tuo tag con\n`.setbrawl #ILTUOTAG`', m)
    }
    let tag = args[0].toUpperCase()
    if (!tag.startsWith('#')) tag = '#' + tag
    if (!db[m.sender]) db[m.sender] = {}
    db[m.sender].tag = tag
    saveDB(db)
    return await conn.reply(m.chat, `✅ Tag salvato: ${tag}`, m)
  }

  if (command === 'brawl') {
    let target = m.sender
    if (Array.isArray(m.mentionedJid) && m.mentionedJid.length > 0) {
      target = m.mentionedJid[0]
    } else if (m.quoted?.sender) {
      target = m.quoted.sender
    }

    let tag = args[0] || db[target]?.tag
    if (!tag || typeof tag !== 'string' || !tag.includes('#')) {
      return await conn.reply(m.chat, '❗ Nessun tag salvato. Usa .setbrawl #TAG', m)
    }

    tag = tag.toUpperCase().replace(/[^A-Z0-9#]/g, '')
    const encodedTag = encodeURIComponent(tag)

    try {
      const res = await fetch(`${API_BASE}/players/${encodedTag}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${API_TOKEN}` }
      })

      if (!res.ok) return await conn.reply(m.chat, '❌ Errore API: Tag non trovato.', m)

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
                  background-color: #0d1323; overflow: hidden;
                  position: relative;
              }
              
              .bg-blur {
                  position: absolute; top: -10%; left: -10%; width: 120%; height: 120%;
                  background: url('https://wallpapercave.com/wp/wp4263657.jpg') center/cover;
                  filter: blur(15px) brightness(0.4); z-index: 0;
              }
              
              .card {
                  z-index: 1; width: 940px; height: 540px;
                  background: rgba(18, 25, 46, 0.94);
                  border: 5px solid #3c6efd; border-radius: 30px;
                  display: flex; flex-direction: column;
                  box-shadow: 0 0 50px rgba(0,0,0,0.9);
                  overflow: hidden;
              }
              
              .header {
                  background: linear-gradient(180deg, #FFD700 0%, #FF8C00 100%);
                  padding: 15px; text-align: center;
                  border-bottom: 5px solid #000;
              }
              
              .header h1 {
                  font-size: 48px; color: #fff;
                  -webkit-text-stroke: 2px #000;
                  text-shadow: 3px 3px 0 #000;
                  letter-spacing: 3px;
              }
              
              .main-content { display: flex; flex: 1; padding: 25px; gap: 20px; }
              
              .left-panel {
                  width: 32%; background: rgba(0,0,0,0.4);
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
                  font-size: 38px; color: #FFD700; text-align: center;
                  -webkit-text-stroke: 1.5px #000; text-shadow: 3px 3px 0 #000;
                  margin-bottom: 5px;
              }
              
              .player-tag {
                  font-size: 18px; color: #aab; background: rgba(0,0,0,0.6);
                  padding: 5px 15px; border-radius: 10px; margin-bottom: 25px;
              }
              
              .club-box {
                  width: 100%; background: #FF2E63; color: #fff;
                  padding: 12px; border-radius: 15px; text-align: center;
                  font-size: 20px; border: 3px solid #fff;
                  box-shadow: 0 5px 15px rgba(255,46,99,0.3);
              }
              
              .right-panel { width: 68%; display: flex; flex-direction: column; gap: 15px; }
              
              .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              
              .stat-card {
                  background: rgba(255,255,255,0.05); border: 3px solid rgba(255,255,255,0.1);
                  border-radius: 18px; padding: 12px 20px;
                  display: flex; align-items: center; justify-content: space-between;
              }
              
              .stat-label { font-size: 14px; color: #8899aa; text-transform: uppercase; }
              .stat-value { 
                  font-size: 34px; color: #fff; 
                  -webkit-text-stroke: 1px #000; text-shadow: 2px 2px 0 #000;
              }
              
              .victory-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
              
              .v-card {
                  padding: 15px 10px; border-radius: 18px; text-align: center;
                  border: 3px solid rgba(0,0,0,0.4);
              }
              
              .v-3v3 { background: #3c6efd; }
              .v-solo { background: #2ecc71; }
              .v-duo { background: #f39c12; }
              
              .v-label { font-size: 11px; color: rgba(255,255,255,0.8); margin-bottom: 5px; }
              .v-val { font-size: 28px; color: #fff; -webkit-text-stroke: 1px #000; text-shadow: 2px 2px 0 #000; }
              
              .bottom-row { display: flex; gap: 15px; }
              
              .bottom-card {
                  flex: 1; background: rgba(0,0,0,0.3); padding: 15px;
                  border-radius: 18px; text-align: center; border: 2px solid rgba(255,255,255,0.05);
              }
          </style>
      </head>
      <body>
          <div class="bg-blur"></div>
          <div class="card">
              <div class="header"><h1>BRAWL STARS PROFILE</h1></div>
              <div class="main-content">
                  <div class="left-panel">
                      <div class="player-icon">⭐</div>
                      <div class="player-name">${data.name}</div>
                      <div class="player-tag">${data.tag}</div>
                      <div class="club-box">${data.club?.name ? '🛡️ ' + data.club.name : 'NO CLUB'}</div>
                  </div>
                  <div class="right-panel">
                      <div class="stats-grid">
                          <div class="stat-card">
                              <span class="stat-label">🏆 Trofei</span>
                              <span class="stat-value" style="color: #FFD700;">${data.trophies.toLocaleString()}</span>
                          </div>
                          <div class="stat-card">
                              <span class="stat-label">⭐ Record</span>
                              <span class="stat-value" style="color: #FFD700;">${data.highestTrophies.toLocaleString()}</span>
                          </div>
                          <div class="stat-card">
                              <span class="stat-label">💥 Livello</span>
                              <span class="stat-value" style="color: #CD7F32;">${data.expLevel}</span>
                          </div>
                          <div class="stat-card">
                              <span class="stat-label">🎮 Brawlers</span>
                              <span class="stat-value" style="color: #3c6efd;">${data.brawlers?.length || 0}</span>
                          </div>
                      </div>
                      <div class="victory-row">
                          <div class="v-card v-3v3">
                              <div class="v-label">3V3 VITTORIE</div>
                              <div class="v-val">${victories3v3.toLocaleString()}</div>
                          </div>
                          <div class="v-card v-solo">
                              <div class="v-label">SOLO VITTORIE</div>
                              <div class="v-val">${victoriesSolo.toLocaleString()}</div>
                          </div>
                          <div class="v-card v-duo">
                              <div class="v-label">DUO VITTORIE</div>
                              <div class="v-val">${victoriesDuo.toLocaleString()}</div>
                          </div>
                      </div>
                      <div class="bottom-row">
                          <div class="bottom-card">
                              <div class="v-label">PARTITE TOTALI</div>
                              <div class="v-val" style="font-size: 32px; color: #fff;">${totalPlayed.toLocaleString()}</div>
                          </div>
                          <div class="bottom-card">
                              <div class="v-label">BRAWLERS SBLOCCATI</div>
                              <div class="v-val" style="font-size: 32px; color: #FFD700;">${data.brawlers?.filter(b => b.trophies > 0).length || 0}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`

      const imageBuffer = await retryScreenshot(html)
      
      const headerText = target === m.sender 
        ? '𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐭𝐮𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬:' 
        : `𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬 𝐝𝐢 @${target.split('@')[0]}:`

      const caption = `${headerText}\n\n👤 *Giocatore:* ${data.name}\n🏆 *Trofei:* ${data.trophies}\n⭐ *Record:* ${data.highestTrophies}\n🎮 *Brawlers:* ${data.brawlers?.length}\n\n🎯 *Vittorie:* 3v3: ${victories3v3} | Solo: ${victoriesSolo} | Duo: ${victoriesDuo}`

      await conn.sendMessage(m.chat, { image: imageBuffer, caption, mentions: [target] }, { quoted: m })

    } catch (err) {
      console.error(err)
      await conn.reply(m.chat, '⚠️ Errore durante il recupero dei dati o la generazione dell\'immagine.', m)
    }
  }
}

handler.help = ['setbrawl <tag>', 'brawl [tag]']
handler.tags = ['info']
handler.command = /^(setbrawl|brawl)$/i
handler.group = true

export default handler