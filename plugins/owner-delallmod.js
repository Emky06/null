// Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, prems: {}, groups: {} } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, prems: {}, groups: {} };
  if (!global.db.data.groups) global.db.data.groups = {};
}

let handler = async (m, { conn, text, usedPrefix, command, isOwner, isROwner, isAdmin, isBotAdmin, groupMetadata, participants }) => {
  ensureDB();

  if (!global.db.data.groups[m.chat]) {
    global.db.data.groups[m.chat] = {};
  }

  if (!Array.isArray(global.db.data.groups[m.chat].prems) || global.db.data.groups[m.chat].prems.length === 0) {
    return m.reply('ℹ️ 𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢 𝐩𝐞𝐫 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.');
  }

  let oldMods = [...global.db.data.groups[m.chat].prems];

  global.db.data.groups[m.chat].prems = [];

  for (let userId of oldMods) {
    let fullUserId = userId + '@s.whatsapp.net';
    if (global.db.data.users[fullUserId]) {
      global.db.data.users[fullUserId].premium = false;
    }
  }

  let mentionJids = oldMods.map(u => u + '@s.whatsapp.net');
  let listText = oldMods.map(u => `@${u}`).join('\n');

  let txt = `✅ 𝐓𝐮𝐭𝐭𝐢 𝐢 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐝𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 𝐬𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢.\n\n` +
            `👥 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:\n${listText}`;

  return m.reply(txt, null, { mentions: mentionJids });
};

handler.help = ['delallmod'];
handler.tags = ['owner'];
handler.command = /^delallmod|removeallmod|rimuovimodtutti$/i;
handler.group = true;
handler.rowner = true;

export default handler;