//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) return m.reply('⚠️ Solo gli owner possono usare questo comando!');

  const allChats = Object.values(conn.chats || {});
  const filteredGroups = [];

  for (const chat of allChats) {
    const id = chat.id;
    if (!id || !id.endsWith('@g.us')) continue; // solo gruppi
    const meta = chat.metadata || {};
    if (meta.isCommunity || meta.announce || meta.read_only) continue; // escludi community/broadcast
    filteredGroups.push({ id, meta });
  }

  if (!filteredGroups.length) return m.reply('Non sono presente in nessun gruppo normale.');

  let text = '📋 𝐄𝐥𝐞𝐧𝐜𝐨 𝐝𝐞𝐢 𝐠𝐫𝐮𝐩𝐩𝐢 𝐢𝐧 𝐜𝐮𝐢 𝐬𝐨𝐧𝐨 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞:\n\n';
  filteredGroups.forEach((g, i) => {
    const name = g.meta.subject || 'Sconosciuto';
    const id = g.id;
    text += `*${i + 1}.* 𝐍𝐨𝐦𝐞 𝐠𝐫𝐮𝐩𝐩𝐨: ${name}\n   𝐈𝐝: ${id}\n\n`;
  });

  m.reply(text.trim());
};

handler.help = ['idgruppi'];
handler.tags = ['owner'];
handler.command = ['idgruppi'];
handler.owner = true;
export default handler;
