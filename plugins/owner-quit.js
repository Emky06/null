//Plugin fatto da Axtral_WiZaRd

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  if (!isOwner) {
    return m.reply('⚠️ Solo gli owner possono usare questo comando!');
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  let [_, code] = text.match(linkRegex) || [];
  if (!code) throw `❌ Link non valido! Usa: ${usedPrefix + command} link_del_gruppo`;

  m.reply(`Ok, esco da quel gruppo tra 3 secondi...`);

  await delay(3000);

  try {
    let jid = await conn.groupAcceptInvite(code);
    await conn.groupLeave(jid);
    m.reply(`✅ Sono uscito dal gruppo correttamente.`);
  } catch (e) {
    console.log(e);
    throw `⚠️ Non sono riuscito ad uscire dal gruppo.\nPossibile che il link non sia valido o sia scaduto.`;
  }
};

handler.help = ['quit <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['quit'];
handler.owner = true;

export default handler;