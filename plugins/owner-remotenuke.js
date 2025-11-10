//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  if (!isOwner) return m.reply('⚠️ Solo gli owner possono usare questo comando!');
  const input = (text || '').trim();
  if (!input) return m.reply('❌ Inserisci un chatId. Uso: .remotenuke <chatId>');

  const chatId = input;
  if (!chatId.endsWith('@g.us')) return m.reply('❌ Formato non valido. Fornisci un chatId (es. 12345@g.us).');

  let metadata;
  try {
    metadata = await conn.groupMetadata(chatId);
  } catch (e) {
    return m.reply('❌ Non sono presente in questo gruppo o chatId non valido.');
  }

  const ownerIDs = (global.owner || [])
    .map(o => (typeof o === 'object' ? o[0] : o))
    .map(id => id && id.includes('@s.whatsapp.net') ? id : (id ? id + '@s.whatsapp.net' : id))
    .filter(Boolean);

  const participantsIDs = (metadata.participants || []).map(p => p.id || p.jid).filter(Boolean);
  const usersToRemove = participantsIDs.filter(id => id !== conn.user.jid && !ownerIDs.includes(id));


  await conn.sendMessage(chatId, { text: '*𝛬𝑿𝑻𝑹𝜜𝑳 𝐃Ꮻ𝐌𝐈𝐍𝐀 𝐀𝐍𝐂𝐇𝐄 𝐐𝐔𝐄𝐒𝐓Ꮻ 𝐆𝐑𝐔𝐏𝐏Ꮻ.*' });

 
  await conn.sendMessage(chatId, { 
    text: '*CI SPOSTIAMO QUI:*\nhttps://chat.whatsapp.com/Br7QocVZNmE26ugCYZ8Bme',
    mentions: participantsIDs
  });

  if (!usersToRemove.length) return m.reply(`𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐫𝐢𝐦𝐨𝐯𝐢𝐛𝐢𝐥𝐞 𝐢𝐧 *${metadata.subject || chatId}*.`);

  await conn.sendMessage(m.chat, { text: `𝐄𝐬𝐞𝐠𝐮𝐨 𝐢𝐥 𝐧𝐮𝐤𝐞 𝐬𝐮 *${metadata.subject || chatId}* — 𝐫𝐢𝐦𝐮𝐨𝐯𝐨 ${usersToRemove.length} 𝐮𝐭𝐞𝐧𝐭𝐢.` });

  try {
    await conn.groupParticipantsUpdate(chatId, usersToRemove, 'remove');
  } catch {
    for (let id of usersToRemove) {
      try {
        await conn.groupParticipantsUpdate(chatId, [id], 'remove');
      } catch {}
    }
  }

  await conn.sendMessage(m.chat, { text: `𝐎𝐩𝐞𝐫𝐚𝐳𝐢𝐨𝐧𝐞 𝐭𝐞𝐫𝐦𝐢𝐧𝐚𝐭𝐚 𝐬𝐮 *${metadata.subject || chatId}* ✅` });
};

handler.help = ['remotenuke <chatId>'];
handler.tags = ['owner'];
handler.command = ['remotenuke','rnuke'];
handler.owner = true;
export default handler;
