const handler = async (message, { conn, usedPrefix, command }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

    if (command === 'menu') {
        return await (await import('./menu-principale.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'giochi') {
        return await (await import('./menu-giochi.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'admin') {
        return await (await import('./menu-admin.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'mod') {
        return await (await import('./menu-mod')).default(message, { conn, usedPrefix });
    }
    if (command === 'owner') {
        return await (await import('./menu-owner.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'funzioni') {
        return await (await import('./menu-funzioni.js')).default(message, { conn, usedPrefix });
    }

    const menuText = generateMenuText(usedPrefix, botName, userCount);

    await conn.sendMessage(
        message.chat,
        {
            text: menuText,
            footer: 'Scegli un menu:',
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
                { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 Menu Giochi" }, type: 1 },
                { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
                { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ Menu Mod" }, type: 1 },
                { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 Menu Owner" }, type: 1 },
                { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 Menu Funzioni" }, type: 1 }
            ],
            viewOnce: true,
        }
    );
};

async function fetchProfilePictureUrl(conn, sender) {
    try {
        return await conn.profilePictureUrl(sender);
    } catch (error) {
        return 'default-profile-picture-url'; // Fallback URL in caso di errore
    }
}

handler.help = ['gruppo', 'menu', 'admin', 'owner', 'funzioni'];
handler.tags = ['gruppo'];
handler.command = /^(gruppo|menu|admin|owner|funzioni)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
    return `
╔═══════════════════╗
║         👥 *𝐆𝐫𝐮𝐩𝐩𝐨 𝐌𝐞𝐧𝐮* 👥      ║
╚═══════════════════╝
╭━━━━━━━━━━━━━━━━━━━╮
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
┃🎵 ${prefix}𝐢𝐜
┃⭕ ${prefix}𝐭𝐫𝐢𝐬
┃🎲 ${prefix}𝐝𝐚𝐝𝐨  
┃😜 ${prefix}𝐞𝐦𝐨𝐣𝐢𝐦𝐢𝐱  
┃❓ ${prefix}𝐨𝐛𝐛𝐥𝐢𝐠𝐨/𝐯𝐞𝐫𝐢𝐭𝐚  
┃🍾 ${prefix}𝐛𝐨𝐭𝐭𝐢𝐠𝐥𝐢𝐚    
┣━━━━━━━━━━━━━━━━━━━━
┃🤝 *𝐈𝐍𝐓𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐈*  
┃
┃🤗 ${prefix}𝐚𝐛𝐛𝐫𝐚𝐜𝐜𝐢𝐚 @  
┃😛 ${prefix}𝐥𝐞𝐜𝐜𝐨/𝐚 @  
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
┃🎧 ${prefix}𝐚𝐮𝐝𝐢𝐨  
┃🔄 ${prefix}𝐫𝐞𝐯𝐞𝐫𝐬𝐞  
┃🔄 ${prefix}𝐫𝐞𝐯𝐞𝐫𝐬𝐞𝐯𝐢𝐝
┃⏩ ${prefix}𝐬𝐩𝐞𝐞𝐝𝐯𝐢𝐝𝐞𝐨
┃🎶 ${prefix}𝐩𝐥𝐚𝐲  
┃ⓘ  ${prefix}𝐢𝐧𝐟𝐨  
┃🌦️ ${prefix}𝐦𝐞𝐭𝐞𝐨 (𝐜𝐢𝐭𝐭𝐚̀)  
┃🎥 ${prefix}𝐭𝐨𝐯𝐢𝐝𝐞𝐨  
┃🖼️ ${prefix}𝐭𝐨𝐠𝐢𝐟  
┃📷 ${prefix}𝐭𝐨𝐢𝐦𝐠
┃💻 ${prefix}𝐬𝐲𝐬𝐭𝐞𝐦  
┃⚙️ ${prefix}𝐬𝐞𝐭𝐢𝐠  
┃📝 ${prefix}𝐫𝐞𝐠  
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
┃🏪 ${prefix}𝐬𝐡𝐨𝐩𝐚𝐧𝐢𝐦𝐚𝐥𝐢  
┃🐾 ${prefix}𝐚𝐧𝐢𝐦𝐚𝐥𝐢  
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
┃🧚 ${prefix}𝐰𝐢𝐧𝐱 @
┃✨ ${prefix}𝐛𝐞𝐥𝐥𝐨/𝐚 @  
┃⚫ ${prefix}𝐧𝐞𝐫𝐨/𝐚 @  
┣━━━━━━━━━━━━━━━━━━━━
┃🍔 *𝐂𝐈𝐁𝐎*  
┃
┃🥙 ${prefix}𝐤𝐞𝐛𝐚𝐛 @  
┃🍔 ${prefix}𝐡𝐚𝐦𝐛𝐮𝐫𝐠𝐞𝐫 @  
┃🍕 ${prefix}𝐩𝐢𝐳𝐳𝐚 @  
┃🍣 ${prefix}𝐬𝐮𝐬𝐡𝐢 @  
┣━━━━━━━━━━━━━━━━━━━━
┃✨ *𝐀𝐋𝐓𝐑𝐎*  
┃
┃🤖 ${prefix}𝐢𝐚  
┃💬 ${prefix}𝐛𝐨𝐭  
┃🏴‍☠️ ${prefix}𝐥𝐮𝐟𝐟𝐲  
┃🔥 ${prefix}𝐬𝐚𝐲𝐚𝐧  
┃📖 ${prefix}𝐫𝐞𝐠𝐨𝐥𝐞  
┃📨 ${prefix}𝐢𝐧𝐯𝐢𝐭𝐚
╰━━━━━━━━━━━━━━━━━━━╯
            ╔═══════════════════╗
║       ☄️𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕☄️      ║
╚═══════════════════╝
  `
}