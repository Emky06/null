//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

let handler = async (m, { conn }) => {
    const users = global.db.data.users || {};

    Object.keys(users).forEach(id => {
        if (typeof users[id].blasphemy !== 'number') users[id].blasphemy = 0;
    });

    let classifica = Object.entries(users)
        .filter(([key, data]) => (data.blasphemy || 0) > 0)
        .map(([key, data]) => ({ id: key, bestemmie: data.blasphemy }))
        .sort((a, b) => b.bestemmie - a.bestemmie)
        .slice(0, 10);

    if (classifica.length === 0) {
        return conn.reply(m.chat, "😇 Nessuno ha bestemmiato in questo gruppo!", m);
    }

    let message = `🏆 *Top 10 Bestemmiatori del Gruppo* 🏆\n\n`;
    let mentions = [];
    let userPosition = null;

    classifica.forEach((user, index) => {
        let medal = "🏅";
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        message += `${medal} *${index + 1}.* @${user.id.split('@')[0]} ➠ ${user.bestemmie} bestemmie\n`;
        mentions.push(user.id);

        if (user.id === m.sender) userPosition = index + 1;
    });

    let totalPlayers = Object.keys(users).length;
    let userMessage = userPosition !== null
        ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
        : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;

    const profileBuffer = fs.readFileSync('./icone/bestemmiometro.jpg');

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
                    name: "𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨",
                    jpegThumbnail: profileBuffer,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                },
            },
            participant: "0@s.whatsapp.net",
        },
    });
};

handler.command = /^topbestemmie$/i;
export default handler;