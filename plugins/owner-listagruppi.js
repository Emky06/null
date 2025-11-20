//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Prende solo i gruppi attivi in cui il bot è presente
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

    // Usa metadata già presente se disponibile
    const metadata = conn.chats[jid]?.metadata || g.metadata || {};
    if (!metadata) continue;

    // Esclude community e broadcast
    if (metadata.isCommunity || metadata.announce || metadata.read_only) continue;

    const groupName = metadata.subject || 'Nome non disponibile';
    const membersCount = metadata.participants?.length || 0;

    // Genera il link solo se il bot è admin, usando metadata aggiornati
    let link = 'Non disponibile';
    try {
      const meta = await conn.groupMetadata(jid);
      const botParticipant = meta.participants?.find(p => conn.decodeJid(p.id) === conn.user.jid);
      if (botParticipant?.admin) {
        const code = await conn.groupInviteCode(jid);
        link = `https://chat.whatsapp.com/${code}`;
        await delay(300); // pausa 300ms per evitare rate limit
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