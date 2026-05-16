let handler = async (m, { conn, text }) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];

  console.log('[QUIT] Link ricevuto:', text);
  console.log('[QUIT] Codice estratto:', code);

  if (!code) throw `❌ Link non valido!`;

  m.reply(`Esco fra 3 secondi, non cagarmi il cazzo per ora.`);
  await delay(3000);

  try {
    console.log('[QUIT] Recupero info gruppo...');

    let inviteInfo = await conn.groupGetInviteInfo(code);
    console.log('[QUIT] Invite info:', inviteInfo);

    let groupJid = inviteInfo.id || inviteInfo.jid;

    console.log('[QUIT] Group JID:', groupJid);

    if (!groupJid) {
      throw new Error('Group JID non trovato');
    }

    console.log('[QUIT] Sto uscendo dal gruppo...');

    let leave = await conn.groupLeave(groupJid);

    console.log('[QUIT] Risposta groupLeave:', leave);

    m.reply('✅ Uscito dal gruppo.');

  } catch (e) {
    console.error('[QUIT ERROR]', e);
    throw `⚠️ Non riesco a uscire dal gruppo. Guarda la console.`;
  }
};

handler.help = ['quit <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['quit'];

export default handler;