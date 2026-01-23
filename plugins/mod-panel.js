//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, args }) => {
  if (!global.db || !global.db.data) global.db = { data: {} };
  if (!global.db.data.groups) global.db.data.groups = {};

  const groupId = m.chat;
  const groupData = global.db.data.groups[groupId] || (global.db.data.groups[groupId] = {});
  groupData.prems ||= [];
  groupData.kickPerms ||= {};

  let target = m.mentionedJid?.[0] || m.quoted?.sender || args.join(' ').replace(/\D/g, '');
  if (!target) return m.reply('❌ 𝐃𝐞𝐯𝐢 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚𝐥 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨.');

  if (!/@s\.whatsapp\.net$/.test(target)) target = `${target}@s.whatsapp.net`;

  const isPremium = groupData.prems.some(u => {
    const jid = u.includes('@s.whatsapp.net') ? u : `${u}@s.whatsapp.net`;
    return jid === target;
  });

  if (!isPremium) return m.reply('❌ 𝐋\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚𝐭𝐨 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞.);

  const espelliStatus = groupData.kickPerms[target] ? '✅ 𝐀𝐭𝐭𝐢𝐯𝐨' : '❌ 𝐃𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨';

  const userTag = `@${target.split('@')[0]}`;
  const messaggio = 
`╭━━━[ *𝐏𝐚𝐧𝐧𝐞𝐥𝐥𝐨 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞* ]━━━╮
┃ 👤 𝐔𝐭𝐞𝐧𝐭𝐞: ${userTag}
┃ ⚡ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐬𝐩𝐞𝐥𝐥𝐢: ${espelliStatus}
╰━━━━━━━━━━━━━━━━━━━╯`;

  m.reply(messaggio, null, { mentions: [target] });
};

handler.command = /^modpanel$/i;
handler.group = true;
handler.owner = true;

export default handler;