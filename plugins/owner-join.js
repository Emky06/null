let handler = async (m, { conn, text }) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];

  if (!code) throw `❌ Link non valido!`;

  await m.reply(`Entro fra 3 secondi, non cagarmi il cazzo per ora.`);
  await delay(3000);

  try {
    let res = await conn.groupAcceptInvite(code);

    if (!res) {
      throw new Error('Join fallito');
    }

    await conn.sendMessage(res, {
      text: `*Ciao ricchioni*`
    });

  } catch (e) {
    console.error('[JOIN ERROR]', e);

    // evita doppio messaggio inutile
    m.reply(`⚠️ Il bot è già nel gruppo o il link non è valido.`);
  }
};

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['join'];

export default handler;