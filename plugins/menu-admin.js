// Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix, command }) => {
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
                    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                    { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
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
                                    title: '𝐌𝐞𝐧𝐮̀',
                                rows: [
                                    { title: '🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞', description: 'Torna al menu principale', id: `${usedPrefix}menu` },
                                    { title: '👑 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi del proprietario', id: `${usedPrefix}owner` },
                                    { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatori', id: `${usedPrefix}mod` },
                                    { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi gestione gruppo', id: `${usedPrefix}funzioni` },
                                    { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi membri', id: `${usedPrefix}gruppo` },
                                    { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Comandi per giochi e intrattenimento', id: `${usedPrefix}giochi` }
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

handler.help = ['admin'];
handler.tags = ['menuadmin'];
handler.command = /^(admin)$/i;

export default handler;

function generateMenuText(prefix) {
        return `
╭━━━〔 𝑴𝑬𝑵𝑼 𝑨𝑫𝑴𝑰𝑵 〕━━━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 🎯 *𝑪𝒐𝒎𝒂𝒏𝒅𝒊 𝑴𝒐𝒅𝒆𝒓𝒂𝒛𝒊𝒐𝒏𝒆*
┃
┃🛡️ .𝐩𝐫𝐨𝐦𝐮𝐨𝐯𝐢 / .𝐩 — 𝐏𝐫𝐨𝐦𝐮𝐨𝐯𝐞 𝐮𝐭𝐞𝐧𝐭𝐢
┃🛡️ .𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐝𝐢 / .𝐫 — 𝐑𝐞𝐭𝐫𝐨𝐜𝐞𝐝𝐞 𝐮𝐭𝐞𝐧𝐭𝐢
┃🛡️ .𝐰𝐚𝐫𝐧 / .𝐮𝐧𝐰𝐚𝐫𝐧 — 𝐀𝐠𝐠𝐢𝐮𝐧𝐠𝐞/𝐫𝐢𝐦𝐮𝐨𝐯𝐞 𝐰𝐚𝐫𝐧
┃🛡️ .𝐫𝐞𝐬𝐞𝐭𝐰𝐚𝐫𝐧 — 𝐀𝐳𝐳𝐞𝐫𝐚 𝐰𝐚𝐫𝐧
┃🛡️ .𝐦𝐮𝐭𝐚 / .𝐬𝐦𝐮𝐭𝐚 — 𝐌𝐮𝐭𝐚/𝐬𝐦𝐮𝐭𝐚 𝐮𝐭𝐞𝐧𝐭𝐢
┃🛡️ .𝐦𝐮𝐭𝐚𝐭𝐢 — 𝐋𝐢𝐬𝐭𝐚 𝐮𝐭𝐞𝐧𝐭𝐢 𝐦𝐮𝐭𝐚𝐭𝐢
┃🛡️ .𝐥𝐢𝐬𝐭𝐚𝐰𝐚𝐫𝐧 — 𝐋𝐢𝐬𝐭𝐚 𝐰𝐚𝐫𝐧
┃🛡️ .𝐝𝐞𝐥 — 𝐄𝐥𝐢𝐦𝐢𝐧𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢
┣━━━━━━━━━━━━━━━━━━━━
┃ 👥 *𝑮𝒆𝒔𝒕𝒊𝒐𝒏𝒆 𝑻𝒂𝒈 & 𝑮𝒓𝒖𝒑𝒑𝒊*
┃
┃📢 .𝐭𝐚𝐠 — 𝐓𝐚𝐠 𝐮𝐭𝐞𝐧𝐭𝐢
┃📢 .𝐭𝐚𝐠𝐚𝐥𝐥 — 𝐓𝐚𝐠 𝐭𝐮𝐭𝐭𝐢
┃⏱️ .𝐜𝐨𝐮𝐧𝐭𝐝𝐨𝐰𝐧 — 𝐓𝐚𝐠 𝐜𝐨𝐧 𝐭𝐢𝐦𝐞𝐫
┃🔓 .𝐜𝐥𝐨𝐬𝐞𝐭𝐢𝐦𝐞 — 𝐂𝐡𝐢𝐮𝐬𝐮𝐫𝐚 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐧𝐞𝐚
┃🔓 .𝐚𝐩𝐞𝐫𝐭𝐨 / .𝐜𝐡𝐢𝐮𝐬𝐨 — 𝐆𝐫𝐮𝐩𝐩𝐨 𝐚𝐩𝐞𝐫𝐭𝐨/𝐜𝐡𝐢𝐮𝐬𝐨
┃🔁 .𝐫𝐞𝐦𝐨𝐭𝐞𝐠𝐩 / .𝐫𝐠𝐩 — 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 𝐝𝐚 𝐫𝐞𝐦𝐨𝐭𝐨
┃📜 .𝐫𝐞𝐠𝐨𝐥𝐞 / .𝐫𝐮𝐥𝐞𝐬 — 𝐑𝐞𝐠𝐨𝐥𝐞 𝐠𝐫𝐮𝐩𝐩𝐨
┣━━━━━━━━━━━━━━━━━━━━
┃ 📥 *𝑴𝒆𝒔𝒔𝒂𝒈𝒈𝒊 𝑨𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒊*
┃
┃🎉 .𝐬𝐞𝐭𝐰𝐞𝐥𝐜𝐨𝐦𝐞 — 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐰𝐞𝐥𝐜𝐨𝐦𝐞
┃🥀 .𝐬𝐞𝐭𝐛𝐲𝐞 — 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐛𝐲𝐞
┃🎲 .𝐬𝐢𝐦 — 𝐒𝐢𝐦𝐮𝐥𝐚𝐳𝐢𝐨𝐧𝐞
┣━━━━━━━━━━━━━━━━━━━━
┃ 📊 *𝑮𝒆𝒔𝒕𝒊𝒐𝒏𝒆 𝑮𝒓𝒖𝒑𝒑𝒐*
┃
┃👻 .𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢 — 𝐔𝐭𝐞𝐧𝐭𝐢 𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢
┃🚪 .𝐯𝐢𝐚𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢 — 𝐑𝐢𝐦𝐨𝐳𝐢𝐨 𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢
┃📥 .𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 / .𝐫𝐞𝐪𝐮𝐞𝐬𝐭 — 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 𝐮𝐭𝐞𝐧𝐭𝐢
┣━━━━━━━━━━━━━━━━━━━━
┃ 🧊 *𝑬𝒙𝒕𝒓𝒂 𝑨𝒅𝒎𝒊𝒏 𝑻𝒐𝒐𝒍𝒔*
┃
┃❄️ .𝐟𝐫𝐞𝐞𝐳𝐞 — 𝐅𝐫𝐞𝐞𝐳𝐚 𝐮𝐭𝐞𝐧𝐭𝐞
┃👁️ .𝐫𝐢𝐯𝐞𝐥𝐚 — 𝐑𝐢𝐯𝐞𝐥𝐚 𝐦𝐞𝐝𝐢𝐚
┃🔗 .𝐥𝐢𝐧𝐤 / .𝐥𝐢𝐧𝐤𝐠 — 𝐋𝐢𝐧𝐤 𝐠𝐫𝐮𝐩𝐩𝐨
┃🔗 .𝐥𝐢𝐧𝐤𝐪𝐫 — 𝐐𝐑 𝐠𝐫𝐮𝐩𝐩𝐨
┃🔁 .𝐫𝐞𝐢𝐦𝐩𝐨𝐬𝐭𝐚 — 𝐑𝐢𝐠𝐞𝐧𝐞𝐫𝐚 𝐥𝐢𝐧𝐤
┣━━━━━━━━━━━━━━━━━━━━
┃ 🖼️ *𝑭𝒐𝒕𝒐 & 𝑰𝒏𝒇𝒐*
┃
┃📷 .𝐩𝐢𝐜 — 𝐅𝐨𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞
┃📷 .𝐟𝐩 — 𝐅𝐨𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐞𝐬𝐭𝐞𝐫𝐧𝐨
┃🖼️ .𝐩𝐢𝐜𝐠𝐫𝐮𝐩𝐩𝐨 — 𝐅𝐨𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨
┃📋 .𝐛𝐢𝐨 — 𝐂𝐚𝐦𝐛𝐢𝐚 𝐛𝐢𝐨
┃✍️ .𝐧𝐨𝐦𝐞 — 𝐂𝐚𝐦𝐛𝐢𝐚 𝐧𝐨𝐦𝐞
┣━━━━━━━━━━━━━━━━━━━━
┃ 🎉 *𝑪𝒐𝒎𝒂𝒏𝒅𝒊 𝑭𝒖𝒏*
┃
┃🏆 .𝐭𝐨𝐩 — 𝐂𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐜𝐡𝐞
┃💋 .𝐭𝐨𝐩𝐬𝐞𝐱𝐲 — 𝐓𝐨𝐩 𝐬𝐞𝐱𝐲
┃🍑 .𝐭𝐨𝐩𝐭𝐫𝐨𝐢𝐞 — 𝐓𝐨𝐩 𝐮𝐭𝐞𝐧𝐭𝐢
┃🏳️‍🌈 .𝐭𝐨𝐩𝐥𝐠𝐛𝐭 — 𝐓𝐨𝐩 𝐋𝐆𝐁𝐓
┃࿖  .𝐭𝐨𝐩𝐧𝐚𝐳𝐢 — 𝐓𝐨𝐩 𝐜𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐜𝐚
╰━━━━━━━━━━━━━━━━━━━╯
*𝐁𝐲* ${nomebot}
`.trim();
}