//Plugin fatto da Axtral_WiZaRd
import { animaliShop, animaliDisponibili } from './animali.js';

const msToTime = (ms) => {
  if (ms <= 0) return '𝐎𝐑𝐀!';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}min ${s}s`;
};

const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;

  if (!users[who]) users[who] = { animali: [], cibo: 0, money: 0, bank: 0 };

  const user = users[who];

  if (!user.animali) user.animali = [];
  if (typeof user.cibo !== 'number') user.cibo = 0;

  const animaliAttivi = user.animali.filter(a => animaliDisponibili.includes(a.nome));
  const rimossi = user.animali.length - animaliAttivi.length;
  user.animali = animaliAttivi;
  global.db.write();

  let text = '*🐾 𝐈 𝐓𝐔𝐎𝐈 𝐀𝐍𝐈𝐌𝐀𝐋𝐈 🐾*\n\n';
  const now = Date.now();

  if (animaliAttivi.length === 0) {
    text += '_𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢._\n';
  } else {
    animaliAttivi.forEach((a, i) => {
      const tempo = a.prossimaPoppata - now;
      const [emoji] = a.nome.split(' ');
      const nomePersonalizzato = a.nomeUtente || a.nome.split(' ').slice(1).join(' ');
      text += `${i + 1}. ${emoji} *${nomePersonalizzato}* – 𝐝𝐚 𝐧𝐮𝐭𝐫𝐢𝐫𝐞 𝐭𝐫𝐚: *${msToTime(tempo)}*\n`;
    });
  }

  text += `\n🥫 *𝐂𝐢𝐛𝐨 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞:* ${user.cibo ?? 0}`;
  if (rimossi > 0) text += `\n⚠️ ${rimossi} 𝐚𝐧𝐢𝐦𝐚𝐥𝐞/𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢 𝐝𝐚𝐥𝐥𝐨 𝐬𝐡𝐨𝐩 (𝐧𝐨𝐧 𝐩𝐢𝐮̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢)`;

  const buttons = [
    { buttonId: '.daicibo', buttonText: { displayText: '𝐃𝐚𝐢 𝐝𝐚 𝐦𝐚𝐧𝐠𝐢𝐚𝐫𝐞 🥫' } },
    { buttonId: '.helpnomina', buttonText: { displayText: '𝐂𝐨𝐦𝐞 𝐫𝐢𝐧𝐨𝐦𝐢𝐧𝐚𝐫𝐞 ✏️' } },
    { buttonId: '.petshop', buttonText: { displayText: '𝐏𝐞𝐭 𝐒𝐡𝐨𝐩 🐾' } },
    { buttonId: '.abbandonanimali', buttonText: { displayText: '⚠️ 𝐀𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 ⚠️' } },
  ];

  await conn.sendMessage(
    m.chat,
    { text: text.trim(), buttons, headerType: 1 },
    { quoted: m }
  );
};

handler.command = /^pet$/i;
handler.group = true

export default handler;


setInterval(async () => {
  const users = global.db.data.users;
  const now = Date.now();

  for (const userId in users) {
    const user = users[userId];
    if (!user.animali) continue;

    for (const animale of user.animali) {
     
      if (typeof animale.lastReminder !== 'boolean') animale.lastReminder = false;

      const tempoRimanente = animale.prossimaPoppata - now;
     
      if (tempoRimanente <= 0 && animale.lastReminder === false) {
        animale.lastReminder = true; 

        const [emoji] = animale.nome.split(' ');
        const nomePersonalizzato = animale.nomeUtente || animale.nome.split(' ').slice(1).join(' ');

        if (animale.chatId) {
          await conn.sendMessage(animale.chatId, {
            text: `⚠️ 𝐇𝐞𝐲 @${userId.split('@')[0]}, 𝐞̀ 𝐨𝐫𝐚 𝐝𝐢 𝐝𝐚𝐫𝐞 𝐝𝐚 𝐦𝐚𝐧𝐠𝐢𝐚𝐫𝐞 𝐚 *${nomePersonalizzato}* ${emoji}!`,
            mentions: [userId],
          });
        }
      }
    }
  }

  global.db.write();
}, 60000);