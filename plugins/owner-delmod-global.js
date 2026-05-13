//Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, prems: {}, groups: {} } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, prems: {}, groups: {} };
  if (!global.db.data.groups) global.db.data.groups = {};
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  ensureDB();

  let who = m.mentionedJid?.[0] || m.quoted?.sender || '';

  if (!who && text) {
    let txt = text.trim();

    if (txt.endsWith('@s.whatsapp.net') || txt.endsWith('@c.us')) {
      who = txt;
    } else {
      let number = txt.replace(/\D/g, '');

      if (number.length >= 8 && number.length <= 15) {
        who = number + '@s.whatsapp.net';
      }
    }
  }

  if (!who) {
    return m.reply(
      `❌ 𝐃𝐞𝐯𝐢 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐫𝐞 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞.\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨:\n${usedPrefix + command} @utente\n${usedPrefix + command} 393334445555`
    );
  }

  const decoded = conn.decodeJid ? conn.decodeJid(who) : who;
  const userId = decoded.split('@')[0];
  const fullUserId = userId + '@s.whatsapp.net';

  let removedFrom = 0;

  for (let groupId in global.db.data.groups) {
    let groupData = global.db.data.groups[groupId];

    if (!groupData.prems) groupData.prems = [];

    let idx = groupData.prems.indexOf(userId);

    if (idx !== -1) {
      groupData.prems.splice(idx, 1);
      removedFrom++;
    }
  }

  if (global.db.data.users[fullUserId]) {
    global.db.data.users[fullUserId].premium = false;
  }

  if (removedFrom === 0) {
    return m.reply(
      `@${userId} non è moderatore in nessun gruppo.`,
      null,
      { mentions: [fullUserId] }
    );
  }

  let txt = `✅ @${userId} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐜𝐨𝐦𝐞 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐝𝐚 ${removedFrom} 𝐠𝐫𝐮𝐩𝐩𝐢.`;

  m.reply(txt, null, { mentions: [fullUserId] });
};

handler.help = ['delmodglobal <@user|numero>'];
handler.tags = ['owner'];
handler.command = /^(delmodglobal)$/i;
handler.owner = true;

export default handler;