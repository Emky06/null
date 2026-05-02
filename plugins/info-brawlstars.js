import axios from 'axios';
import fs from 'fs';

const DB_PATH = './storage/file-json/tag-brawlstars.json';

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

let handler = async (m, { conn, command, args }) => {
  let db = loadDB();

  if (command.toLowerCase() === 'setbrawl') {
    if (!args[0]) {
      return await conn.reply(
        m.chat,
        '🎮 Salva il tuo tag con\n`.setbrawl #ILTUOTAG`\nPoi potrai usare `.brawl`',
        m
      );
    }

    let tag = args[0].toUpperCase();
    if (!tag.startsWith('#')) tag = '#' + tag;

    if (!db[m.sender]) db[m.sender] = {};
    db[m.sender].tag = tag;

    saveDB(db);

    return await conn.reply(
      m.chat,
      `✅ Tag salvato: ${tag}\nUsa .brawl per vedere il tuo profilo.`,
      m
    );
  }

  if (command.toLowerCase() === 'brawl') {
    let target = m.sender;

    if (m.quoted && m.quoted.sender) target = m.quoted.sender;
    if (m.mentionedJid && m.mentionedJid[0]) target = m.mentionedJid[0];

    let tag = args[0] || db[target]?.tag;

    if (!tag) {
      return await conn.reply(m.chat, '❗ Nessun tag salvato', m);
    }

    tag = tag.toUpperCase();
    if (!tag.startsWith('#')) tag = '#' + tag;

    try {
      const res = await axios.get(
        `https://api.brawlstars.com/v1/players/${encodeURIComponent(tag)}`,
        {
          headers: {
            Authorization: `Bearer TUO_TOKEN`
          }
        }
      );

      const p = res.data;

      const wins =
        (p['3vs3Victories'] || 0) +
        (p.soloVictories || 0) +
        (p.duoVictories || 0);

      const name = await conn.getName(target);

      const header =
        target === m.sender
          ? '𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐭𝐮𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬:'
          : `𝐄𝐜𝐜𝐨 𝐥𝐞 𝐬𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐡𝐞 𝐝𝐞𝐥 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐁𝐫𝐚𝐰𝐥 𝐒𝐭𝐚𝐫𝐬 𝐝𝐢 @${name}:`;

      const msg = `
${header}

👤 𝐆𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞: *${p.name}*
🏷️ 𝐓𝐚𝐠 𝐩𝐫𝐨𝐟𝐢𝐥𝐨: *${p.tag}*
🏆 𝐓𝐫𝐨𝐟𝐞𝐢 𝐚𝐭𝐭𝐮𝐚𝐥𝐢: *${p.trophies || 0}*
⭐ 𝐑𝐞𝐜𝐨𝐫𝐝 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐭𝐫𝐨𝐟𝐞𝐢: *${p.highestTrophies || 0}*
💥 𝐏𝐮𝐧𝐭𝐢 𝐞𝐬𝐩𝐞𝐫𝐢𝐞𝐧𝐳𝐚: *${p.expLevel || 0}*

🎯 𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐭𝐨𝐭𝐚𝐥𝐢: *${wins}*

🏅 𝐂𝐥𝐮𝐛: ${p.club?.name || '𝐍𝐞𝐬𝐬𝐮𝐧𝐨'}
`.trim();

      return await conn.reply(m.chat, msg, m);
    } catch (e) {
      return await conn.reply(m.chat, '⚠️ Errore API', m);
    }
  }

  if (command.toLowerCase() === 'topbrawl') {
    let ranking = [];

    let groupMetadata = await conn.groupMetadata(m.chat);
    let participants = groupMetadata.participants.map(p => p.id);

    for (let jid of participants) {
      let user = db[jid];
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

        const wins =
          (p['3vs3Victories'] || 0) +
          (p.soloVictories || 0) +
          (p.duoVictories || 0);

        ranking.push({
          jid,
          nome: p.name,
          trofei: p.trophies,
          vittorie: wins
        });

        await new Promise(r => setTimeout(r, 200));
      } catch (e) {}
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
🎮 Vittorie: ${p.vittorie}

`;
    });

    await conn.sendMessage(m.chat, {
      text,
      mentions: ranking.map(p => p.jid)
    });
  }
};

handler.help = ['setbrawl', 'brawl', 'topbrawl'];
handler.tags = ['game'];
handler.command = /^(setbrawl|brawl|topbrawl)$/i;
handler.group = true;

export default handler;