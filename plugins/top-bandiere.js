//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

let handler = async (m, { conn }) => {
    const users = global.db.data.users || {};

    let classifica = Object.entries(users)
        .filter(([key, data]) => (data.vittorieBandiera || 0) > 0)
        .map(([key, data]) => ({ id: key, vittorie: data.vittorieBandiera }))
        .sort((a, b) => b.vittorie - a.vittorie)
        .slice(0, 10);

    if (classifica.length === 0) {
        return conn.reply(m.chat, "⚠︎ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐠𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞 𝐡𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 𝐯𝐢𝐧𝐭𝐨 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚 𝐧𝐞𝐥 𝐠𝐢𝐨𝐜𝐨 𝐝𝐞𝐥𝐥𝐞 𝐛𝐚𝐧𝐝𝐢𝐞𝐫𝐞!", m);
    }

    let message = `🏆 *𝐓𝐨𝐩 𝟏𝟎 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐯𝐢𝐭𝐭𝐨𝐫𝐢𝐞 𝐧𝐞𝐥𝐥𝐞 𝐛𝐚𝐧𝐝𝐢𝐞𝐫𝐞* 🏆\n\n`;
    let mentions = [];
    let userPosition = null;

    classifica.forEach((user, index) => {
        let medal = "🏅";
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        message += `${medal} *${index + 1}.* @${user.id.split('@')[0]} ➠ ${user.vittorie} 𝐯𝐢𝐭𝐭𝐨𝐫𝐢𝐞\n`;
        mentions.push(user.id);

        if (user.id === m.sender) userPosition = index + 1;
    });

    let totalPlayers = Object.keys(users).length;
    let userMessage = userPosition !== null
        ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
        : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;

    const profileBuffer = fs.readFileSync('./icone/bandiera.png');

    await conn.sendMessage(m.chat, {
        text: message + `\n\n${userMessage}`,
        mentions: mentions
    }, {
        quoted: {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: "Halo",
            },
            message: {
                locationMessage: {
                    name: "𝑻𝒐𝒑 𝒃𝒂𝒏𝒅𝒊𝒆𝒓𝒆 🚩",
                    jpegThumbnail: profileBuffer,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                },
            },
            participant: "0@s.whatsapp.net",
        },
    });
};

handler.command = /^topbandiere$/i;
export default handler;