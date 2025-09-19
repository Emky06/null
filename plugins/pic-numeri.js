//PIC 2.0 DI RIAD E YOUNS
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨.');

    // Rimuove tutti i caratteri non numerici
    let number = text.replace(/\D/g, '');

    // Rimuove  prefisso internazionale 00 
    if (number.startsWith('00')) number = number.slice(2);


    if (!number.startsWith('1') && !number.startsWith('2') && !number.startsWith('3') && !number.startsWith('4') && !number.startsWith('5') && !number.startsWith('6') && !number.startsWith('7') && !number.startsWith('8') && !number.startsWith('9')) {
        return m.reply('𝐌𝐚𝐧𝐜𝐚 𝐢𝐥 𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐨. ');
    }

    let who = number + '@s.whatsapp.net';

    try {
        let profilePicture = await conn.profilePictureUrl(who, 'image');
        await conn.sendMessage(m.chat, {
            image: { url: profilePicture },
            caption: `𝐅𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐝𝐢 @${number}`,
            mentions: [who]
        }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `@${number} 𝐧𝐨𝐧 𝐡𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐨 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐞̀ 𝐬𝐛𝐚𝐠𝐥𝐢𝐚𝐭𝐨.`,
            mentions: [who]
        }, { quoted: m });
    }
};

handler.command = /^(fp)$/i;
handler.group = false;
handler.admin = true;

export default handler;