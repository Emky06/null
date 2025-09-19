import fetch from 'node-fetch';
import fs from 'fs';

const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const user = global.db.data.users[mention] || {};

  if (!Array.isArray(user.ex)) user.ex = [];
  if (!Array.isArray(user.figli)) user.figli = [];
  if (!Array.isArray(user.genitori)) user.genitori = []; // <-- AGGIUNTA

  const nomeUtente = await conn.getName(mention);

  const formatList = (arr) => arr.length > 0 ? arr.map(j => '@' + j.split('@')[0]).join('\n') : 'nessuno';
  const figliList = formatList(user.figli);
  const exList = formatList(user.ex);
  const genitoriList = formatList(user.genitori); // <-- AGGIUNTA

  const text = `ೋೋ══ • ══ೋೋ
> 𝐍𝐨𝐦𝐞: ${nomeUtente}
ೋೋ══ • ══ೋೋ
𝐒𝐩𝐨𝐬𝐚𝐭𝐨/𝐚: ${user.sposato ? 'si' : 'no'}
🤵🏻👰🏻𝐂𝐨𝐧𝐢𝐮𝐠𝐞: ${user.coniuge ? '@' + user.coniuge.split('@')[0] : 'nessuno'}
👶🏾𝐅𝐢𝐠𝐥𝐢/𝐚: ${figliList}
👨‍👩‍👧‍👦𝐆𝐞𝐧𝐢𝐭𝐨𝐫𝐢: ${genitoriList}
🤬𝐄𝐱 𝐂𝐨𝐧𝐢𝐮𝐠𝐢: ${exList}
ೋೋ══ • ══ೋೋ`;

  const mentions = [
    ...(user.figli || []),
    ...(user.ex || []),
    ...(user.genitori || []), // <-- AGGIUNTA
    ...(user.coniuge ? [user.coniuge] : [])
  ];

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      mentionedJid: mentions
    }
  }, { quoted: m });
};

handler.command = ['famiglia'];
export default handler;