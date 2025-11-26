// Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix }) => {
  
  const menuText = generateMenuText(usedPrefix);


  const msgID = message.id || message.key?.id;
  let device = 'Dispositivo sconosciuto 🕵️‍♂️';

  if (!msgID) {
    device = '⚠️ Impossibile rilevare il dispositivo';
  } else if (/^[a-zA-Z]+-[a-fA-F0-9]+$/.test(msgID)) {
    device = '🤖 Messaggio da bot';
  } else if (msgID.startsWith('false_') || msgID.startsWith('true_')) {
    device = '💻 WhatsApp Web';
  } else if (msgID.startsWith('3EB0') && /^[A-Z0-9]+$/.test(msgID)) {
    device = '💻 WhatsApp Web o bot';
  } else if (msgID.includes(':')) {
    device = '🖥️ WhatsApp Desktop';
  } else if (/^[A-F0-9]{32}$/i.test(msgID)) {
    device = '📱 Android';
  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msgID)) {
    device = '🍏 iOS';
  } else if (/^[A-Z0-9]{20,25}$/i.test(msgID) && !msgID.startsWith('3EB0')) {
    device = '🍏 iOS';
  } else if (msgID.startsWith('3EB0')) {
    device = '🤖 Android (vecchio schema)';
  } else {
    device = 'Dispositivo sconosciuto 🕵️‍♂️';
    console.log('[ANALISI] Nuovo ID non riconosciuto:', msgID);
  }


  if (device.includes('iOS')) {
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
        ]
      },
      { quoted: message }
    );
  } else if (device.includes('Android') || device.includes('Web')) {

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
                  title: '𝐌𝐞𝐧𝐮̀ 𝐃𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢',
                  rows: [
                    { title: '🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi proprietario', id: `${usedPrefix}owner` },
                    { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi admin', id: `${usedPrefix}admin` },
                    { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatori', id: `${usedPrefix}mod` },
                    { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Gestione gruppo', id: `${usedPrefix}funzioni` },
                    { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi membri', id: `${usedPrefix}gruppo` },
                    { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Giochi e intrattenimento', id: `${usedPrefix}giochi` },
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
  } else {

  await conn.sendMessage(
    message.chat,
    {
      text: menuText,
    },
    { quoted: message }
  );
}
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
🌟 *𝑽𝒆𝒓𝒔𝒊𝒐𝒏𝒆: ${vs}*
`.trim();
}