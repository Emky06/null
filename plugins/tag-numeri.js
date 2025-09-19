//TAGGA NUMERI BY YOUNS E RIAD
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨.');

    // Rimuove tutti i caratteri non numerici
    let number = text.replace(/\D/g, '');

    // Se inizia con 00 lo trasforma in formato internazionale
    if (number.startsWith('00')) number = number.slice(2);

    // Controllo base
    if (number.length < 9) return m.reply('𝐍𝐮𝐦𝐞𝐫𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.');

    let jid = number + '@s.whatsapp.net';

    // Manda solo il tag
    await conn.sendMessage(m.chat, {
        text: `𝐄𝐜𝐜𝐨 𝐢𝐥 𝐭𝐚𝐠: @${number}`,
        mentions: [jid]
    }, { quoted: m });
};

handler.command = /^(tagga)$/i;
handler.group = false;
handler.admin = true;

export default handler;