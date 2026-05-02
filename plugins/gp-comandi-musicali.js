import axios from 'axios'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename); const databasePath = path.join(__dirname, '../lastfm_users.json'); const getDB = () => fs.existsSync(databasePath) ? JSON.parse(fs.readFileSync(databasePath, 'utf-8')) : {};

const LASTFM_API_KEY = 'fa91d71e5ea7dbcda31875481d02596f'; const BROWSERLESS_KEY = '2URLFvIaT2R9pY97626b5125ee35d7a9af4d8e0cd1261901d'; const DEFAULT_COVER = '[https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png](https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png)';

if (!fs.existsSync(path.dirname(databasePath))) fs.mkdirSync(path.dirname(databasePath), { recursive: true });

async function apiCall(method, params) { try { const query = new URLSearchParams({ method, api_key: LASTFM_API_KEY, format: 'json', ...params }); const res = await axios.get(`https://ws.audioscrobbler.com/2.0/?${query}`, { timeout: 10000 }); return res.data; } catch (e) { return { error: e.response?.status || 'Unknown', message: e.message }; } }

async function fetchCover(lastFmImages, query, isArtist = false) { const sizes = ['mega', 'extralarge', 'large', 'medium', 'small']; for (const size of sizes) { const cover = lastFmImages?.find(i => i.size === size)?.['#text']; if (cover && cover.trim() !== '' && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) return cover; } const method = isArtist ? 'artist.getinfo' : 'track.getinfo'; const params = isArtist ? { artist: query } : { track: query.split(' ').slice(1).join(' '), artist: query.split(' ')[0] }; const info = await apiCall(method, params); if (info.error) return DEFAULT_COVER; const images = isArtist ? info.artist?.image : info.track?.album?.image || info.track?.image; if (images) { for (const size of sizes) { const cover = images.find(i => i.size === size)?.['#text']; if (cover && cover.trim() !== '' && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) return cover; } } return DEFAULT_COVER; }

async function retryScreenshot(html, width = 1000, height = 600, retries = 3) { for (let i = 0; i < retries; i++) { try { const response = await axios.post(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, { html, options: { type: 'jpeg', quality: 90 }, viewport: { width, height } }, { responseType: 'arraybuffer', timeout: 15000 }); return Buffer.from(response.data); } catch (e) { if (e.response?.status !== 429) throw e; await new Promise(res => setTimeout(res, 2000 * (i + 1))); } } throw new Error('Screenshot failed'); }

const getHtmlWrapper = (bodyContent, customCss = "") => `
 ${bodyContent}`;

const handler = async (m, { conn, usedPrefix, command, text }) => { let db = getDB(); const user = db[m.sender]; if (!user) return m.reply(`⚠️ Devi registrare il tuo username Last.fm con: *${usedPrefix}setuser <username>*`);

await conn.sendPresenceUpdate('composing', m.chat);

let html = ''; let viewport = { w: 1000, h: 600 }; let caption = '';

try {

switch (command) {

case 'comuni': {

if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply(`❌ Uso: *${usedPrefix}comuni @utente*`);

const user2Jid = m.mentionedJid[0];
const user2 = db[user2Jid];
if (!user2) return m.reply("⚠️ L'utente taggato non ha registrato il suo account Last.fm nel bot.");

const limit = 100;
const top1 = await apiCall('user.gettopartists', { user, limit, period: 'overall' });
const top2 = await apiCall('user.gettopartists', { user: user2, limit, period: 'overall' });

if (top1.error || top2.error) throw new Error("Errore nel recupero delle statistiche.");

const artists1 = top1.topartists?.artist || [];
const artists2 = top2.topartists?.artist || [];

let map1 = {};
for (let a of artists1) { map1[a.name] = parseInt(a.playcount); }

let common = [];
for (let a of artists2) {
if (map1[a.name]) {
common.push({
name: a.name,
p1: map1[a.name],
p2: parseInt(a.playcount),
total: map1[a.name] + parseInt(a.playcount)
});
}
}

if (common.length === 0) return m.reply(`💔 Nessun artista in comune trovato tra ${user} e ${user2} (nella top ${limit}).`);

common.sort((a, b) => b.total - a.total);

let responseText = `🎧 *Artisti in comune tra ${user} e ${user2}*\n\n`;
common.forEach((c, index) => {
responseText += `${index + 1}. *${c.name}*\n${user}: ${c.p1} ascolti\n${user2}: ${c.p2} ascolti\n\n`;
});

return conn.sendMessage(m.chat, { text: responseText.trim() }, { quoted: m });
}

case 'crown': {

const topArt = await apiCall('user.gettopartists', { user, limit: 1, period: 'overall' });
if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Nessun artista trovato nelle tue statistiche.");

const topArtistName = topArt.topartists.artist[0].name;
const playcount = parseInt(topArt.topartists.artist[0].playcount) || 0;

const artistInfo = await apiCall('artist.getinfo', { artist: topArtistName, username: user });
if (artistInfo.error) throw new Error("Errore nel recupero dettagli artista.");

const artistData = artistInfo.artist;
const isGold = playcount >= 1000;

const cover = await fetchCover(artistData.image, artistData.name, true);

html = getHtmlWrapper(`
<div class="background-blur" style="background-image: url('${cover}')"></div>
<div class="color-overlay"></div>
<div class="card glass ${isGold ? 'gold' : 'silver'}">
<img src="${cover}" class="cover">
<div class="info">
<h1 style="margin:0; font-size: 55px; text-shadow: 0 4px 15px rgba(0,0,0,0.8);">${artistData.name}</h1>
<p style="color: ${isGold ? '#ffd700' : '#e0e0e0'}; font-size: 26px; font-weight: 800; margin-top:10px; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">CERTIFICATO ${isGold ? 'ORO' : 'FAN'}</p>
<p style="font-size: 22px; margin-top: auto; color: rgba(255,255,255,0.9);">Ascolti totali: <span style="font-size:40px; font-weight:800; color:#fff;">${playcount}</span></p>
<p style="font-size: 16px; opacity: 0.7; font-weight: 600;">Intestato a: @${user}</p>
</div>
</div>
`, ``);

caption = `🏆 *Il tuo Certificato d'Ossessione*\nUtente: ${user}\nArtista principale: ${artistData.name}`;
break;
}

case 'aura': {

const topArt = await apiCall('user.gettopartists', { user, limit: 10, period: '1month' });
if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Errore recupero artisti.");

const colors = ['#8A2BE2', '#FF4500', '#1E90FF', '#FF1493', '#00FA9A'];

let tagsStr = `<div style="z-index: 10; text-align: center;">
<h2 style="font-size: 24px; opacity:0.9; letter-spacing: 5px; text-transform: uppercase;">La tua Aura Musicale</h2>
<h1 style="font-size: 60px; margin: 10px 0;">Eclettica & Vibrante</h1>
<p style="font-size: 20px; opacity:0.8;">@${user}</p>
</div>`;

html = getHtmlWrapper(`
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
${tagsStr}
`, ``);

caption = `✨ *La tua Music Aura mensile*\n@${user}`;
break;
}

case 'vs': {

if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply(`❌ Uso: *${usedPrefix}vs @utente <artista>*`);

const user2Jid = m.mentionedJid[0];
const user2 = db[user2Jid];
if (!user2) return m.reply("⚠️ L'utente taggato non ha registrato il suo account Last.fm nel bot.");

const artistName = text.replace(/@\d+/g, '').trim();
if (!artistName) return m.reply(`❌ Devi specificare un artista!`);

const info1 = await apiCall('artist.getinfo', { artist: artistName, username: user });
const info2 = await apiCall('artist.getinfo', { artist: artistName, username: user2 });

if (info1.error || info2.error) throw new Error("Errore API.");

const score1 = parseInt(info1.artist?.stats?.userplaycount) || 0;
const score2 = parseInt(info2.artist?.stats?.userplaycount) || 0;

const total = score1 + score2 || 1;
const w1 = (score1 / total) * 100;
const w2 = (score2 / total) * 100;

const cover = await fetchCover(info1.artist?.image, info1.artist?.name, true);

html = getHtmlWrapper(``, ``);

caption = `⚔️ *ARTIST BATTLE*\n${user} [${score1}] VS ${user2} [${score2}]\nArtista: ${info1.artist.name}`;
break;
}

case 'mosaic': {

viewport = { w: 900, h: 900 };

const albums = await apiCall('user.gettopalbums', { user, limit: 9, period: '1month' });
if (albums.error) throw new Error("Errore recupero album.");

const top9 = albums.topalbums.album.slice(0, 9);

let gridHtml = '';
let listText = `🧩 *Music Mosaic (Top 9 del Mese)*\nUtente: @${user}\n\n`;

for (let i = 0; i < top9.length; i++) {
const al = top9[i];
const cover = await fetchCover(al.image, `${al.artist.name} ${al.name}`);
gridHtml += `<div class="album" style="background-image: url('${cover}')"></div>`;
listText += `${i + 1}. ${al.artist.name} - ${al.name}\n`;
}

html = getHtmlWrapper(`
<div class="mesh-bg"></div>
<div class="grid">${gridHtml}</div>
`, ``);

caption = listText.trim();
break;
}

case 'goal': {

const info = await apiCall('user.getinfo', { user });
if (info.error) throw new Error("Errore user info.");

const total = parseInt(info.user.playcount);
const milestone = Math.ceil((total + 1) / 10000) * 10000;
const remaining = milestone - total;
const percentage = ((total % 10000) / 10000) * 100;

html = getHtmlWrapper(``, ``);

caption = `📅 *Traguardo in avvicinamento per @${user}*`;
break;
}

case 'whosplaying': {

if (!m.isGroup) return m.reply("❌ Questo comando funziona solo nei gruppi.");

let groupMetadata;
try {
groupMetadata = await conn.groupMetadata(m.chat);
} catch (e) {
return m.reply("❌ Impossibile recuperare i membri del gruppo.");
}

const groupMembers = groupMetadata.participants.map(p => p.id);

let playingUsers = [];

for (let u of groupMembers) {

const lfUser = db[u];
if (!lfUser) continue;

try {
const rt = await apiCall('user.getrecenttracks', { user: lfUser, limit: 1 });
const track = rt.recenttracks?.track?.[0];

if (track && track['@attr']?.nowplaying) {
playingUsers.push({
wpId: u,
lfId: lfUser,
track: track.name,
artist: track.artist['#text'],
cover: track.image?.[2]?.['#text'] || DEFAULT_COVER
});
}
} catch (e) {
continue;
}
}

if (playingUsers.length === 0) return m.reply("📻 Nessuno sta ascoltando musica in questo momento.");

let cardsHtml = playingUsers.map(pu => `
<div class="user-card glass">
<img src="${pu.cover || DEFAULT_COVER}">
<div class="meta">
<div class="user-name">@${pu.lfId}</div>
<div class="track-name">${pu.track}</div>
<div class="artist-name">${pu.artist}</div>
</div>
<div class="live-dot"></div>
</div>
`).join('');

html = getHtmlWrapper(`
<div class="mesh-bg"></div>
<div class="container">
<h1 style="text-align:center; font-size: 45px; margin-bottom: 40px;">📻 In Onda Ora</h1>
<div class="grid">${cardsHtml}</div>
</div>
`, ``);

caption = `📻 *In Onda nel Gruppo*\nUtenti attivi: ${playingUsers.length}`;
break;
}

default:
return m.reply("Comando non riconosciuto nel visual hub.");
}

const buffer = await retryScreenshot(html, viewport.w, viewport.h);
await conn.sendMessage(m.chat, { image: buffer, caption: caption, footer: '𝐯𝐚𝐫𝐞 ✧ 𝐛𝐨𝐭' }, { quoted: m });

} catch (e) {
m.reply(`❌ Si è verificato un errore: ${e.message}`);
} finally {
await conn.sendPresenceUpdate('paused', m.chat);
}
};

handler.help = ['crown', 'aura', 'vs', 'mosaic', 'goal', 'whosplaying', 'comuni'];
handler.command = ['crown', 'aura', 'vs', 'mosaic', 'goal', 'whosplaying', 'comuni'];
handler.group = true;

export default handler;