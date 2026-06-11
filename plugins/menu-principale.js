// Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix }) => {

  const menuText = generateMenuText(usedPrefix);

  await conn.sendMessage(
    message.chat,
    {
      text: menuText,
      footer: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐦𝐞𝐧𝐮̀:',
      buttons: [
        { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
        { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
        { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝" }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢" }, type: 1 },
        { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨" }, type: 1 },
        { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢" }, type: 1 },
        { buttonId: `${usedPrefix}infobot`, buttonText: { displayText: "🤖 𝐈𝐧𝐟𝐨𝐛𝐨𝐭" }, type: 1 }
      ]
    },
    { quoted: message }
  );
};

handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(menu)$/i;

export default handler;

function generateMenuText(prefix) {
  return `
╭〔🤖𝑴𝑬𝑵𝑼 𝑫𝑬𝑳 𝑩𝑶𝑻🤖〕╮
┣━━━━━━━━━━━━━━━━━━
┃ 🛠𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝑮𝑬𝑵𝑬𝑹𝑨𝑳𝑰🛠
┣━━━━━━━━━━━━━━━━━━
┃ 👑 .𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻𝑨𝑹𝑰𝑶
┃ 🔱 .𝑶𝑾𝑵𝑬𝑹
┃ 🛡️ .𝑨𝑫𝑴𝑰𝑵
┃ 👮🏻‍♂️ .𝑴𝑶𝑫
┃ 🔧 .𝑭𝑼𝑵𝒁𝑰𝑶𝑵𝑰
┃ 👥 .𝑮𝑹𝑼𝑷𝑷𝑶
┃ 🎮 .𝑮𝑰𝑶𝑪𝑯𝑰
┃ 🤖 .𝑰𝑵𝑭𝑶𝑩𝑶𝑻
╰━━━━━━━━━━━━━━━━━╯
🤖 *𝑩𝒐𝒕:* ${nomebot}
🌟 *𝑽𝒆𝒓𝒔𝒊𝒐𝒏𝒆:* ${vs}
`.trim();
}