import 'os';
import 'util';
import 'human-readable';
import '@whiskeysockets/baileys';
import 'fs';
import 'perf_hooks';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, usedPrefix, command }) => {
  const chatData = global.db.data.chats[m.chat];
  const isOwner = global.owner.map(([number]) => number + '@s.whatsapp.net').includes(m.sender);

  if (command === 'menu') {
    return await (await import('./menu-principale.js')).default(m, { conn, usedPrefix });
  }
  if (command === 'admin') {
    return await (await import('./menu-admin.js')).default(m, { conn, usedPrefix });
  }
  if (command === 'mod') {
        return await (await import('./menu-mod')).default(message, { conn, usedPrefix });
    }
  if (command === 'owner') {
    return await (await import('./menu-owner.js')).default(m, { conn, usedPrefix });
  }
  if (command === 'gruppo') {
    return await (await import('./menu-gruppo.js')).default(m, { conn, usedPrefix });
  }
  if (command === 'giochi') {
        return await (await import('./menu-giochi.js')).default(message, { conn, usedPrefix });
  }

  const funzioni = {
    detect: '𝐝𝐞𝐭𝐞𝐜𝐭',
    benvenuto: '𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨',
    bestemmiometro: '𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨',
    soloadmin: '𝐬𝐨𝐥𝐨𝐚𝐝𝐦𝐢𝐧',
    soloviewonce: '𝐬𝐨𝐥𝐨𝐯𝐢𝐞𝐰𝐨𝐧𝐜𝐞',
    antispam: '𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦',
    antisondaggi: '𝐚𝐧𝐭𝐢𝐬𝐨𝐧𝐝𝐚𝐠𝐠𝐢',
    antigiochi: '𝐚𝐧𝐭𝐢𝐠𝐢𝐨𝐜𝐡𝐢',
    antitrava: '𝐚𝐧𝐭𝐢𝐭𝐫𝐚𝐯𝐚',
    antinuke: '𝐚𝐧𝐭𝐢𝐧𝐮𝐤𝐞',
    antivoip: '𝐚𝐧𝐭𝐢𝐯𝐨𝐢𝐩',
    antilink: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤',
    antilinktotale: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐭𝐨𝐭𝐚𝐥𝐞',
    antiinsta: '𝐚𝐧𝐭𝐢𝐢𝐧𝐬𝐭𝐚',
    antitiktok: '𝐚𝐧𝐭𝐢𝐭𝐢𝐤𝐭𝐨𝐤',
    antitelegram: '𝐚𝐧𝐭𝐢𝐭𝐞𝐥𝐞𝐠𝐫𝐚𝐦'
  };

  let lines = Object.entries(funzioni).map(([key, name]) => {
    let stato = chatData[key];
    return `┃ ${stato ? '🟢' : '🔴'} » ${name}`;
  });

  let menuText = `
╭━━〔 *𝐌𝐄𝐍𝐔 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈* 〕━━╮
${lines.join('\n')}
╰━━━━━━━━━━━━━━━━━━━╯
╭━━━━━━━━━━━━━━━━━━━╮
┃ⓘ 𝐈𝐧𝐟𝐨 𝐬𝐮𝐥𝐥𝐞 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢:
┃🟢 » 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚
┃🔴 » 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚
┣━━━━━━━━━━━━━━━━━━━┫
┃ⓘ 𝐔𝐬𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
┃${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝟏 <𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐞>
┃${usedPrefix}𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚/𝟎 <𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐞>
╰━━━━━━━━━━━━━━━━━━━╯`.trim();

  // Invia il menu con i bottoni
  await conn.sendMessage(m.chat, {
    text: menuText,
    footer: 'Scegli un menu:',
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
      { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
      { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ Menu Mod" }, type: 1 },
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 Menu Owner" }, type: 1 },
      { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
      { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 Menu Giochi" }, type: 1 },
    ],
    viewOnce: true
  });
};

handler.help = ["funzioni", "menu", "admin", "owner", "gruppo"];
handler.tags = ["menu"];
handler.command = /^(funzioni|menu|admin|owner|gruppo)$/i;

export default handler;