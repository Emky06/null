//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('⚠️ Solo gli owner possono usare questo comando!');

  let groupsData = await conn.groupFetchAllParticipating().catch(() => ({}));
  let groups = Object.values(groupsData || {});

  if (!groups.length) return m.reply('Non sono presente in nessun gruppo.');

  let text = '📋 𝐄𝐥𝐞𝐧𝐜𝐨 𝐝𝐞𝐢 𝐠𝐫𝐮𝐩𝐩𝐢 𝐢𝐧 𝐜𝐮𝐢 𝐬𝐨𝐧𝐨 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞:\n\n';
  groups.forEach((g, i) => {
    const name = g.subject || (g.metadata && g.metadata.subject) || 'Sconosciuto';
    const id = g.id || (g.metadata && g.metadata.id) || 'Sconosciuto';
    text += `*${i + 1}.*\n𝐍𝐨𝐦𝐞 𝐠𝐫𝐮𝐩𝐩𝐨: ${name}\n𝐈𝐝: ${id}\n\n`;
  });

  m.reply(text.trim());
};

handler.help = ['idgruppi'];
handler.tags = ['owner'];
handler.command = ['idgruppi'];
handler.owner = true;
export default handler;
