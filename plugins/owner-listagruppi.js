//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
  let groupsData = await conn.groupFetchAllParticipating().catch(() => ({}));
  let groups = Object.values(groupsData || {});

  if (!groups.length) return m.reply('Non sono presente in nessun gruppo.');

  let output = [`𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${await conn.getName(conn.user.jid)}`, '', `➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}`, '\n══════ ೋೋ══════\n'];

  for (const [index, g] of groups.entries()) {
    const jid = g.id;
    let metadata = g.metadata;

    // Recupera metadata completi (per partecipanti)
    try {
      metadata = await conn.groupMetadata(jid);
    } catch (e) {
      metadata = { participants: [] };
    }

    const groupName = metadata.subject || 'Nome non disponibile';
    const membersCount = metadata.participants?.length || 0;

    // Genera il link solo se il bot è admin
    let link = 'Non disponibile';
    try {
      const botParticipant = metadata.participants.find(p => conn.decodeJid(p.id) === conn.user.jid);
      if (botParticipant?.admin) {
        const code = await conn.groupInviteCode(jid);
        link = `https://chat.whatsapp.com/${code}`;
      }
    } catch (e) {}

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