let handler = async (m, { conn, args, participants }) => {
    // Prendi tutti gli utenti eccetto il bot stesso
    let usersData = participants
        .filter(p => p.id !== conn.user.jid)
        .map(p => {
            const userDb = global.db.data.users[p.id];
            return {
                ...userDb,
                jid: p.id
            };
        });

    // Ordina per numero di messaggi (top 10 di default)
    let topCount = args[0] && parseInt(args[0]) > 0 ? Math.min(100, parseInt(args[0])) : 10;
    let sortedUsers = usersData.sort((a, b) => (b.messaggi || 0) - (a.messaggi || 0)).slice(0, topCount);

    let userJids = sortedUsers.map(u => u.jid);
    let userPosition = sortedUsers.findIndex(u => u.jid === m.sender) + 1;

    // Genera messaggio classifica
    let messageText = sortedUsers.map((u, i) => {
        return `${getMedaglia(i + 1)} « ${u.messaggi || 0} » @${u.jid.split('@')[0]}`;
    }).join('\n');

    if (m.sender !== conn.user.jid) {
        messageText += `\n\nLa tua posizione: ${userPosition > 0 ? userPosition + '°' : 'nessuna'}`;
    }

    // Messaggio fittizio per la vCard e thumbnail
    let quotedMessage = {
        key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
        message: {
            locationMessage: {
                name: "Classifica Messaggi",
                jpegThumbnail: await (await fetch("https://telegra.ph/file/b311b1ffefcc34f681e36.png")).arrayBuffer(),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    await conn.reply(m.chat, messageText, quotedMessage, { mentions: userJids });
};

handler.command = /^(top)$/i;
handler.group = true;
export default handler;

function getMedaglia(pos) {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '🏅';
}