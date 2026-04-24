//Plugin fatto da Riad, mod by Axtral
import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  try {
    const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : m.sender);
    const who = mention || m.sender;

    if (!global.db.data.users[who]) global.db.data.users[who] = {};

    const user = global.db.data.users[who];

    const vittorieBandiera = user.vittorieBandiera || 0;
    const vittoriePrefissi = user.vittoriePrefissi || 0;
    const vittorieic = user.vittorieic || 0;
    const vittorieTris = user.vittorieTris || 0;
    const vittorieImpiccato = user.vittorieImpiccato || 0;   

    let nomeUtente = "Utente sconosciuto";
    try {
      nomeUtente = await conn.getName(who);
      if (!nomeUtente) nomeUtente = "Utente sconosciuto";
    } catch {
      nomeUtente = "Utente sconosciuto";
    }

    let pic;
    try {
      pic = await conn.profilePictureUrl(who, 'image');
      pic = await (await fetch(pic)).buffer();
    } catch {
      pic = fs.readFileSync(path.join('./icone/profilo.png'));
    }

    let text = `
𖦹━━━━━━ ☾︎•♦️•☽︎ ━━━━━━𖦹
ↆ   *𝐃𝐀𝐓𝐈 𝐃𝐈* @${who.split('@')[0]}   ↆ

🏁 *𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐛𝐚𝐧𝐝𝐢𝐞𝐫𝐞* ➪ ${vittorieBandiera}
────
📞 *𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐢* ➪ ${vittoriePrefissi}
────
🎵 *𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐜𝐚𝐧𝐳𝐨𝐧𝐢* ➪ ${vittorieic}
────
❎ *𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐬𝐮 𝐭𝐫𝐢𝐬* ➪ ${vittorieTris}
────
🪢 *𝐕𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐢𝐦𝐩𝐢𝐜𝐜𝐚𝐭𝐨* ➪ ${vittorieImpiccato}
𖦹━━━━━━ ☾︎•♦️•☽︎ ━━━━━━𖦹
`.trim();

    await conn.sendMessage(m.chat, {
      text,
      mentions: [who],
      contextInfo: {
        mentionedJid: [who],
        externalAdReply: {
          title: nomeUtente, 
          body: '𝑺𝒕𝒂𝒕𝒊𝒔𝒕𝒊𝒄𝒉𝒆 𝒅𝒆𝒊 𝒈𝒊𝒐𝒄𝒉𝒊 🕹️',
          thumbnail: pic, 
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
  }
};

handler.command = /^(dati)$/i;
export default handler;