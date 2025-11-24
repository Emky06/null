// Plugin fatto da Axtral_WiZaRd
const handler = async (message, { conn, usedPrefix }) => {
    
    const menuText = generateModMenuText(usedPrefix);

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
                    { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
                    { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
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

handler.help = ['mod'];
handler.tags = ['menu'];
handler.command = /^mod$/i;

export default handler;

function generateModMenuText(prefix) {
    return `
╭━〔 𝑴𝑬𝑵𝑼 𝑴𝑶𝑫𝑬𝑹𝑨𝑻𝑶𝑹𝐈 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 🔇 ${prefix}𝐦𝐮𝐭𝐨/𝐬𝐦𝐮𝐭𝐨 — Muta/smuta utenti
┃ 📝 ${prefix}𝐦𝐮𝐭𝐚𝐭𝐢 — Lista utenti mutati
┃ 🖼️ ${prefix}𝐟𝐨𝐭𝐨 — Prendi foto profilo
┃ 👥 ${prefix}𝐭𝐨𝐭𝐚𝐠 — Hidetag/tag
┃ ⚠️ ${prefix}𝐚𝐥𝐞𝐫𝐭/𝐫𝐞𝐯𝐨𝐤𝐞 — Dai/togli warn
┃  ✓   ${prefix}𝐚𝐳𝐳𝐞𝐫𝐚𝐰𝐚𝐫𝐧 — Azzera warn
┃ ⏱️ ${prefix}𝐬𝐢𝐥𝐞𝐧𝐜𝐞 — Muto temporaneo 
┃ 🗑️ ${prefix}𝐝𝐞𝐥𝐥 — Elimina messaggi
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤𝐠𝐩 — Link gruppo
┃ 🔗 ${prefix}𝐥𝐢𝐧𝐤𝐪 — QR del gruppo 
┃ 👁️ ${prefix}𝐫𝐢𝐯 — Rivela media
┃ 🔒 ${prefix}𝐜𝐡𝐢𝐮𝐬𝐨𝐭𝐞𝐦𝐩 — Chiudi chat per tot min
╰━━━━━━━━━━━━━━━━━━━╯
𝑩𝒀 ${nomebot}
`.trim();
}