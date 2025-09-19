//Plugin fatto da Axtral_WiZaRd
import fetch from 'node-fetch';

const API_BASE = 'https://api.brawlstars.com/v1';
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjA5MTk5MDdhLWQxMTktNGYzMC1iYWFmLTI4NWY2ZjdkZTk0MSIsImlhdCI6MTc1NzM1NDM2Niwic3ViIjoiZGV2ZWxvcGVyLzE1YzBiZTMxLWFmMmEtNDczNi1lZjA3LWVjMGI0MWY5ZDc2MCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiOTUuMjM4LjIxOS4yMiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.RvJcaTGWfHe8LyOD93X99Va64hX50Z2_KzN_rodNvIuPtLzoeUNL-DEisen3t8by44BEA_WDH9DqTr1YkTAKeQ';

let handler = async (m, { conn, command, args }) => {
  if (!global.db) global.db = { data: { users: {}, chats: {} } };
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};


  if (command && command.toLowerCase() === 'setbrawl') {
    if (!args[0]) return await conn.reply(m.chat, '🎮 Salva il tuo tag con\n`.setbrawl #ILTUOTAG`\nPoi potrai usare `.brawl` per vedere le statistiche', m);
    let tag = args[0].toUpperCase();
    if (!tag.startsWith('#')) tag = '#' + tag;
    global.db.data.users[m.sender].brawlStars_ID = tag;
    return await conn.reply(m.chat, `✅ Tag salvato: ${tag}\nUsa .brawl per vedere il tuo profilo.`, m);
  }


  if (command && command.toLowerCase() === 'brawl') {
    let tag = args[0] || global.db.data.users[m.sender].brawlStars_ID;
    if (!tag) return await conn.reply(m.chat, '❗ Nessun tag Brawl Stars salvato. Usa .setbrawl <tag> per salvarlo o .brawl <tag> per cercare uno specifico.', m);

    tag = tag.toUpperCase();
    if (!tag.startsWith('#')) tag = '#' + tag;
    const encodedTag = encodeURIComponent(tag);

    try {
      const res = await fetch(`${API_BASE}/players/${encodedTag}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return await conn.reply(m.chat, `❌ Errore: ${res.status} – ${err.reason || err.message || 'unknown'}`, m);
      }

      const data = await res.json();



      // Vittorie e partite totali 
      const victories3v3 = data['3vs3Victories'] || 0;
      const victoriesSolo = data['soloVictories'] || 0;
      const victoriesDuo = data['duoVictories'] || 0;
      const totalPlayed = victories3v3 + victoriesSolo + victoriesDuo;
      const totalBrawlers = data.brawlers?.length || 0;

      const msg = `
𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐭𝐮𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬:

👤 𝐆𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞: *${data.name}*
🏷️ 𝐓𝐚𝐠 𝐩𝐫𝐨𝐟𝐢𝐥𝐨: *${data.tag}*
🏆 𝐓𝐫𝐨𝐟𝐞𝐢 𝐚𝐭𝐭𝐮𝐚𝐥𝐢: *${data.trophies || 0}*
⭐ 𝐑𝐞𝐜𝐨𝐫𝐝 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐭𝐫𝐨𝐟𝐞𝐢: *${data.highestTrophies || 0}*
💥 𝐏𝐮𝐧𝐭𝐢 𝐞𝐬𝐩𝐞𝐫𝐢𝐞𝐧𝐳𝐚: *${data.expLevel || 0}*
🎯 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝟑𝐯𝟑: *${victories3v3}*
🎯 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐒𝐨𝐥𝐨: *${victoriesSolo}*
🎯 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐃𝐮𝐨: *${victoriesDuo}*
🧩 𝐁𝐫𝐚𝐰𝐥𝐞𝐫𝐬: *${totalBrawlers}*
🧩 𝐏𝐚𝐫𝐭𝐢𝐭𝐞 𝐭𝐨𝐭𝐚𝐥𝐢: *${totalPlayed}*
🏅 𝐂𝐥𝐮𝐛: ${data.club?.name || '𝐍𝐞𝐬𝐬𝐮𝐧𝐨'}
`.trim();

      return await conn.reply(m.chat, msg, m);
    } catch (err) {
      console.error('[info-brawl-stars] errore fetch:', err);
      return await conn.reply(m.chat, '⚠️ Si è verificato un errore durante la richiesta (API o connessione).', m);
    }
  }
};

handler.help = ['setbrawl <tag>', 'brawl [tag]'];
handler.tags = ['info'];
handler.command = /^(setbrawl|brawl)$/i;

export default handler;