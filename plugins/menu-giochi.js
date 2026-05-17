// Plugin fatto da Axtral_WiZaRd
const handler = async (message, { conn, usedPrefix }) => {

    const menuText = generateGiochiMenuText(usedPrefix);

    await conn.sendMessage(
        message.chat,
        {
            text: menuText,
            footer: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐦𝐞𝐧𝐮̀:',
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨" }, type: 1 },
                { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
                { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝" }, type: 1 },
                { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢" }, type: 1 },
                { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
            ]
        },
        { quoted: message }
    );
};

handler.help = ['giochi'];
handler.tags = ['menu'];
handler.command = /^giochi$/i;

export default handler;

function generateGiochiMenuText(prefix) {
    return `
╭〔🎮 𝑴𝑬𝑵𝑼 𝑮𝑰𝑶𝑪𝑯𝑰 🎮〕╮
┣━━━━━━━━━━━━━━━━━━
┃ 🎲 ${prefix}𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞 — Classica
┃ 🔫 ${prefix}𝐫𝐫 — Roulette Russa
┃ 🪙 ${prefix}𝐦𝐨𝐧𝐞𝐭𝐚 — Testa o Croce
┃ 🪙 ${prefix}𝐜𝐨𝐢𝐧𝐟𝐥𝐢𝐩 — Testa o Croce (con il bot)
┃ 🎰 ${prefix}𝐬𝐥𝐨𝐭 — Slot Machine
┃ ⚽ ${prefix}𝐜𝐚𝐥𝐜𝐢𝐨 — Scommesse di calcio
┃ 😵 ${prefix}𝐢𝐦𝐩𝐢𝐜𝐜𝐚𝐭𝐨 — Gioco dell'impiccato
┃ 🇮🇹 ${prefix}𝐛𝐚𝐧𝐝𝐢𝐞𝐫𝐚 — Indovina la bandiera
┃ 📞 ${prefix}𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐨 — Indovina il prefisso
┃ 🎵 ${prefix}𝐢𝐜 — Indovina la canzone
┃ ✂️ ${prefix}𝐠𝐚𝐦𝐞 — Sasso/Carta/Forbice
┃ ❎ ${prefix}𝐭𝐫𝐢𝐬 — Gioco del tris
┃ 📊 ${prefix}𝐝𝐚𝐭𝐢 — Statistiche dei giochi
┃ 💰 ${prefix}𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨 — Controlla soldi
┃ 💼 ${prefix}𝐚𝐜𝐪𝐮𝐢𝐬𝐭𝐚 — Acquista messaggi
┃ 📈 ${prefix}𝐛𝐢𝐥𝐚𝐧𝐜𝐢𝐨 — Bilancio soldi del gruppo
╰━━━━━━━━━━━━━━━━━╯
🎮 *𝐓𝐨𝐭𝐚𝐥𝐞 𝐠𝐢𝐨𝐜𝐡𝐢: 𝟏𝟐*
*𝐁𝐲* ${nomebot}
`.trim();
}