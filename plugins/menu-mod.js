//Plugin fatto da Axtral_WiZaRd
const handler = async (message, { conn, usedPrefix }) => {
  const userCount = Object.keys(global.db.data.users).length;
  const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

  const menuText = generateModMenuText(usedPrefix, botName, userCount);

  await conn.sendMessage(message.chat, {
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
                { title: '🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞', description: 'Torna al menu principale', id: `${usedPrefix}menu` },
                { title: '🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi proprietario', id: `${usedPrefix}owner` },
                { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi admin', id: `${usedPrefix}admin` },
                { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi gestione gruppo', id: `${usedPrefix}funzioni` },
                { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi membri', id: `${usedPrefix}gruppo` },
                { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Comandi giochi e intrattenimento', id: `${usedPrefix}giochi` }
              ]
            }
          ]
        })
      }
    ]
  });
};

handler.help = ['mod'];
handler.tags = ['menu'];
handler.command = /^mod$/i;

export default handler;

function generateModMenuText(prefix, botName, userCount) {
  return `
╭━〔 𝑴𝑬𝑵𝑼 𝑴𝑶𝑫𝑬𝑹𝑨𝑻𝑶𝑹𝐈 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 🔇 ${prefix}𝐦𝐮𝐭𝐨/𝐬𝐦𝐮𝐭𝐨 — Muta/smuta utenti
┃ 📝 ${prefix}𝐦𝐮𝐭𝐚𝐭𝐢 — Lista utenti mutati
┃ 🖼️ ${prefix}𝐟𝐨𝐭𝐨 — Prendi foto profilo
┃ 👥 ${prefix}𝐭𝐨𝐭𝐚𝐠 — Hidetag/tag
┃ ⚠️ ${prefix}𝐚𝐥𝐞𝐫𝐭/𝐫𝐞𝐯𝐨𝐤𝐞 — Dai/togli warn
┃  ✓   ${prefix}𝐳𝐞𝐫𝐨𝐰𝐚𝐫𝐧 — Azzera warn
┃ ⏱️ ${prefix}𝐬𝐢𝐥𝐞𝐧𝐜𝐞 — Muto temporaneo 
┃ 🗑️ ${prefix}𝐝𝐞𝐥𝐥 — Elimina messaggi
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤𝐠𝐩 — Link gruppo
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤𝐪 — QR del gruppo 
┃ 👁️ ${prefix}𝐫𝐢𝐯 — Rivela media
┃ 🔒 ${prefix}𝐜𝐡𝐢𝐮𝐬𝐨𝐭𝐞𝐦𝐩 — Chiudi chat per tot min
╰━━━━━━━━━━━━━━━━━━━╯
🤖 𝐁𝐨𝐭: ${botName}
`.trim();
}