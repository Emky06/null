let handler = async (m, { conn, text }) => {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];

  if (!code) throw `❌ Link non valido!`;

  await m.reply(`Entro fra 3 secondi, non cagarmi il cazzo per ora.`);
  await delay(3000);

  try {
    await conn.groupAcceptInvite(code);

    let inviteInfo = await conn.groupGetInviteInfo(code);
    let groupJid = inviteInfo.id || inviteInfo.jid;

    if (!groupJid) {
      throw new Error('Impossibile ottenere gruppo');
    }

    await conn.sendMessage(groupJid, {
      text: `*Ciao ricchioni*`
    });

  } catch (e) {
    console.error('[JOIN ERROR]', e);
    m.reply(`⚠️ Il bot è già nel gruppo o il link non è valido.`);
  }
};

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['join'];

export default handler;