//Plugin fatto da Axtral_WiZaRd
let handler = async function (message, { conn, text, usedPrefix }) {
    
    let chatData = global.db.data.chats[message.chat];

    if (chatData.rules === '') {
        throw 'ⓘ Gli admin del gruppo attualmente non hanno settato nessuna regola';
    }

    
    message.reply(
        '╭━━━━━━━━━━━━━━━━━━━╮\n' +
        '┃   📜 *𝙍𝙀𝙂𝙊𝙇𝙀 𝙂𝙍𝙐𝙋𝙋𝙊* 📜   ┃\n' +
        '╰━━━━━━━━━━━━━━━━━━━╯\n\n' +
        chatData.rules
    );
};

handler.command = ['regole'];
handler.tags = ['group'];
handler.help = ['regole', 'rules']; 
handler.group = true;
export default handler;
