// Plugin fatto da Axtral_WiZaRd
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
      let number = txt.replace(/[^0-9]/g, '');
      if (number.length >= 8 && number.length <= 15) {
        if (!number.startsWith('39')) {
          number = '39' + number;
        }
        who = number + '@s.whatsapp.net';
      }
    }
  }

  if (!who) {
    return m.reply(`❌ Devi specificare un utente. Esempio: ${usedPrefix + command} @utente o ${usedPrefix + command} +39 350 014 8400`);
  }

  const decoded = conn.decodeJid ? conn.decodeJid(who) : who;
  const userId = decoded.split('@')[0];
  const fullUserId = userId + '@s.whatsapp.net';

  if (!global.db.data.groups[m.chat]) {
    global.db.data.groups[m.chat] = { prems: [] };
  }

  let groupPrems = global.db.data.groups[m.chat].prems || [];
  global.db.data.groups[m.chat].prems = groupPrems;

  let isPremium = groupPrems.includes(userId);

  if (!isPremium) {
    return m.reply(`@${userId} 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐝𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`, null, { mentions: [fullUserId] });
  }

  let idx = groupPrems.indexOf(userId);
  if (idx !== -1) groupPrems.splice(idx, 1);

  if (global.db.data.users[fullUserId]) {
    global.db.data.users[fullUserId].premium = false;
  }

  let textdelprem = `@${userId} 𝐧𝐨𝐧 𝐞̀ 𝐩𝐢𝐮̀ 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`;
  m.reply(textdelprem, null, { mentions: [fullUserId] });
};

handler.help = ['delmod <@user|numero>'];
handler.tags = ['owner'];
handler.command = /^(remove|del|rimuovi)mod$/i;
handler.group = true;
handler.rowner = true;

export default handler;