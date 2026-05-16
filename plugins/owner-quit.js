let handler = async (m, { conn, text }) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];

  if (!code) throw `❌ Link non valido!`;

  await m.reply(`Esco fra 3 secondi, non cagarmi il cazzo per ora.`);
  await delay(3000);

  try {
    let inviteInfo = await conn.groupGetInviteInfo(code);
    let groupJid = inviteInfo.id || inviteInfo.jid;

    if (!groupJid) throw new Error('Group JID non trovato');

    // lascia prima il gruppo
    await conn.groupLeave(groupJid);

    // messaggio DOPO il leave (fuori dal contesto gruppo)
    await conn.sendMessage(m.chat, {
      text: `✅ Uscito dal gruppo con successo.`
    });

  } catch (e) {
    console.error('[QUIT ERROR]', e);
    m.reply(`⚠️ Non riesco a uscire dal gruppo. Controlla il link o se il bot è dentro.`);
  }
};

handler.help = ['quit <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['quit'];

export default handler;