//Plugin fatto da Axtral_WiZaRd
const handler = async (message, { conn, usedPrefix }) => {
  const userCount = Object.keys(global.db.data.users).length;
  const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒𝕣𝕕';

  const menuText = generateModMenuText(usedPrefix, botName, userCount);

  await conn.sendMessage(message.chat, {
    text: menuText,
    footer: 'Scegli un menu:',
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
      { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 Menu Giochi" }, type: 1 },
      { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
      { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
      { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 Menu Funzioni" }, type: 1 },
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 Menu Owner" }, type: 1 }
    ],
    viewOnce: true
  }, { quoted: message });
};

handler.help = ['mod'];
handler.tags = ['menu'];
handler.command = /^mod$/i;

export default handler;

function generateModMenuText(prefix, botName, userCount) {
  return `
╭━〔 𝑴𝑬𝑵𝑼 𝑴𝑶𝑫𝑬𝑹𝑨𝑻𝑶𝑹𝑰 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 🔇 ${prefix}muto/smuto — Muta/smuta utenti
┃ 📝 ${prefix}mutati — Lista utenti mutati
┃ 🖼️ ${prefix}foto — Prendi foto profilo
┃ 👥 ${prefix}totag — Hidetag/tag
┃ ⚠️ ${prefix}alert/revoke — Dai/togli warn
┃  ✓   ${prefix}zerowarn — Azzera warn
┃ ⏱️ ${prefix}silence — Muto temporaneo 
┃ 🗑️ ${prefix}dell — Elimina messaggi
┃ 🔗 ${prefix}linkgp — Link gruppo
┃ 🔗 ${prefix}linkq — QR del gruppo 
┃ 👁️ ${prefix}riv — Rivela media
┃ 🔒 ${prefix}chiusotemp — Chiudi chat per tot min
╰━━━━━━━━━━━━━━━━━━━╯
🤖 𝐁𝐨𝐭: ${botName}
`.trim();
}