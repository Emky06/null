//Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix }) => {
  const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

  const menuText = generateMenuText(usedPrefix, botName);

  await conn.sendMessage(
    message.chat,
    {
      text: menuText,
      interactiveButtons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📝 𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐮𝐧 𝐦𝐞𝐧𝐮̀',
            sections: [
              {
                title: '𝐌𝐞𝐧𝐮̀',
                rows: [
                  { title: '👑 𝐏𝐫𝐨𝐩𝐫𝐢𝐞𝐭𝐚𝐫𝐢𝐨', description: 'Comandi del proprietario', id: `${usedPrefix}proprietario` },
                  { title: '🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi proprietario', id: `${usedPrefix}owner` },
                  { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi amministratore', id: `${usedPrefix}admin` },
                  { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatore', id: `${usedPrefix}mod` },
                  { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi generali e utilità', id: `${usedPrefix}funzioni` },
                  { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi per la gestione dei gruppi', id: `${usedPrefix}gruppo` },
                  { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Comandi per giochi e intrattenimento', id: `${usedPrefix}giochi` },
                  { title: '📞 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐨', description: 'Richiedi supporto', id: `${usedPrefix}supporto` },
                  { title: '🤖 𝐈𝐧𝐟𝐨𝐛𝐨𝐭', description: 'Info sul bot', id: `${usedPrefix}infobot` }
                ]
              }
            ]
          })
        }
      ]
    },
    { quoted: message }
  );
};

handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(menu)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
  const vs = '2.0';

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
┃ 📞 .𝑺𝑼𝑷𝑷𝑶𝑹𝑻𝑶
┃ 🤖 .𝑰𝑵𝑭𝑶𝑩𝑶𝑻
╰━━━━━━━━━━━━━━━━━╯
🤖 *𝑩𝒐𝒕*: ${botName}
🌟 *𝑽𝒆𝒓𝒔𝒊𝒐𝒏𝒆:* ${vs}
`.trim();
}