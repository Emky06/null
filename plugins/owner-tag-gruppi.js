//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, text }) => {
  if (!text)
    return m.reply('⚠️ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨.\n\nEsempio:\n.tuttigp Ciao a tutti!');

  const allGroups = Object.keys(conn.chats || {})
    .filter(jid => jid.endsWith('@g.us'))
    .filter(jid => !jid.includes('@c.us'));

  let validGroups = [];

  for (const jid of allGroups) {
    try {
      const meta = conn.chats[jid]?.metadata || await conn.groupMetadata(jid);

      if (
        meta?.isCommunity ||
        meta?.announce ||
        meta?.read_only
      ) continue;

      validGroups.push([jid, meta]);

    } catch (e) {
      
    }
  }

  if (!validGroups.length)
    return m.reply('⚠️ 𝐈𝐥 𝐛𝐨𝐭 𝐧𝐨𝐧 𝐞̀ 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐢𝐧 𝐧𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨.');

  const groupNames = validGroups
  .map(([jid, meta]) => meta?.subject || 'Nome non disponibile')
  .join('\n➤ ');

m.reply(
  `📢 𝐈𝐧𝐯𝐢𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧 *${validGroups.length}* 𝐠𝐫𝐮𝐩𝐩𝐢...\n\n` +
  `📋 𝐆𝐫𝐮𝐩𝐩𝐢:\n➤ ${groupNames}`
);

  for (let [jid, metadata] of validGroups) {
    try {

      const participants = metadata.participants.map(p => p.id);

      const prefix = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📢 𝐂𝐨𝐦𝐮𝐧𝐢𝐜𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐚 𝐀𝐱𝐭𝐫𝐚𝐥 📢 ┃
╰━━━━━━━━━━━━━━━━━━━━━╯\n\n➠ `;
      const finalMessage = prefix + text;

      await conn.sendMessage(jid, {
        text: finalMessage,
        mentions: participants
      });

      await new Promise(res => setTimeout(res, 1500));

    } catch (e) {
      console.log(`Errore nel gruppo ${jid}`, e);
    }
  }

  m.reply('✅ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐢𝐧 𝐭𝐮𝐭𝐭𝐢 𝐢 𝐠𝐫𝐮𝐩𝐩𝐢.');
};

handler.help = ['tuttigp <messaggio>'];
handler.tags = ['owner'];
handler.command = ['tuttigp'];
handler.owner = true;

export default handler;