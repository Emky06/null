// Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn }) => {
  let output = [`𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${await conn.getName(conn.user.jid)}`, ''];

  // Prendi solo le chat di tipo gruppo
  const groups = Object.values(conn.chats)
    .filter(chat => chat.id?.endsWith('@g.us') && chat.isChats);

  // Filtra solo i gruppi dove il bot è effettivamente membro
  const activeGroups = [];
  for (const chat of groups) {
    let participants = chat.metadata?.participants || [];
    // Se metadata non esiste ancora, prova a prenderla
    if (!participants.length) {
      try {
        const metadata = await conn.groupMetadata(chat.id);
        participants = metadata.participants || [];
        chat.metadata = metadata; // salva per riutilizzo
      } catch (e) {}
    }
    if (participants.some(p => conn.decodeJid(p.id) === conn.user.jid)) {
      activeGroups.push(chat);
    }
  }

  // Ordina in base al numero di messaggi (se disponibile)
  activeGroups.sort((a, b) => {
    const msgA = a.messages?.length || 0;
    const msgB = b.messages?.length || 0;
    return msgB - msgA;
  });

  output.push(`➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${activeGroups.length}`, '\n══════ ೋೋ══════\n');

  for (const [index, chat] of activeGroups.entries()) {
    const jid = chat.id;
    const metadata = chat.metadata || {};
    const participants = metadata.participants || [];
    const totalParticipants = participants.length;

    const botParticipant = participants.find(p => conn.decodeJid(p.id) === conn.user.jid);
    const isBotAdmin = botParticipant?.admin ?? false;

    let groupName = 'Nome non disponibile';
    try {
      groupName = await conn.getName(jid);
    } catch (e) {}

    const groupMessages = chat.messages?.length || 0;

    // Link admin solo se il bot è admin
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