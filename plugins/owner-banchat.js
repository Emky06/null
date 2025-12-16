// Plugin fatto da Axtral_WiZaRd

if (!global.tempCodes) global.tempCodes = {};

let handler = async (m, { args }) => {
    let code = Math.floor(1000 + Math.random() * 9000).toString();
    global.tempCodes[m.chat] = code;

    console.log(`🔐 Codice Shadow di questo bot: ${code}`);

    setTimeout(() => {
        if (global.tempCodes[m.chat] === code) delete global.tempCodes[m.chat];
    }, 60_000);

    if (!args[0]) {
        return m.reply(`𝐏𝐞𝐫 𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞 𝐥𝐚 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚, 𝐢𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞 𝐚 𝟒 𝐜𝐢𝐟𝐫𝐞. 𝐄𝐬: .𝐬𝐡𝐚𝐝𝐨𝐰 𝟏𝟐𝟑𝟒`);
    }

    if (args[0] !== global.tempCodes[m.chat]) {
        return m.reply('❌ 𝐂𝐨𝐝𝐢𝐜𝐞 𝐞𝐫𝐫𝐚𝐭𝐨! 𝐐𝐮𝐞𝐬𝐭𝐨 𝐛𝐨𝐭 𝐧𝐨𝐧 𝐯𝐞𝐫𝐫𝐚̀ 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨.');
    }

    global.db.data.chats[m.chat].isBanned = true;
    delete global.tempCodes[m.chat];
    m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚... 𝐧𝐨𝐧 𝐬𝐞𝐧𝐭𝐢𝐫𝐞𝐭𝐞 𝐧𝐮𝐥𝐥𝐚.*');
};

handler.help = ['banchat'];
handler.tags = ['owner'];
handler.command = /^shadow$/i;
handler.rowner = true;

export default handler;