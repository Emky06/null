//by blood
const handler = async (m, { conn, text }) => {
  if (!text)
    return m.reply('⚠️ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨.\n\nEsempio:\n.tuttigp Ciao a tutti!');

  const chats = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

  let validGroups = [];

  for (let [jid] of chats) {
    try {
      const metadata = await conn.groupMetadata(jid);
      validGroups.push([jid, metadata]);
    } catch (e) {
      // gruppo non valido
    }
  }

  if (!validGroups.length)
    return m.reply('⚠️ 𝐈𝐥 𝐛𝐨𝐭 𝐧𝐨𝐧 𝐞̀ 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐢𝐧 𝐧𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨.');

  // 👇 DEBUG NOMI GRUPPI
  for (let [jid, metadata] of validGroups) {
    console.log(`Gruppo: ${metadata.subject} | ID: ${jid}`);
  }

  m.reply(`📢 𝐈𝐧𝐯𝐢𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧 *${validGroups.length}* 𝐠𝐫𝐮𝐩𝐩𝐢...`);

  for (let [jid, metadata] of validGroups) {
    try {

      const participants = metadata.participants.map(p => p.id);

      const prefix = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📢 𝐂𝐨𝐦𝐮𝐧𝐢𝐜𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐚 𝐀𝐱𝐭𝐫𝐚𝐥 📢 ┃
╰━━━━━━━━━━━━━━━━━━━━━╯\n\n➠ `;
      const finalMessage = prefix + text;

      await conn.sendMessage(
        jid,
        {
          text: finalMessage,
          mentions: participants 
        }
      );

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