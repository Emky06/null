import fs from 'fs';

let handler = async (m, { conn }) => {
    let users = global.db.data.users;

    if (!users || Object.keys(users).length === 0) {
        return m.reply("⚠︎ Non ci sono ancora giocatori registrati nella classifica!");
    }

    // Prendi tutti gli ID dei membri del gruppo
    let chatMembers = await conn.groupMetadata(m.chat)
        .then(v => v.participants.map(u => u.id))
        .catch(() => []);

    if (chatMembers.length === 0) {
        return m.reply("⚠︎ Non sono riuscito a leggere i membri del gruppo.");
    }

    const chatMembersSet = new Set(chatMembers);

    // Costruisci la classifica filtrando solo membri del gruppo
    let classifica = Object.entries(users)
        .filter(([key, data]) => chatMembersSet.has(key) && (data.vittorieBandiera || 0) > 0)
        .map(([key, data]) => ({ id: key, vittorie: data.vittorieBandiera }))
        .sort((a, b) => b.vittorie - a.vittorie);

    if (classifica.length === 0) {
        return m.reply("⚠︎ Nessun giocatore di questo gruppo ha ancora vinto una partita nel gioco delle bandiere!");
    }

    if (classifica.length > 10) classifica = classifica.slice(0, 10);

    let totalMembers = chatMembers.length;
    let message = `🏆 𝕋𝕆ℙ 𝕍𝕀𝕋𝕋𝕆ℝ𝕀𝔼 𝔹𝔸ℕ𝔻𝕀𝔼ℝ𝔼 \n\n`;
    let mentions = [];
    let userPosition = null;

    classifica.forEach((user, index) => {
        let medal = "🏅";
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        message += `${medal} *${index + 1}.* @${user.id.split('@')[0]} ➠ ${user.vittorie} 𝐯𝐢𝐭𝐭𝐨𝐫𝐢𝐞\n`;
        mentions.push(user.id);

        if (user.id === m.sender) {
            userPosition = index + 1;
        }
    });

    let userMessage = userPosition !== null
        ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalMembers}`
        : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;

    // Legge immagine locale ./icone/bandiera.png
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

handler.help = ['bandieraclassifica'];
handler.tags = ['game'];
handler.command = ['topbandiere'];

export default handler;