
//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'storage', 'file-json', 'databaseTop.json');

function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!data.dailyTop) data.dailyTop = {};
      return data;
    } catch {
      return { dailyTop: {}, __dailyTopDate: null };
    }
  } else {
    return { dailyTop: {}, __dailyTopDate: null };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function dateKeyRome() {
  const nowRome = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const giorni = ['𝐃𝐨𝐦𝐞𝐧𝐢𝐜𝐚','𝐋𝐮𝐧𝐞𝐝𝐢̀','𝐌𝐚𝐫𝐭𝐞𝐝𝐢̀','𝐌𝐞𝐫𝐜𝐨𝐥𝐞𝐝𝐢̀','𝐆𝐢𝐨𝐯𝐞𝐝𝐢̀','𝐕𝐞𝐧𝐞𝐫𝐝𝐢̀','𝐒𝐚𝐛𝐚𝐭𝐨'];
  const mesi = ['𝐆𝐞𝐧𝐧𝐚𝐢𝐨','𝐅𝐞𝐛𝐛𝐫𝐚𝐢𝐨','𝐌𝐚𝐫𝐳𝐨','𝐀𝐩𝐫𝐢𝐥𝐞','𝐌𝐚𝐠𝐠𝐢𝐨','𝐆𝐢𝐮𝐠𝐧𝐨','𝐋𝐮𝐠𝐥𝐢𝐨','𝐀𝐠𝐨𝐬𝐭𝐨','𝐒𝐞𝐭𝐭𝐞𝐦𝐛𝐫𝐞','𝐎𝐭𝐭𝐨𝐛𝐫𝐞','𝐍𝐨𝐯𝐞𝐦𝐛𝐫𝐞','𝐃𝐢𝐜𝐞𝐦𝐛𝐫𝐞'];

  const giornoSettimana = giorni[nowRome.getDay()]; 
  const giornoMese = nowRome.getDate(); 
  const mese = mesi[nowRome.getMonth()]; 
  const anno = nowRome.getFullYear(); 

  const boldMap = {'0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'};
  const boldNumber = n => n.toString().split('').map(d => boldMap[d] || d).join('');

  return `🗓️ ${giornoSettimana} ${boldNumber(giornoMese)} ${mese} ${boldNumber(anno)}`;
}

function ensureDailyReset() {
  const db = loadDB();
  if (!db.dailyTop) db.dailyTop = {};
  const today = dateKeyRome();
  if (db.__dailyTopDate !== today) {
    for (const chatId in db.dailyTop) {
      if (!db.dailyTop[chatId]) db.dailyTop[chatId] = {};
      db.dailyTop[chatId].utenti = {};
    }
    db.__dailyTopDate = today;
    saveDB(db);
  }
  return db;
}

export async function dailyTopMessageCounter(m, { conn }) {
  if (!m?.chat) return;
  if (!m.sender || m.fromMe || (conn?.user && m.sender === conn.user?.jid)) return;

  const db = ensureDailyReset();
  if (!global.processedDailyTopMessages) global.processedDailyTopMessages = new Set();

  const msgId = m?.key?.id;
  if (!msgId) return;

  if (global.processedDailyTopMessages.has(msgId)) return;
  global.processedDailyTopMessages.add(msgId);

  if (!db.dailyTop) db.dailyTop = {};
  if (!db.dailyTop[m.chat]) db.dailyTop[m.chat] = { utenti: {} };

  const chat = db.dailyTop[m.chat];

  if (!chat.utenti) chat.utenti = {};
  if (!chat.utenti[m.sender]) chat.utenti[m.sender] = { messaggi: 0 };

  chat.utenti[m.sender].messaggi++;

  saveDB(db);
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
  const db = ensureDailyReset();
  const chatId = m.chat;
  const chatData = db.dailyTop?.[chatId]?.utenti || {};
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  const today = dateKeyRome(); 
  const dateBox = `
╭━━━━━━━━━━━━━━━━━━━╮
┃  ${today}  ┃
╰━━━━━━━━━━━━━━━━━━━╯
`;

  let message = `📊 *𝐓𝐨𝐩 𝐠𝐢𝐨𝐫𝐧𝐚𝐥𝐢𝐞𝐫𝐚 𝐝𝐞𝐠𝐥𝐢 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢* 📊
${dateBox}\n`;
  let mentions = [];
  let userPosition = null;

  const usersData = participants
    .map(p => {
      const jid = p.jid;
      if (jid === botId) return null;
      if (!chatData[jid]) chatData[jid] = { messaggi: 0 };
      return { jid, messages: chatData[jid].messaggi };
    })
    .filter(Boolean)
    .filter(u => u.messages > 0);

  if (!usersData.length) {
    return conn.reply(m.chat, "𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐨𝐠𝐠𝐢 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨!", m);
  }

  const sortedUsers = usersData.sort((a, b) => b.messages - a.messages).slice(0, 10);

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
    message: { locationMessage: { name: "𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩 🏆", jpegThumbnail: profileBuffer } },
    participant: "0@s.whatsapp.net"
  };

  await conn.sendMessage(m.chat, {
    text: message + `\n⏰ 𝐑𝐞𝐬𝐞𝐭 𝐭𝐫𝐚: ${getTimeUntilReset()}\n\n${userMessage}`,
    mentions,
  }, { quoted: quotedMessage });
};

handler.command = ['dailytop'];
handler.group = true;
handler.all = dailyTopMessageCounter;

export default handler;