let handler = async function (message, { conn, text, usedPrefix }) {
    // Recupera i dati della chat corrente dal database
    let chatData = global.db.data.chats[message.chat];

    // Se non ci sono regole impostate, invia un messaggio di avviso
    if (chatData.rules === '') {
        throw 'ⓘ Gli admin del gruppo attualmente non hanno settato nessuna regola';
    }

    // Risponde con le regole del gruppo
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
