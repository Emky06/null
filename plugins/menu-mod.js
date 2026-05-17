// Plugin fatto da Axtral_WiZaRd
const handler = async (message, { conn, usedPrefix }) => {
    
    const menuText = generateModMenuText(usedPrefix);

    await conn.sendMessage(
        message.chat,
        {
            text: menuText,
            footer: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐦𝐞𝐧𝐮̀:',
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
                { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
                { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢" }, type: 1 },
                { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨" }, type: 1 },
                { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢" }, type: 1 }
            ]
        },
        { quoted: message }
    );
};

handler.help = ['mod'];
handler.tags = ['menu'];
handler.command = /^mod$/i;

export default handler;

function generateModMenuText(prefix) {
    return `
╭━〔 𝑴𝑬𝑵𝑼 𝑴𝑶𝑫𝑬𝑹𝑨𝑻𝑶𝑹𝑰 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 🔇 ${prefix}𝐦𝐮𝐭𝐨/𝐬𝐦𝐮𝐭𝐨 — Muta/smuta utenti
┃ 📝 ${prefix}𝐦𝐮𝐭𝐚𝐭𝐢 — Lista utenti mutati
┃ 📝 ${prefix}𝐥𝐢𝐬𝐭𝐚𝐰𝐚𝐫𝐧 — Lista utenti con warn
┃ 🖼️ ${prefix}𝐟𝐨𝐭𝐨 — Prendi foto profilo
┃ 📷 ${prefix}𝐟𝐩 — Foto utente esterno
┃ 👥 ${prefix}𝐭𝐨𝐭𝐚𝐠 — Tagga tutti gli utenti
┃ ⏱️ ${prefix}𝐜𝐨𝐮𝐧𝐭𝐝𝐨𝐰𝐧 — Tag con timer
┃ ⚠️ ${prefix}𝐚𝐥𝐞𝐫𝐭/𝐫𝐞𝐯𝐨𝐤𝐞 — Aggiungi/rimuovi warn
┃  ✓   ${prefix}𝐚𝐳𝐳𝐞𝐫𝐚𝐰𝐚𝐫𝐧 — Azzera warn
┃ 📤 ${prefix}𝐞𝐬𝐩𝐞𝐥𝐥𝐢 — Espelli membri
┃ 📥 ${prefix}𝐫𝐞𝐪𝐮𝐞𝐬𝐭/𝐩𝐫𝐨𝐟𝐢𝐥𝐢 — Richieste
┃ ⏱️ ${prefix}𝐬𝐢𝐥𝐞𝐧𝐜𝐞 — Muto temporaneo 
┃ 🗑️ ${prefix}𝐝𝐞𝐥 — Elimina messaggi
┃ 📌 ${prefix}𝐩𝐢𝐧/𝐮𝐧𝐩𝐢𝐧 — Fissa/rimuovi messaggi
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤 — Link gruppo
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤𝐠 — Link gruppo
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤𝐪𝐫 — QR del gruppo 
┃ 👁️ ${prefix}𝐫𝐢𝐯𝐞𝐥𝐚 — Rivela media
┃ 🔒 ${prefix}𝐜𝐡𝐢𝐮𝐬𝐨𝐭𝐞𝐦𝐩 — Chiudi chat per tot min
┃ 🔒 ${prefix}𝐫𝐞𝐦𝐨𝐭𝐞𝐠𝐩/𝐫𝐠𝐩 — Chiudi/apri gruppo a distanza con id
╰━━━━━━━━━━━━━━━━━━━╯
*𝐁𝐲* ${nomebot}
`.trim();
}