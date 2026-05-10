//Plugin fatto da Riad & Kinder, mod by Axtral
let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨.');

    let number = text.replace(/\D/g, '');

    if (number.startsWith('00')) number = number.slice(2);

    if (
        !number.startsWith('1') &&
        !number.startsWith('2') &&
        !number.startsWith('3') &&
        !number.startsWith('4') &&
        !number.startsWith('5') &&
        !number.startsWith('6') &&
        !number.startsWith('7') &&
        !number.startsWith('8') &&
        !number.startsWith('9')
    ) {
        return m.reply('𝐌𝐚𝐧𝐜𝐚 𝐢𝐥 𝐩𝐫𝐞𝐟𝐢𝐬𝐬𝐨.');
    }

    let who = number + '@s.whatsapp.net';

    if (who === conn.user.jid) {
        await conn.sendMessage(m.chat, {
            text: `🚫 𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐨𝐭𝐭𝐞𝐧𝐞𝐫𝐞 𝐥𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐝𝐞𝐥 𝐛𝐨𝐭.`
        }, { quoted: m });
        return;
    }

    if (global.owner.some(o => (Array.isArray(o) ? o[0] : o) + '@s.whatsapp.net' === who)) {
        await conn.sendMessage(m.chat, {
            text: `🚫 𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐨𝐭𝐭𝐞𝐧𝐞𝐫𝐞 𝐥𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 𝐝𝐢 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫.`
        }, { quoted: m });
        return;
    }

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
handler.group = true;
handler.staff = true;

export default handler;