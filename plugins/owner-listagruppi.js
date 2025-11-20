//Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { data: { chats: {} } };
  if (!global.db.data.chats) global.db.data.chats = {};
}

let handler = async (m, { conn }) => {
  ensureDB();

  // Prende tutti i gruppi in cui il bot è attualmente presente
  const allGroups = await conn.groupFetchAllParticipating().catch(() => ({}));
  const groups = Object.values(allGroups || {}).filter(g => g.id.endsWith('@g.us'));

  if (!groups.length) return m.reply('Non sono presente in nessun gruppo.');

  const output = [
    `𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${await conn.getName(conn.user.jid)}`,
    '',
    `➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}`,
    '\n══════ ೋೋ══════\n'
  ];

  for (const [index, g] of groups.entries()) {
    const jid = g.id;
    const metadata = conn.chats[jid]?.metadata || g.metadata || {};
    if (!metadata) continue;

    // Esclude community/broadcast
    if (metadata.isCommunity || metadata.announce || metadata.read_only) continue;

    const groupName = metadata.subject || 'Nome non disponibile';
    const membersCount = metadata.participants?.length || 0;

    // Controlla se il link è già salvato nel DB
    if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {};
    let link = global.db.data.chats[jid].groupInviteLink || 'Non disponibile';

    // Se non c’è link e bot è admin, lo generiamo e salviamo
    try {
      const botParticipant = metadata.participants?.find(p => conn.decodeJid(p.id) === conn.user.jid);
      if (link === 'Non disponibile' && botParticipant?.admin) {
        const code = await conn.groupInviteCode(jid);
        link = `https://chat.whatsapp.com/${code}`;
        global.db.data.chats[jid].groupInviteLink = link;
      }
    } catch (e) {
      link = 'Non disponibile';
    }

    output.push(
      `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ 𝐍𝐔𝐌𝚵𝐑Ꮻ: ${index + 1}`,
      `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ: ${groupName}`,
      `➣ 𝐌𝐄𝐌𝐁𝐑𝐈: ${membersCount}`,
      `➣ 𝕀𝐃: ${jid}`,
      `➣ 𝐋𝕀𝐍𝐊: ${link}`,
      '\n══════ ೋೋ══════\n'
    );
  }

  m.reply(output.join('\n'));
};

handler.command = /^(gruppi)$/i;
handler.owner = true;
export default handler;