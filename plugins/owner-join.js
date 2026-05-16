//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
if (!isOwner) {
return m.reply('⚠️ Solo gli owner possono usare questo comando!');
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let linkRegex = /chat.whatsapp.com/([0-9A-Za-z]{20,24})/i;
let [_, code] = text.match(linkRegex) || [];
if (!code) throw ❌ Link non valido!;

m.reply(Entro fra 3 secondi, non cagarmi il cazzo per ora.);
await delay(3000);

try {
let res = await conn.groupAcceptInvite(code);
let metadata = await conn.groupMetadata(res);

await conn.sendMessage(res, {  
  text: `*Ciao ricchioni*`  
});

} catch (e) {
throw ⚠️ Il bot è già nel gruppo o il link non è valido.;
}
};

handler.help = ['join <chat.whatsapp.com>'];
handler.tags = ['owner'];
handler.command = ['join'];
handler.owner = true;
export default handler;