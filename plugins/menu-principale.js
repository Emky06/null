import { performance } from 'perf_hooks';
import fetch from 'node-fetch'; // Assicurati di avere node-fetch installato

const handler = async (message, { conn, usedPrefix }) => {
  const userCount = Object.keys(global.db.data.users).length;
  const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

  const menuText = generateMenuText(usedPrefix, botName, userCount);

  const messageOptions = {
    contextInfo: {
      
    }
  };

  // Invia il menu e i bottoni  
  await conn.sendMessage(message.chat, {
    text: menuText,
    footer: 'Scegli un menu:',
    buttons: [
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 Menu Owner" }, type: 1 },
      { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
      { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ Menu Mod" }, type: 1 },
      { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 Menu Funzioni" }, type: 1 },
      { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
      { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 Menu Giochi" }, type: 1 },
    ],
    viewOnce: true,
    ...messageOptions
  }, { quoted: message });
};

async function fetchThumbnail(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Errore durante il fetch della thumbnail:', error);
    return 'default-thumbnail'; // Fallback thumbnail in caso di errore
  }
}

handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(menu|comandi)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
  // Definisci la variabile vs oppure rimuovila se non serve
  const vs = '1.0.0'; // esempio versione

  return `
╭〔🤖𝑴𝑬𝑵𝑼 𝑫𝑬𝑳 𝑩𝑶𝑻🤖〕╮
┣━━━━━━━━━━━━━━━━━━
┃ 🛠𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝑮𝑬𝑵𝑬𝑹𝑨𝑳𝑰🛠
┣━━━━━━━━━━━━━━━━━━
┃ 👑 .𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻𝑨𝑹𝑰𝑶
┃ 🔱 .𝑶𝑾𝑵𝑬𝑹
┃ 🛡️ .𝑨𝑫𝑴𝑰𝑵
┃ 👮🏻‍♂️.𝑴𝑶𝑫
┃ 🔧 .𝑭𝑼𝑵𝒁𝑰𝑶𝑵𝑰
┃ 👥 .𝑮𝑹𝑼𝑷𝑷𝑶
┃ 🎮 .𝑮𝑰𝑶𝑪𝑯𝑰
┃ 📞 .𝑺𝑼𝑷𝑷𝑶𝑹𝑻𝑶
┃ 🤖 .𝑰𝑵𝑭𝑶𝑩𝑶𝑻
╰━━━━━━━━━━━━━━━━━╯
🤖 *𝑩𝒐𝒕*: 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
🌟 *𝑽𝒆𝒓𝒔𝒊𝒐𝒏𝒆:* Unica
`.trim();
}