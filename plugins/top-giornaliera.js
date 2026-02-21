//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

function dateKeyRome() {
  const nowRome = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const y = nowRome.getFullYear();
  const m = String(nowRome.getMonth() + 1).padStart(2, '0');
  const d = String(nowRome.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function ensureDailyReset() {
  if (!global.db?.data) return;
  const today = dateKeyRome();

  if (global.db.data.__dailyTopDate !== today) {
    if (!global.db.data.dailyTop) global.db.data.dailyTop = {};
    for (const chatId in global.db.data.dailyTop) {
      global.db.data.dailyTop[chatId].utenti = {};
    }
    global.db.data.__dailyTopDate = today;
  }
}

export function incrementDailyTop(chatId, jid) {
  if (!global.db?.data) return;

  if (!global.db.data.dailyTop) global.db.data.dailyTop = {};
  if (!global.db.data.dailyTop[chatId]) global.db.data.dailyTop[chatId] = { utenti: {} };
  if (!global.db.data.dailyTop[chatId].utenti[jid]) global.db.data.dailyTop[chatId].utenti[jid] = { messaggi: 0 };

  global.db.data.dailyTop[chatId].utenti[jid].messaggi += 1;
}

function getTimeUntilReset() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}𝐡 ${minutes}𝐦`;
}

let handler = async (m, { conn, participants }) => {
  ensureDailyReset();

  const chatId = m.chat;
  const chatData = global.db.data.dailyTop?.[chatId]?.utenti || {};
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  const usersData = participants
    .map(p => {
      const jid = p.jid;
      return { jid, messages: chatData[jid]?.messaggi || 0 };
    })
    .filter(u => u.messages > 0 && u.jid !== botId);

  if (usersData.length === 0) {
    return conn.reply(m.chat, "𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐨𝐠𝐠𝐢 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨!", m);
  }

  const sortedUsers = usersData.sort((a, b) => b.messages - a.messages).slice(0, 10);

  let message = `📊 *𝐓𝐨𝐩 𝐠𝐢𝐨𝐫𝐧𝐚𝐥𝐢𝐞𝐫𝐚 𝐝𝐞𝐠𝐥𝐢 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢* 📊\n\n`;
  let mentions = [];
  let userPosition = null;

  sortedUsers.forEach((user, i) => {
    let medal = "🏅";
    if (i === 0) medal = "🥇";
    else if (i === 1) medal = "🥈";
    else if (i === 2) medal = "🥉";

    message += `${medal} *${i + 1}.* @${user.jid.split('@')[0]} ➠ ${user.messages} 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢\n`;
    mentions.push(user.jid);

    if (user.jid === m.sender) userPosition = i + 1;
  });

  const totalPlayers = participants.length;
  const userMessage = userPosition
    ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
    : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;

  const profileBuffer = fs.readFileSync('./icone/top.png');

  const quotedMessage = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "DailyTop" },
    message: {
      locationMessage: {
        name: "𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩 🏆",
        jpegThumbnail: profileBuffer
      }
    },
    participant: "0@s.whatsapp.net"
  };

  await conn.sendMessage(m.chat, {
    text: message + `\n⏰ 𝐑𝐞𝐬𝐞𝐭 𝐭𝐫𝐚: ${getTimeUntilReset()}\n\n${userMessage}`,
    mentions,
  }, { quoted: quotedMessage });
};

handler.command = ['dailytop'];
handler.group = true;

export default handler;