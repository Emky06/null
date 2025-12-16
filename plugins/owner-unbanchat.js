// Plugin fatto da Axtral_WiZaRd
let REVEAL_CODE = null; 

let handler = async (m, { args }) => {
    if (!global.db.data.chats[m.chat].isBanned) {
        return m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐠𝐢𝐚̀ 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚 ✓*');
    }

    REVEAL_CODE = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`🔐 Codice Reveal di questo bot: ${REVEAL_CODE}`);

    if (!args[0]) {
        return m.reply(`𝐏𝐞𝐫 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞 𝐥𝐚 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚, 𝐢𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐜𝐨𝐝𝐢𝐜𝐞 𝐚 𝟒 𝐜𝐢𝐟𝐫𝐞. 𝐄𝐬: .𝐬𝐡𝐚𝐝𝐨𝐰 𝟏𝟐𝟑𝟒`);
    }

    if (args[0] !== REVEAL_CODE) {
        return m.reply('*❌ 𝐂𝐨𝐝𝐢𝐜𝐞 𝐞𝐫𝐫𝐚𝐭𝐨! 𝐐𝐮𝐞𝐬𝐭𝐨 𝐛𝐨𝐭 𝐧𝐨𝐧 𝐯𝐞𝐫𝐫𝐚̀ 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨.*');
    }

    global.db.data.chats[m.chat].isBanned = false;
    m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚 ✓*');
};

handler.help = ['unbanchat'];
handler.tags = ['owner'];
handler.command = /^reveal$/i;
handler.rowner = true;

export default handler;