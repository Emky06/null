//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {

  // Prende solo i gruppi attivi in cui il bot è presente
  let groupsData = await conn.groupFetchAllParticipating().catch(() => ({}));
  let groups = Object.values(groupsData || {});

  if (!groups.length) return m.reply('Non sono presente in nessun gruppo.');

  let output = [`𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${await conn.getName(conn.user.jid)}`, '', `➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}`, '\n══════ ೋೋ══════\n'];

  for (const [index, g] of groups.entries()) {
    const jid = g.id;
    let groupMetadata = g.metadata || {};
    try {
      groupMetadata = await conn.groupMetadata(jid);
      g.metadata = groupMetadata;
    } catch (e) {}

    const participants = groupMetadata.participants || [];
    const totalParticipants = participants.length;

    const botParticipant = participants.find(p => conn.decodeJid(p.id) === conn.user.jid);
    const isBotAdmin = botParticipant?.admin ?? false;

    const groupName = groupMetadata.subject || 'Nome non disponibile';
    const groupMessages = g.messages?.length || 0;

    let groupInviteLink = 'Non disponibile';
    if (isBotAdmin) {
      try {
        const code = await conn.groupInviteCode(jid);
        groupInviteLink = `https://chat.whatsapp.com/${code}`;
      } catch (e) {}
    }

    output.push(
      `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ 𝐍𝐔𝐌𝚵𝐑Ꮻ: ${index + 1}`,
      `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ: ${groupName}`,
      `➣ 𝐏𝚲𝐑𝐓𝚵𝐂𝚲𝐏𝚲𝐍𝐓𝕀: ${totalParticipants}`,
      `➣ 𝐌𝚵𝐒𝐒𝚲𝐆𝐆𝕀: ${groupMessages}`,
      `➣ 𝚲𝐃𝐌𝕀𝐍: ${isBotAdmin ? '✓' : '☓'}`,
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