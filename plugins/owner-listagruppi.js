// Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, usedPrefix }) => {
  let output = [`𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${conn.getName(conn.user.jid)}`, ''];

  // Prendi solo i gruppi attivi dove il bot è membro
  const groups = Object.values(conn.chats)
    .filter(chat => chat.id?.endsWith('@g.us') && chat.isChats && chat.presences?.[conn.user.jid])
    .sort((a, b) => {
      const messaggiA = a.messages?.length || 0;
      const messaggiB = b.messages?.length || 0;
      return messaggiB - messaggiA;
    });

  output.push(`➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}`, '\n══════ ೋೋ══════\n');

  for (const [index, chat] of groups.entries()) {
    const jid = chat.id;
    let groupMetadata = chat.metadata || {};
    try {
      groupMetadata = await conn.groupMetadata(jid);
    } catch (error) {}

    const participants = groupMetadata.participants || [];
    const totalParticipants = participants.length;

    const botParticipant = participants.find(p => conn.decodeJid(p.id) === conn.user.jid);
    const isBotAdmin = botParticipant?.admin ?? false;

    let groupName = 'Nome non disponibile';
    try {
      groupName = await conn.getName(jid);
    } catch (error) {}

    let groupMessages = chat.messages?.length || 0;

    // Link admin solo se il bot è admin
    let groupInviteLink = 'Non disponibile';
    if (isBotAdmin) {
      try {
        const code = await conn.groupInviteCode(jid);
        groupInviteLink = `https://chat.whatsapp.com/${code}`;
      } catch (error) {}
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