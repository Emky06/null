//Plugin fatto da Axtral_WiZaRd

function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, prems: {}, groups: {} } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, prems: {}, groups: {} };
  if (!global.db.data.groups) global.db.data.groups = {};
  if (!global.db.data.users) global.db.data.users = {};
}

let handler = async (m, { conn, text, usedPrefix, command, isOwner, isAdmin }) => {
  ensureDB();

  const senderDecoded = conn.decodeJid ? conn.decodeJid(m.sender) : m.sender;
  const senderUserId = senderDecoded.split('@')[0];
  const senderFullId = senderUserId + '@s.whatsapp.net';

  if (!global.db.data.groups[m.chat]) {
    global.db.data.groups[m.chat] = { prems: [] };
  }
  let groupPrems = global.db.data.groups[m.chat].prems || [];
  global.db.data.groups[m.chat].prems = groupPrems;

  let isGroupPrem = groupPrems.includes(senderUserId);

  let userData = global.db.data.users[senderFullId] || {};
  let isGlobalPrem = !!userData.premium;

  let isPrems = isGroupPrem || isGlobalPrem;

  if (!isOwner && !isAdmin && !isPrems) {
    return m.reply('⚠️ 𝐒𝐨𝐥𝐨 𝐨𝐰𝐧𝐞𝐫, 𝐚𝐝𝐦𝐢𝐧 𝐨 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐩𝐨𝐬𝐬𝐨𝐧𝐨 𝐮𝐬𝐚𝐫𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨!');
  }

  const input = (text || '').trim().split(/\s+/);
  const chatId = input[0];
  const mode   = (input[1] || '').toLowerCase();

  if (!chatId || !mode) {
    return m.reply(
      `❌ 𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:\n` +
      `> ${usedPrefix + command} <chatId> <open|close>\n\n` +
      `𝐄𝐬𝐞𝐦𝐩𝐢𝐨:\n` +
      `> ${usedPrefix + command} 123456789-123456789@g.us open\n` +
      `> ${usedPrefix + command} 123456789-123456789@g.us close`
    );
  }

  if (!chatId.endsWith('@g.us')) {
    return m.reply('❌ 𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨. 𝐅𝐨𝐫𝐧𝐢𝐬𝐜𝐢 𝐮𝐧 𝐜𝐡𝐚𝐭𝐈𝐝 𝐝𝐢 𝐠𝐫𝐮𝐩𝐩𝐨 (𝐞𝐬. 𝟏𝟐𝟑𝟒𝟓@g.us).');
  }

  if (!['open', 'close'].includes(mode)) {
    return m.reply('❌ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚. 𝐔𝐬𝐚 `open` 𝐨𝐩𝐩𝐮𝐫𝐞 `close`.');
  }

  let metadata;
  try {
    metadata = await conn.groupMetadata(chatId);
  } catch (e) {
    return m.reply('❌ 𝐍𝐨𝐧 𝐬𝐨𝐧𝐨 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 𝐨 𝐜𝐡𝐚𝐭𝐈𝐝 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.');
  }

  const botId = conn.user?.jid || conn.user?.id;
  const me = (metadata.participants || []).find(p => p.id === botId || p.jid === botId);
  const isBotAdmin = me?.admin === 'admin' || me?.admin === 'superadmin';

  if (!isBotAdmin) {
    return m.reply(`❌ 𝐍𝐨𝐧 𝐬𝐨𝐧𝐨 𝐚𝐝𝐦𝐢𝐧 𝐢𝐧 *${metadata.subject || chatId}*, 𝐧𝐨𝐧 𝐩𝐨𝐬𝐬𝐨 𝐜𝐚𝐦𝐛𝐢𝐚𝐫𝐞 𝐥𝐞 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐳𝐢𝐨𝐧𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.`);
  }

  const setting = mode === 'close' ? 'announcement' : 'not_announcement';
  const humanText = mode === 'close'
    ? '🔒 𝐆𝐫𝐮𝐩𝐩𝐨 𝐜𝐡𝐢𝐮𝐬𝐨 — 𝐨𝐫𝐚 𝐩𝐨𝐬𝐬𝐨𝐧𝐨 𝐬𝐜𝐫𝐢𝐯𝐞𝐫𝐞 𝐬𝐨𝐥𝐨 𝐠𝐥𝐢 𝐚𝐝𝐦𝐢𝐧.'
    : '🔓 𝐆𝐫𝐮𝐩𝐩𝐨 𝐚𝐩𝐞𝐫𝐭𝐨 — 𝐨𝐫𝐚 𝐭𝐮𝐭𝐭𝐢 𝐩𝐨𝐬𝐬𝐨𝐧𝐨 𝐬𝐜𝐫𝐢𝐯𝐞𝐫𝐞.';

  try {
    await conn.sendMessage(chatId, { 
      text: mode === 'close'
        ? '🚫 *𝐈𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐜𝐡𝐢𝐮𝐬𝐨 𝐝𝐚𝐠𝐥𝐢 𝐃𝐞𝐢.*'
        : '✅ *𝐈𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐚𝐩𝐞𝐫𝐭𝐨, 𝐩𝐚𝐫𝐥𝐚𝐭𝐞 𝐩𝐥𝐞𝐛𝐞𝐢!*'
    });
  } catch (e) {}

  try {
    await conn.groupSettingUpdate(chatId, setting);
  } catch (e) {
    return m.reply('❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐫𝐞 𝐥𝐞 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐳𝐢𝐨𝐧𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨. 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐚 𝐜𝐡𝐞 𝐢𝐨 𝐬𝐢𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 𝐚𝐝𝐦𝐢𝐧.');
  }

  await conn.sendMessage(m.chat, {
    text: `${humanText}\n📌 𝐆𝐫𝐮𝐩𝐩𝐨: *${metadata.subject || chatId}*\n👤 𝐀𝐳𝐢𝐨𝐧𝐚𝐭𝐨 𝐝𝐚: @${senderUserId}`,
    mentions: [senderFullId]
  });
};

handler.help = ['remotegp <chatId> <open|close>'];
handler.tags = ['group', 'owner'];
handler.command = ['remotegp','rgroup','rgp'];
handler.owner = false;
handler.admin = false;
handler.group = true;
handler.botAdmin = true;

export default handler;