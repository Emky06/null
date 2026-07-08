// Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const whitelistFile = './storage/file-json/autorizzati-antinuke.json'

const readWhitelist = () => {
  if (!fs.existsSync(whitelistFile)) return {}
  return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'))
}

function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, prems: {}, groups: {} } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, prems: {}, groups: {} };
  if (!global.db.data.groups) global.db.data.groups = {};
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  ensureDB();

const whitelist = readWhitelist()
const groupWhitelist = whitelist[m.chat]?.autorizzati || []

const senderNumber = m.sender.split('@')[0]
const botNumber = conn.user.jid
const ownerNumbers = (global.owner || []).map(o => o[0])

const isAuthorized =
  groupWhitelist.includes(m.sender) ||
  ownerNumbers.includes(senderNumber) ||
  senderNumber + '@s.whatsapp.net' === botNumber

if (!isAuthorized) {
  return m.reply('⛔ 𝐍𝐨𝐧 𝐬𝐞𝐢 𝐚𝐮𝐭𝐨𝐫𝐢𝐳𝐳𝐚𝐭𝐨 𝐚𝐝 𝐮𝐬𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨.')
}

  let who = m.mentionedJid?.[0] || m.quoted?.sender || '';

  if (!who && text) {
    let txt = text.trim();

    if (txt.endsWith('@s.whatsapp.net') || txt.endsWith('@c.us')) {
      who = txt;
    } else {
      let number = txt.replace(/[^0-9]/g, '');
      if (number.length >= 8 && number.length <= 15) {
        
let number = txt.replace(/\D/g, '');
if (!txt.startsWith('+')) number = '+' + number;
who = number + '@s.whatsapp.net';
      }
    }
  }

  if (!who) {
    return m.reply(`❌ Devi specificare un utente. Esempio: ${usedPrefix + command} @utente o ${usedPrefix + command} +39 333 444 5555`);
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

export default handler;