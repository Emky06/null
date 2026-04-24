// Plugin fatto da Axtral_WiZaRd
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
                    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                    { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢" }, type: 1 },
                    { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
                    { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝" }, type: 1 },
                    { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
                    { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢" }, type: 1 },
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
                                        { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Comandi per giochi e intrattenimento', id: `${usedPrefix}giochi` },
                                        { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi admin', id: `${usedPrefix}admin` },
                                        { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatori', id: `${usedPrefix}mod` },
                                        { title: '🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi proprietario', id: `${usedPrefix}owner` },
                                        { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi gestione gruppo', id: `${usedPrefix}funzioni` }
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

handler.help = ['gruppo'];
handler.tags = ['menu'];
handler.command = /^(gruppo)$/i;

export default handler;

function generateMenuText(prefix) {
    return `╭━━━〔 𝑴𝑬𝑵𝑼 𝑮𝑹𝑼𝑷𝑷𝑶 〕━━━╮
┣━━━━━━━━━━━━━━━━━━━━
┃🎮 *𝐆𝐈𝐎𝐂𝐇𝐈*  
┃
┃🎲 ${prefix}𝐢𝐦𝐩𝐢𝐜𝐜𝐚𝐭𝐨  
┃⚽ ${prefix}𝐜𝐚𝐥𝐜𝐢𝐨  
┃🎰 ${prefix}𝐬𝐥𝐨𝐭  
┃🎡 ${prefix}𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞  
┃🔫 ${prefix}𝐫𝐫 (𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞 𝐫𝐮𝐬𝐬𝐚)  
┃🪙 ${prefix}𝐦𝐨𝐧𝐞𝐭𝐚 (𝐭𝐞𝐬𝐭𝐚 𝐨 𝐜𝐫𝐨𝐜𝐞)     
┃🪙 ${prefix}𝐜𝐨𝐢𝐧𝐟𝐥𝐢𝐩 (𝐜𝐨𝐧 𝐛𝐨𝐭)
┃✌️ ${prefix}𝐠𝐚𝐦𝐞 𝐬𝐚𝐬𝐬𝐨/𝐜𝐚𝐫𝐭𝐚/𝐟𝐨𝐫𝐛𝐢𝐜𝐞  
┃🇮🇹 ${prefix}𝐛𝐚𝐧𝐝𝐢𝐞𝐫𝐚
┃📞 ${prefix}𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐨
┃🎵 ${prefix}𝐢𝐜
┃⭕ ${prefix}𝐭𝐫𝐢𝐬
┃🎲 ${prefix}𝐝𝐚𝐝𝐨  
┃😜 ${prefix}𝐞𝐦𝐨𝐣𝐢𝐦𝐢𝐱  
┃❓ ${prefix}𝐨𝐛𝐛𝐥𝐢𝐠𝐨/𝐯𝐞𝐫𝐢𝐭𝐚  
┃🍾 ${prefix}𝐛𝐨𝐭𝐭𝐢𝐠𝐥𝐢𝐚    
┃📊 ${prefix}𝐝𝐚𝐭𝐢
┣━━━━━━━━━━━━━━━━━━━━
┃🤝 *𝐈𝐍𝐓𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐈*  
┃
┃🤗 ${prefix}𝐚𝐛𝐛𝐫𝐚𝐜𝐜𝐢𝐚 @  
┃🦷 ${prefix}𝐦𝐨𝐫𝐝𝐢 @  
┃🔨 ${prefix}𝐛𝐨𝐧𝐤 @  
┃💞 ${prefix}𝐜𝐫𝐞𝐚𝐜𝐨𝐩𝐩𝐢𝐚  
┃❤️ ${prefix}𝐚𝐦𝐨𝐫𝐞 @  
┃💔 ${prefix}𝐨𝐝𝐢𝐨 @  
┃😍 ${prefix}𝐜𝐫𝐮𝐬𝐡 @  
┃💍 ${prefix}𝐬𝐩𝐨𝐬𝐚 @  
┃💔 ${prefix}𝐝𝐢𝐯𝐨𝐫𝐳𝐢𝐚
┃👫 ${prefix}𝐚𝐦𝐢𝐜𝐢𝐳𝐢𝐚 @  
┃📜 ${prefix}𝐥𝐢𝐬𝐭𝐚𝐦𝐢𝐜𝐢  
┃🦊 ${prefix}𝐫𝐮𝐛𝐚  
┣━━━━━━━━━━━━━━━━━━━━
┃🎵 *𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈 𝐕𝐀𝐑𝐈𝐄*  
┃
┃🛡️ ${prefix}𝐚𝐝𝐦𝐢𝐧𝐬
┃👮🏻‍♂️ ${prefix}𝐦𝐨𝐝𝐬
┃👥 ${prefix}𝐬𝐭𝐚𝐟𝐟
┃🎧 ${prefix}𝐚𝐮𝐝𝐢𝐨
┃🎧 ${prefix}𝐜𝐮𝐫  
┃🔄 ${prefix}𝐫𝐞𝐯𝐞𝐫𝐬𝐞  
┃🔄 ${prefix}𝐫𝐞𝐯𝐞𝐫𝐬𝐞𝐯𝐢𝐝
┃⏩ ${prefix}𝐬𝐩𝐞𝐞𝐝𝐯𝐢𝐝𝐞𝐨
┃🎶 ${prefix}𝐩𝐥𝐚𝐲  
┃🎥 ${prefix}𝐝𝐥𝐝𝐭𝐢𝐤𝐭𝐨𝐤
┃🎥 ${prefix}𝐝𝐥𝐝𝐢𝐠
┃ⓘ  ${prefix}𝐢𝐧𝐟𝐨  
┃🌦️ ${prefix}𝐦𝐞𝐭𝐞𝐨 (𝐜𝐢𝐭𝐭𝐚̀)  
┃🎥 ${prefix}𝐭𝐨𝐯𝐢𝐝𝐞𝐨  
┃🖼️ ${prefix}𝐭𝐨𝐠𝐢𝐟  
┃📷 ${prefix}𝐭𝐨𝐢𝐦𝐠
┃⚙️ ${prefix}𝐬𝐞𝐭𝐢𝐠  
┃📝 ${prefix}𝐫𝐞𝐠  
┃📖 ${prefix}𝐫𝐞𝐠𝐨𝐥𝐞
┣━━━━━━━━━━━━━━━━━━━━
┃🏆 *𝐓𝐎𝐏𝐒*  
┃
┃🤬 ${prefix}𝐭𝐨𝐩𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞
┃🏁 ${prefix}𝐭𝐨𝐩𝐛𝐚𝐧𝐝𝐢𝐞𝐫𝐞
┃👥 ${prefix}𝐭𝐨𝐩𝐠𝐫𝐮𝐩𝐩𝐢
┃👥 ${prefix}𝐭𝐨𝐩𝐮𝐭𝐞𝐧𝐭𝐢
┃🗓️ ${prefix}𝐝𝐚𝐢𝐥𝐲𝐭𝐨𝐩
┣━━━━━━━━━━━━━━━━━━━━
┃💼 *𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀*  
┃
┃👛 ${prefix}𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨  
┃🏦 ${prefix}𝐝𝐞𝐩𝐨𝐬𝐢𝐭𝐚  
┃🏧 ${prefix}𝐩𝐫𝐞𝐥𝐞𝐯𝐚
┃👷 ${prefix}𝐥𝐚𝐯𝐨𝐫𝐨  
┃💸 ${prefix}𝐩𝐚𝐠𝐡𝐞𝐭𝐭𝐚  
┣━━━━━━━━━━━━━━━━━━━━
┃🧸 *𝐑𝐏𝐆*  
┃
┃🏪 ${prefix}𝐩𝐞𝐭𝐬𝐡𝐨𝐩
┃🐾 ${prefix}𝐩𝐞𝐭
┃💰 ${prefix}𝐚𝐜𝐪𝐮𝐢𝐬𝐭𝐚 (𝐦𝐬𝐠)  
┃👨‍👩‍👧‍👦 ${prefix}𝐟𝐚𝐦𝐢𝐠𝐥𝐢𝐚  
┃👶🏾 ${prefix}𝐚𝐝𝐨𝐭𝐭𝐚  
┣━━━━━━━━━━━━━━━━━━━━
┃🔞 *+18*  
┃
┃✊ ${prefix}𝐬𝐞𝐠𝐚 @  
┃👉 ${prefix}𝐝𝐢𝐭𝐚𝐥𝐢𝐧𝐨 @  
┃👄 ${prefix}𝐩𝐨𝐦𝐩𝐢𝐧𝐚𝐫𝐚 @  
┃💦 ${prefix}𝐬𝐛𝐨𝐫𝐫𝐚 @  
┃🍒 ${prefix}𝐭𝐞𝐭𝐭𝐞 @  
┃🍑 ${prefix}𝐜𝐮𝐥𝐨 @  
┃🌸 ${prefix}𝐟𝐢𝐠𝐚 @  
┃🍆 ${prefix}𝐩𝐞𝐧𝐞 @  
┃🚫 ${prefix}𝐬𝐭𝐮𝐩𝐫𝐚 @  
┃🔥 ${prefix}𝐬𝐜𝐨𝐩𝐚 @
┃⚧️ ${prefix}𝐭𝐫𝐚𝐧𝐬 @  
┃🔥 ${prefix}𝐨𝐫𝐠𝐢𝐚  
┃😛 ${prefix}𝐥𝐞𝐜𝐜𝐨/𝐚 @
┣━━━━━━━━━━━━━━━━━━━━
┃😂 *𝐈𝐍𝐒𝐔𝐋𝐓𝐈 / 𝐌𝐄𝐌𝐄*  
┃
┃😡 ${prefix}𝐢𝐧𝐬𝐮𝐥𝐭𝐚 @  
┃🕵️ ${prefix}𝐝𝐨𝐱 @  
┃♿ ${prefix}𝟏𝟎𝟒 @  
┃🤪 ${prefix}𝐫𝐢𝐧𝐜𝐨𝐠𝐥𝐢𝐨𝐧𝐢𝐭𝐨 @  
┃🏳️‍🌈 ${prefix}𝐠𝐚𝐲/𝐟𝐫𝐨𝐜𝐢𝐨 @  
┃🏳️‍🌈 ${prefix}𝐥𝐞𝐬𝐛𝐢𝐜𝐚 @  
┃🛵 ${prefix}𝐭𝐞𝐫𝐫𝐨𝐧𝐞/𝐚 @  
┃🥟 ${prefix}𝐩𝐨𝐥𝐞𝐧𝐭𝐨𝐧𝐞/𝐚 @  
┃🤡 ${prefix}𝐜𝐥𝐨𝐰𝐧 @  
┃🔪 ${prefix}𝐜𝐫𝐢𝐦𝐢𝐧𝐚𝐥𝐞 @  
┃🍷 ${prefix}𝐚𝐥𝐜𝐨𝐥𝐢𝐳𝐳𝐚𝐭𝐨 @  
┃💉 ${prefix}𝐝𝐫𝐨𝐠𝐚𝐭𝐨 @  
┃࿖  ${prefix}𝐧𝐚𝐳𝐢𝐬𝐭𝐚 @  
┃🚩 ${prefix}𝐜𝐨𝐦𝐮𝐧𝐢𝐬𝐭𝐚 @  
┃🔫 ${prefix}𝐦𝐢𝐫𝐚 @  
┃🔥 ${prefix}𝐬𝐚𝐲𝐚𝐧
┃🧚 ${prefix}𝐰𝐢𝐧𝐱 @
┃✨ ${prefix}𝐛𝐞𝐥𝐥𝐨/𝐚 @  
┃⚫ ${prefix}𝐧𝐞𝐫𝐨/𝐚 @  
┃⛓️ ${prefix}𝐣𝐚𝐢𝐥
┃⛓️ ${prefix}𝐣𝐚𝐢𝐥𝐩𝐢𝐜
┃💰 ${prefix}𝐰𝐚𝐧𝐭𝐞𝐝
┣━━━━━━━━━━━━━━━━━━━━
┃🍔 *𝐂𝐈𝐁𝐎*  
┃
┃🥙 ${prefix}𝐤𝐞𝐛𝐚𝐛 @  
┃🍔 ${prefix}𝐡𝐚𝐦𝐛𝐮𝐫𝐠𝐞𝐫 @  
┃🍕 ${prefix}𝐩𝐢𝐳𝐳𝐚 @  
┃🍣 ${prefix}𝐬𝐮𝐬𝐡𝐢 @   
╰━━━━━━━━━━━━━━━━━━━╯`;
}
