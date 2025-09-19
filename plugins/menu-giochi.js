const handler = async (message, { conn, usedPrefix }) => {
  const userCount = Object.keys(global.db.data.users).length;
  const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒𝕣𝕕';

  const menuText = generateGiochiMenuText(usedPrefix, botName, userCount);

  await conn.sendMessage(message.chat, {
    text: menuText,
    footer: 'Scegli un menu:',
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
      { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
      { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
      { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ Menu Mod" }, type: 1 },
      { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 Menu Funzioni" }, type: 1 },
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 Menu Owner" }, type: 1 }
    ],
    viewOnce: true
  }, { quoted: message });
};

handler.help = ['giochi'];
handler.tags = ['menu'];
handler.command = /^giochi$/i;

export default handler;

function generateGiochiMenuText(prefix, botName, userCount) {
  return `
╭〔🎮 𝑴𝑬𝑵𝑼 𝑮𝑰𝑶𝑪𝑯𝑰 🎮〕╮
┣━━━━━━━━━━━━━━━━━━
┃ 🎲 ${prefix}roulette — Classica
┃ 🔫 ${prefix}rr — Roulette Russa
┃ 🪙 ${prefix}moneta — Testa o Croce
┃ 🪙 ${prefix}coinflip — Testa o Croce (con il bot)
┃ 🎰 ${prefix}slot — Slot Machine
┃ ⚽ ${prefix}calcio — Scommesse di calcio
┃ 😵 ${prefix}impiccato — Gioco dell'impiccato
┃ 🇮🇹 ${prefix}bandiera — Indovina la bandiera
┃ 🎵 ${prefix}ic — Indovina la canzone
┃ ✂️ ${prefix}game — Sasso/Carta/Forbice
┃ ❎ ${prefix}tris — Gioco del tris
┃ 💰 ${prefix}portafoglio — Controlla soldi
┃ 💼 ${prefix}acquista — Acquista messaggi
┃ 📈 ${prefix}bilancio — Bilancio soldi del gruppo
╰━━━━━━━━━━━━━━━━━╯
🎮 *Totale giochi:* 11
🤖 *Bot:* ${botName}
`.trim();
}