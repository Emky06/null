//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {

  let groupsData = await conn.groupFetchAllParticipating().catch(() => ({}));
  let groups = Object.values(groupsData || {});

  if (!groups.length) return m.reply('Non sono presente in nessun gruppo.');

  let output = [`𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${await conn.getName(conn.user.jid)}`, '', `➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}`, '\n══════ ೋೋ══════\n'];

  for (const [index, g] of groups.entries()) {
    const jid = g.id;
    const groupName = g.subject || 'Nome non disponibile';

    // Partecipanti e admin non disponibili senza chiamare groupMetadata
    const totalParticipants = g.participants?.length || 'N/D';
    const isBotAdmin = 'N/D';
    const groupMessages = 'N/D';
    const groupInviteLink = 'Non disponibile';

    output.push(
      `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ 𝐍𝐔𝐌𝚵𝐑Ꮻ: ${index + 1}`,
      `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ: ${groupName}`,
      `➣ 𝐏𝚲𝐑𝐓𝚵𝐂𝚲𝐏𝚲𝐍𝐓𝕀: ${totalParticipants}`,
      `➣ 𝐌𝚵𝐒𝐒𝚲𝐆𝐆𝕀: ${groupMessages}`,
      `➣ 𝚲𝐃𝐌𝕀𝐍: ${isBotAdmin}`,
      `➣ 𝕀𝐃: ${jid}`,
      `➣ 𝐋𝕀𝐍𝐊: ${groupInviteLink}`,
      '\n══════ ೋೋ══════\n'
    );
  }

  m.reply(output.join('\n'));
};

handler.command = /^(gruppi)$/i;
handler.owner = true;
export default handler;