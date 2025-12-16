// Plugin fatto da Axtral_WiZaRd
let REVEAL_CODE = null;

if (!global.tempCodes) global.tempCodes = {};

let handler = async (m, { args }) => {
    if (!global.db.data.chats[m.chat].isBanned) {
        return m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐠𝐢𝐚̀ 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚 ✓*');
    }

    let code = Math.floor(1000 + Math.random() * 9000).toString();
    global.tempCodes[m.chat] = code;

    console.log(`🔐 Codice Reveal di questo bot: ${code}`);

    setTimeout(() => {
        if (global.tempCodes[m.chat] === code) delete global.tempCodes[m.chat];
    }, 60_000);

    if (!args[0]) {
        return m.reply(`𝐏𝐞𝐫 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞 𝐥𝐚 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚, 𝐢𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞 𝐚 𝟒 𝐜𝐢𝐟𝐫𝐞. 𝐄𝐬: .𝐫𝐞𝐯𝐞𝐚𝐥 ${code}`);
    }

    if (args[0] !== global.tempCodes[m.chat]) {
        return m.reply('*❌ 𝐂𝐨𝐝𝐢𝐜𝐞 𝐞𝐫𝐫𝐚𝐭𝐨! 𝐐𝐮𝐞𝐬𝐭𝐨 𝐛𝐨𝐭 𝐧𝐨𝐧 𝐯𝐞𝐫𝐫𝐚̀ 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨.*');
    }

    global.db.data.chats[m.chat].isBanned = false;
    delete global.tempCodes[m.chat];
    m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚 ✓*');
};

handler.help = ['unbanchat'];
handler.tags = ['owner'];
handler.command = /^reveal$/i;
handler.rowner = true;

export default handler;