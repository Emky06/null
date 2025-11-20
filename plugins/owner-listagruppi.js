//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
  const groups = Object.entries(conn.chats || {})
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .sort(([jidA], [jidB]) => {
      const messaggiA = global.db.data.chats[jidA]?.messaggi || 0;
      const messaggiB = global.db.data.chats[jidB]?.messaggi || 0;
      return messaggiB - messaggiA;
    });

  const output = [`𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ${await conn.getName(conn.user.jid)}`, '', `➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}`, '\n══════ ೋೋ══════\n'];

  for (const [index, [jid]] of groups.entries()) {
    const metadata = conn.chats[jid]?.metadata;
    if (!metadata || metadata.isCommunity) continue; // esclude community

    const groupName = await conn.getName(jid).catch(() => 'Nome non disponibile');
    const membersCount = metadata.participants?.length || 0;

    // Link solo se il bot è admin
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