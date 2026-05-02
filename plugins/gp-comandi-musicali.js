import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databasePath = path.join(__dirname, '../lastfm_users.json');
const getDB = () => fs.existsSync(databasePath) ? JSON.parse(fs.readFileSync(databasePath, 'utf-8')) : {};

const LASTFM_API_KEY = 'fa91d71e5ea7dbcda31875481d02596f';
const BROWSERLESS_KEY = '2URLFvIaT2R9pY97626b5125ee35d7a9af4d8e0cd1261901d';
const DEFAULT_COVER = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';

if (!fs.existsSync(path.dirname(databasePath))) fs.mkdirSync(path.dirname(databasePath), { recursive: true });

async function apiCall(method, params) {
    try {
        const query = new URLSearchParams({ method, api_key: LASTFM_API_KEY, format: 'json', ...params });
        const res = await axios.get(`https://ws.audioscrobbler.com/2.0/?${query}`, { timeout: 10000 });
        return res.data;
    } catch (e) {
        return { error: e.response?.status || 'Unknown', message: e.message };
    }
}

async function fetchCover(lastFmImages, query, isArtist = false) {
    const sizes = ['mega', 'extralarge', 'large', 'medium', 'small'];
    for (const size of sizes) {
        const cover = lastFmImages?.find(i => i.size === size)?.['#text'];
        if (cover && cover.trim() !== '' && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) return cover;
    }
    const method = isArtist ? 'artist.getinfo' : 'track.getinfo';
    const params = isArtist ? { artist: query } : { track: query.split(' ').slice(1).join(' '), artist: query.split(' ')[0] };
    const info = await apiCall(method, params);
    if (info.error) return DEFAULT_COVER;
    const images = isArtist ? info.artist?.image : info.track?.album?.image || info.track?.image;
    if (images) {
        for (const size of sizes) {
            const cover = images.find(i => i.size === size)?.['#text'];
            if (cover && cover.trim() !== '' && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) return cover;
        }
    }
    return DEFAULT_COVER;
}

async function retryScreenshot(html, width = 1000, height = 600, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, {
                html, options: { type: 'jpeg', quality: 90 }, viewport: { width, height }
            }, { responseType: 'arraybuffer', timeout: 15000 });
            return Buffer.from(response.data);
        } catch (e) {
            if (e.response?.status !== 429) throw e;
            await new Promise(res => setTimeout(res, 2000 * (i + 1)));
        }
    }
    throw new Error('Screenshot failed');
}

const getHtmlWrapper = (bodyContent, customCss = "") => `
<html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
    body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #050505; color: #fff; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.1); }
    ${customCss}
</style></head><body>${bodyContent}</body></html>`;

const handler = async (m, { conn, usedPrefix, command, text }) => {
    let db = getDB();
    const user = db[m.sender];
    if (!user) return m.reply(`⚠️ Devi registrare il tuo username Last.fm con: *${usedPrefix}setuser <username>*`);

    await conn.sendPresenceUpdate('composing', m.chat);
    let html = '';
    let viewport = { w: 1000, h: 600 };
    let caption = '';

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
                for (let a of artists1) {
                    map1[a.name] = parseInt(a.playcount);
                }

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
                `, `
                    .background-blur { position: absolute; top: -50px; left: -50px; right: -50px; bottom: -50px; background-size: cover; background-position: center; filter: blur(35px) brightness(0.4); z-index: -2; }
                    .color-overlay { position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%); z-index: -1; }
                    .card { width: 850px; height: 450px; border-radius: 35px; display: flex; padding: 40px; box-sizing: border-box; gap: 40px; position: relative; overflow: hidden; background: rgba(20, 20, 20, 0.4); backdrop-filter: blur(40px); }
                    .gold { box-shadow: 0 30px 80px rgba(255, 215, 0, 0.3), inset 0 0 40px rgba(255, 215, 0, 0.1); border: 2px solid rgba(255,215,0,0.6); }
                    .silver { box-shadow: 0 30px 80px rgba(255, 255, 255, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.05); border: 2px solid rgba(255,255,255,0.3); }
                    .cover { width: 370px; height: 370px; border-radius: 20px; object-fit: cover; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
                    .info { display: flex; flex-direction: column; flex: 1; }
                `);
                caption = `🏆 *Il tuo Certificato d'Ossessione*\nUtente: ${user}\nArtista principale: ${artistData.name}`;
                break;
            }

            case 'aura': {
                const topArt = await apiCall('user.gettopartists', { user, limit: 10, period: '1month' });
                if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Errore recupero artisti.");

                const colors = ['#8A2BE2', '#FF4500', '#1E90FF', '#FF1493', '#00FA9A'];
                let tagsStr = `<div style="z-index: 10; text-align: center;">
                    <h2 style="font-size: 24px; opacity:0.9; letter-spacing: 5px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">La tua Aura Musicale</h2>
                    <h1 style="font-size: 60px; font-family: 'Playfair Display', serif; margin: 10px 0; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">Eclettica & Vibrante</h1>
                    <p style="font-size: 20px; opacity:0.8; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">@${user}</p>
                </div>`;

                html = getHtmlWrapper(`
                    <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
                    ${tagsStr}
                `, `
                    body { background: #020202; }
                    .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.8; mix-blend-mode: screen; z-index: 1; }
                    .b1 { width: 600px; height: 600px; background: ${colors[0]}; top: -100px; left: -100px; }
                    .b2 { width: 500px; height: 500px; background: ${colors[1]}; bottom: -50px; right: 50px; }
                    .b3 { width: 400px; height: 400px; background: ${colors[2]}; top: 50%; left: 50%; transform: translate(-50%, -50%); }
                `);
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

                const score1 = parseInt(info1.artist?.stats?.userplaycount) || 0;
                const score2 = parseInt(info2.artist?.stats?.userplaycount) || 0;

                const total = score1 + score2 || 1;
                const w1 = (score1 / total) * 100;
                const w2 = (score2 / total) * 100;

                const cover = await fetchCover(info1.artist?.image, info1.artist?.name, true);

                html = getHtmlWrapper(`
                    <div class="battle-title">${info1.artist.name}</div>
                    <div class="side left" style="width:${w1}%"></div>
                    <div class="side right" style="width:${w2}%"></div>
                    <div class="vs-badge">VS</div>
                `, `
                    body { background:#000; }
                `);

                caption = `⚔️ ${user} VS ${user2}`;
                break;
            }

            case 'mosaic': {
                viewport = { w: 900, h: 900 };
                const albums = await apiCall('user.gettopalbums', { user, limit: 9, period: '1month' });
                const top9 = albums.topalbums.album.slice(0, 9);

                let gridHtml = '';
                for (let al of top9) {
                    const cover = await fetchCover(al.image, `${al.artist.name} ${al.name}`);
                    gridHtml += `<div style="background-image:url('${cover}')"></div>`;
                }

                html = getHtmlWrapper(`<div>${gridHtml}</div>`, ``);
                caption = `🎧 Mosaic`;
                break;
            }

            case 'goal': {
                const info = await apiCall('user.getinfo', { user });
                const total = parseInt(info.user.playcount);

                html = getHtmlWrapper(`<div>${total}</div>`, ``);
                caption = `Goal`;
                break;
            }

            case 'whosplaying': {
                const groupMetadata = await conn.groupMetadata(m.chat);
const groupUsers = groupMetadata.participants.map(p => p.id);

let playingUsers = [];

for (let u of groupUsers) {
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

}
}
                    try {
                        const rt = await apiCall('user.getrecenttracks', { user: lfUser, limit: 1 });
                        const track = rt.recenttracks?.track?.[0];
                        if (track && track['@attr']?.nowplaying) {
                            playingUsers.push({ wpId: u, lfId: lfUser, track: track.name, artist: track.artist['#text'], cover: track.image[2]['#text'] });
                        }
                    } catch (e) {
    
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

                html = getHtmlWrapper(`<div>${cardsHtml}</div>`, ``);
                caption = `Radio`;
                break;
            }

            default:
                return m.reply("Comando non riconosciuto.");
        }

        const buffer = await retryScreenshot(html, viewport.w, viewport.h);
        await conn.sendMessage(m.chat, { image: buffer, caption }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ Errore: ${e.message}`);
    }
};

handler.help = ['crown','aura','vs','mosaic','goal','whosplaying','comuni'];
handler.command = ['crown','aura','vs','mosaic','goal','whosplaying','comuni'];
handler.group = true;

export default handler;