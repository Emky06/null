//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, args }) => {
  if (!global.db || !global.db.data) global.db = { data: {} };
  if (!global.db.data.groups) global.db.data.groups = {};

  const groupId = m.chat;
  const groupData = global.db.data.groups[groupId] || (global.db.data.groups[groupId] = {});
  groupData.kickPerms = groupData.kickPerms || {};
  groupData.prems = groupData.prems || [];

  const cmd = args[0]?.toLowerCase();
  const mention = m.mentionedJid?.[0];
  if (!cmd || !mention) return m.reply(`❌ 𝐔𝐬𝐚: .mattiva espelli @utente 𝐨𝐩𝐩𝐮𝐫𝐞 .mdisattiva espelli @utente`);

  const isPremium = groupData.prems.some(u => {
    const jid = u.includes('@s.whatsapp.net') ? u : `${u}@s.whatsapp.net`;
    return jid === mention;
  });
  if (!isPremium) return m.reply('❌ 𝐋\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞.');

  if (cmd !== 'espelli') return m.reply('❌ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨, 𝐮𝐬𝐚 𝐬𝐨𝐥𝐨 "𝐞𝐬𝐩𝐞𝐥𝐥𝐢"');

  const isActivating = /^mattiva$/i.test(args[0]);
  groupData.kickPerms[mention] = isActivating;

  if (global.db.write) await global.db.write();

  const userTag = `@${mention.split('@')[0]}`;
  const actionText = isActivating ? '𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨' : '𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨';

  const messaggio = 
`╭━━━━━━━━━━━━━━━━━━╮
┃ ✅ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐤𝐢𝐜𝐤 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢
┃ ➤ 𝐔𝐭𝐞𝐧𝐭𝐞: ${userTag}
┃ ➤ 𝐒𝐭𝐚𝐭𝐨: ${actionText}
╰━━━━━━━━━━━━━━━━━━╯`;

  m.reply(messaggio, null, { mentions: [mention] });
};

handler.command = /^mattiva|mdisattiva$/i;
handler.group = true;
handler.owner = true;

export default handler;