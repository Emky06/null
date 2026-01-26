import fs from 'fs';

let handler = async (m, { conn }) => {
    try {
        let users = global.db.data.users;
        if (!users || Object.keys(users).length === 0) {
            return m.reply("⚠︎ Non ci sono ancora giocatori registrati nella classifica!");
        }

        // Prendi i membri del gruppo
        let participants = [];
        try {
            const metadata = await conn.groupMetadata(m.chat);
            participants = metadata.participants.map(u => u.id);
        } catch (e) {
            return m.reply("⚠︎ Non sono riuscito a leggere i membri del gruppo.");
        }

        if (participants.length === 0) {
            return m.reply("⚠︎ Nessun membro trovato nel gruppo.");
        }

        const participantsSet = new Set(participants);

        // Prendi solo gli utenti registrati che sono nel gruppo e hanno vittorie
        let classifica = Object.entries(users)
            .filter(([id, data]) => participantsSet.has(id) && data.vittorieBandiera > 0)
            .map(([id, data]) => ({ id, vittorie: data.vittorieBandiera }))
            .sort((a, b) => b.vittorie - a.vittorie);

        if (classifica.length === 0) {
            return m.reply("⚠︎ Nessun giocatore di questo gruppo ha ancora vinto una partita nel gioco delle bandiere!");
        }

        if (classifica.length > 10) classifica = classifica.slice(0, 10);

        let message = "🏆 𝕋𝕆ℙ 𝕍𝕀𝕋𝕋𝕆ℝ𝕀𝔼 𝔹𝔸ℕ𝔻𝕀𝔼ℝ𝔼 \n\n";
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

        const userMessage = userPosition
            ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${participants.length}`
            : "𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚";

        const profileBuffer = fs.readFileSync('./icone/bandiera.png');

        await conn.sendMessage(m.chat, {
            text: message + `\n\n${userMessage}`,
            mentions
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
                    }
                },
                participant: "0@s.whatsapp.net",
            }
        });
    } catch (err) {
        console.error(err);
        m.reply("⚠︎ Si è verificato un errore durante la generazione della classifica.");
    }
};

handler.help = ['bandieraclassifica'];
handler.tags = ['game'];
handler.command = ['topbandiere'];

export default handler;