function ensureDB() {
  if (!global.db) global.db = { data: { chats: {} } };
  if (!global.db.data.chats) global.db.data.chats = {};
}

let handler = async (m, { conn }) => {

  ensureDB()

  let target = m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.quoted 
      ? m.quoted.sender 
      : null;

  if (!target) {
    return conn.reply(
      m.chat, 
      '⚠️ 𝐃𝐞𝐯𝐢 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐝𝐚 𝐫𝐢𝐦𝐨𝐯𝐞𝐫𝐞!\n\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: .banall @user 𝐨𝐩𝐩𝐮𝐫𝐞 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 .banall', 
      m
    );
  }

  const allGroups = await conn.groupFetchAllParticipating().catch(() => ({}));

  const groupsRaw = Object.values(allGroups || {}).filter(g => g.id.endsWith('@g.us'));

  const groups = groupsRaw.filter(g => {
    const meta = g.metadata || {};
    return !(meta.isCommunity || meta.announce || meta.read_only);
  });

  if (!groups.length) {
    return m.reply('Non sono presente in nessun gruppo valido.');
  }

  let removedGroups = [];

  for (const g of groups) {

    const jid = g.id;
    const participants = g.participants?.map(p => p.id) || [];

    if (participants.includes(target)) {

      try {

        await conn.groupParticipantsUpdate(jid, [target], 'remove');

        removedGroups.push(g.subject || 'Nome non disponibile');

      } catch (e) {}

    }
  }

  let message = `🛑 *𝐑𝐞𝐩𝐨𝐫𝐭*:\n𝐇𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 @${target.split('@')[0]} 𝐝𝐚 ${removedGroups.length} 𝐠𝐫𝐮𝐩𝐩𝐢.\n\n📋 𝐄𝐥𝐞𝐧𝐜𝐨 𝐠𝐫𝐮𝐩𝐩𝐢:\n- ${removedGroups.join('\n- ') || '*𝐍𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨*'}`;

  await conn.reply(m.chat, message, null, { mentions: [target] });
};

handler.command = /^(banall|takeover)$/i;
handler.group = true;
handler.owner = true;

export default handler;