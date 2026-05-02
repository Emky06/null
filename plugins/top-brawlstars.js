import axios from 'axios';
import fs from 'fs';

const DB_PATH = './storage/file-json/tag-brawlstars.json';

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH));
}

let handler = async (m, { conn }) => {
  const chatId = m.chat;

  let db = loadDB();
  let ranking = [];

  if (!db[chatId]) db[chatId] = {};
  let groupData = db[chatId];

  let groupMetadata = await conn.groupMetadata(chatId);
  let participants = groupMetadata.participants.map(p => p.id);

  for (let jid of participants) {
    let user = groupData[jid];
    if (!user || !user.tag) continue;

    try {
      const res = await axios.get(
        `https://api.brawlstars.com/v1/players/${encodeURIComponent(user.tag)}`,
        {
          headers: {
            Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY1NWU3ZTk5LWRhZWMtNDVmMC1iYTY5LTBmZTM5NDRkN2EzZCIsImlhdCI6MTc3NzY4MjQ5NCwic3ViIjoiZGV2ZWxvcGVyLzE1YzBiZTMxLWFmMmEtND czNi1lZjA3LWVjMGI0MWY5ZDc2MCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0c yI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsi Y2lkcnMiOlsiOTQuMzMuODQuMTMiXSwidHlwZSI6ImNsaWVudCJ9XX0.f-ibcd-XSJqRFZg-Sm-Md4XS0WMJSfC7SIM4idBT3Z5nb1MYjasaD06lU81UcKpR9bd-Wb7xCQ_9DRC1hn1b3A`
          }
        }
      );

      const p = res.data;

      const totalWins =
        (p['3vs3Victories'] || 0) +
        (p.soloVictories || 0) +
        (p.duoVictories || 0);

      ranking.push({
        jid,
        nome: p.name,
        trofei: p.trophies,
        vittorie: totalWins
      });

      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.log('Errore con:', jid);
    }
  }

  ranking.sort((a, b) => b.vittorie - a.vittorie);

  if (!ranking.length) {
    return m.reply('Nessun utente registrato con tag.');
  }

  let text = `🏆 *TOP BRAWL - VITTORIE TOTALI* 🏆\n\n`;

  ranking.forEach((p, i) => {
    text += `${i + 1}. @${p.jid.split('@')[0]}
👤 ${p.nome}
🏆 Trofei: ${p.trofei}
🎮 Vittorie totali: ${p.vittorie}

`;
  });

  await conn.sendMessage(chatId, {
    text,
    mentions: ranking.map(p => p.jid)
  });
};

handler.help = ['topbrawl'];
handler.tags = ['game'];
handler.command = /^topbrawl$/i;
handler.group = true;

export default handler;