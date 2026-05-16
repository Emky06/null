//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text }) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];

  if (!code) throw `❌ Link non valido!`;

  m.reply(`Esco fra 3 secondi, non cagarmi il cazzo per ora.`);
  await delay(3000);

  try {
    let inviteInfo = await conn.groupGetInviteInfo(code);
    let groupJid = inviteInfo.id || inviteInfo.jid;

    if (!groupJid) {
      throw new Error('Group JID non trovato');
    }

    await conn.groupLeave(groupJid);

  } catch (e) {
    throw `⚠️ Non riesco a uscire dal gruppo. Controlla il link o verifica che il bot sia dentro.`;
  }
};

handler.help = ['quit <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['quit'];

export default handler;