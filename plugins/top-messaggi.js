import fs from 'fs';

let handler = async (m, { conn, args, participants }) => {
    const users = global.db.data.users || {};

    // DEBUG: mostra tutti gli utenti nel database
    console.log('=== DEBUG TOP ===');
    console.log('Utenti nel DB:', Object.keys(users).length);
    
    // Mostra i primi 5 utenti con i loro messaggi
    Object.keys(users).slice(0, 5).forEach(jid => {
        const user = users[jid];
        console.log(`${jid.split('@')[0]}: ${user.messaggi || 0} messaggi`);
    });

    // Prepara i dati per la classifica
    let usersData = participants
        .filter(p => p.id !== conn.user.jid) // escludi bot
        .map(p => {
            const user = users[p.id] || {};
            return {
                messaggi: user.messaggi || 0,
                jid: p.id,
                name: p.name || p.id.split('@')[0]
            };
        })
        .filter(user => user.messaggi > 0); // mostra solo chi ha messaggi

    console.log('Utenti con messaggi > 0:', usersData.length);
    console.log('==================');

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

    // Trova la posizione esatta dell'utente anche se non è in top 10
    if (!userPosition) {
        const allSorted = usersData.sort((a, b) => b.messaggi - a.messaggi);
        const exactIndex = allSorted.findIndex(u => u.jid === m.sender);
        if (exactIndex !== -1) {
            userPosition = exactIndex + 1;
        }
    }

    let totalPlayers = participants.length - 1; // -1 per il bot
    let userMessage = userPosition
        ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
        : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;

    const profileBuffer = fs.readFileSync('./icone/messaggi.png');

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