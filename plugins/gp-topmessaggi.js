import fs from 'fs';

let handler = async (m, { conn, args, participants }) => {
    const users = global.db.data.users || {};

    // NON sovrascrivere l'utente esistente con un nuovo oggetto!
    participants.forEach(p => {
        if (!users[p.id]) {
            // Se l'utente non esiste, crealo con messaggi a 0
            users[p.id] = {};
        }
        // Assicurati che messaggi esista e sia un numero
        if (typeof users[p.id].messaggi !== 'number') {
            users[p.id].messaggi = 0;
        }
    });

    let usersData = participants
        .filter(p => p.id !== conn.user.jid)
        .map(p => ({
            messaggi: users[p.id] ? (users[p.id].messaggi || 0) : 0,
            jid: p.id
        }));

    let count = 10;
    if (args[0] && ['10', '50', '100'].includes(args[0])) count = parseInt(args[0]);

    let sorted = usersData.sort((a, b) => b.messaggi - a.messaggi).slice(0, count);

    if (sorted.length === 0) {
        return conn.reply(m.chat, "⚠︎ Nessun utente ha inviato messaggi nel gruppo!", m);
    }

    let message = `🏆 𝕋𝕆ℙ 𝕄𝔼𝕊𝕊𝔸𝔾𝔾𝕀 🏆\n\n`;
    let mentions = [];
    let userPosition = null;

    sorted.forEach((user, i) => {
        let medal = "🏅";
        if (i === 0) medal = "🥇";
        else if (i === 1) medal = "🥈";
        else if (i === 2) medal = "🥉";

        message += `${medal} *${i + 1}.* @${user.jid.split('@')[0]} ➠ ${user.messaggi} messaggi\n`;
        mentions.push(user.jid);

        if (user.jid === m.sender) userPosition = i + 1;
    });

    let totalPlayers = participants.length;
    let userMessage = userPosition
        ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
        : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;

    const profileBuffer = fs.readFileSync('./icone/top.png');

    const quotedMessage = {
        key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
        message: {
            locationMessage: {
                name: "Top Messaggi",
                jpegThumbnail: profileBuffer,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    await conn.sendMessage(m.chat, {
        text: message + `\n\n${userMessage}`,
        mentions: mentions
    }, { quoted: quotedMessage });
};

handler.command = /^top$/i;
export default handler;