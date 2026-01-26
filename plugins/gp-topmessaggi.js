import fetch from 'node-fetch';

function sort(key, asc = true) {
  if (key) {
    return (a, b) => (asc ? a[key] - b[key] : b[key] - a[key]);
  } else {
    return (a, b) => (asc ? a - b : b - a);
  }
}

function getMedaglia(pos) {
  if (pos === 1) return '🥇';
  if (pos === 2) return '🥈';
  if (pos === 3) return '🥉';
  return '🏅';
}

function enumGetKey(obj) {
  return obj.jid;
}

let handler = async (m, { conn, args, participants }) => {
  // Prendo solo i partecipanti attivi nel gruppo escludendo il bot
  let groupUsers = participants
    .filter(u => u.id !== conn.user.jid)
    .map(u => {
      let userData = global.db.data.users[u.id] || {};
      return { jid: u.id, messaggi: userData.messaggi || 0 };
    });

  // Ordino dal più alto al più basso per messaggi
  let sorted = groupUsers.sort(sort('messaggi', false));

  // Gestione argomento: multipli di 10 fino a 100, default 10
  let maxEntries = 10;
  if (args[0]) {
    let n = parseInt(args[0]);
    if (!isNaN(n) && n >= 10 && n <= 100 && n % 10 === 0) {
      maxEntries = n;
    }
  }

  // Titolo dinamico in base a maxEntries
  let title = ` *🏆 𝐓𝐨𝐩 ${maxEntries} 𝐜𝐚𝐦𝐩𝐢𝐨𝐧𝐢* 🏆`;

  // Prendo solo i primi maxEntries utenti
  let topList = sorted.slice(0, maxEntries);

  // Costruisco la classifica
  let rankList = topList
    .map(({ jid, messaggi }, i) =>
      `${getMedaglia(i + 1)} *${messaggi}*  ➠ @${jid.split('@')[0]}`
    ).join('\n');

  // Posizione dell'utente che ha mandato il comando
  let pos = sorted.findIndex(u => u.jid === m.sender) + 1;
  let total = sorted.length;
  let footer = '';
  if (pos > 0) footer = `\n\n 𝐿𝑎 𝑡𝑢𝑎 𝑝𝑜𝑠𝑖𝑧𝑖𝑜𝑛𝑒: *${pos}° 𝑠𝑢 ${total}* `;

  let message = `${title}\n\n${rankList}${footer}`;

  // Definizione dei 4 bottoni
  const buttons = [
    { buttonId: '.topc', buttonText: { displayText: '𝐓𝐨𝐩 𝟏𝟎 𝐢𝐧𝐭𝐞𝐫𝐚𝐭𝐭𝐢𝐯𝐚 🏅' }, type: 1 },
    { buttonId: '.tap 20', buttonText: { displayText: '𝐓𝐨𝐩 𝟐𝟎 🏆' }, type: 1 },
    { buttonId: '.tap 50', buttonText: { displayText: '𝐓𝐨𝐩 𝟓𝟎 🏆' }, type: 1 },
    { buttonId: '.tap 100', buttonText: { displayText: '𝐓𝐨𝐩 𝟏𝟎𝟎 🏆' }, type: 1 },
    { buttonId: '.top', buttonText: { displayText: '𝐓𝐨𝐫𝐧𝐚 𝐚𝐥 𝐦𝐞𝐧𝐮̀ 𝐝𝐞𝐥𝐥𝐞 𝐭𝐨𝐩 🔙' }, type: 1 },
    { buttonId: '.tap', buttonText: { displayText: '𝐑𝐢𝐟𝐚𝐢 𝐥𝐚 𝐭𝐨𝐩 𝟏𝟎 𝐜𝐥𝐚𝐬𝐬𝐢𝐜𝐚 🏆' }, type: 1 },
  ];

  await conn.sendMessage(m.chat, {
    text: message.trim(),
    buttons: buttons,
    headerType: 1,
    mentions: topList.map(enumGetKey)
});
};

handler.command = /^top$/i;
handler.admin = false;
handler.group = true;

export default handler;