// Plugin fatto da Axtral_WiZaRd
const handler = async (message, { conn, usedPrefix }) => {
   
    const menuText = generateGiochiMenuText(usedPrefix);

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
                                    title: '𝐌𝐞𝐧𝐮̀',
                                    rows: [
                                        { title: '🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞', description: 'Torna al menu principale', id: `${usedPrefix}menu` },
                                        { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi membri', id: `${usedPrefix}gruppo` },
                                        { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi admin', id: `${usedPrefix}admin` },
                                        { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatori', id: `${usedPrefix}mod` },
                                        { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi gestione gruppo', id: `${usedPrefix}funzioni` },
                                        { title: '🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi proprietario', id: `${usedPrefix}owner` }
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
            { text: menuText },
            { quoted: message }
        );
    }
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
┃ 🎵 ${prefix}𝐢𝐜 — Indovina la canzone
┃ ✂️ ${prefix}𝐠𝐚𝐦𝐞 — Sasso/Carta/Forbice
┃ ❎ ${prefix}𝐭𝐫𝐢𝐬 — Gioco del tris
┃ 💰 ${prefix}𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨 — Controlla soldi
┃ 💼 ${prefix}𝐚𝐜𝐪𝐮𝐢𝐬𝐭𝐚 — Acquista messaggi
┃ 📈 ${prefix}𝐛𝐢𝐥𝐚𝐧𝐜𝐢𝐨 — Bilancio soldi del gruppo
╰━━━━━━━━━━━━━━━━━╯
🎮 *Totale giochi:* 11
𝐁𝐲 ${nomebot}
`.trim();
}