//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

let handler = async (m, { conn, args, participants }) => {
    const users = global.db.data.users || {};

    const participantJids = participants.map(p => p.jid).filter(jid => jid);

    participantJids.forEach(jid => {
        if (!users[jid]) {
            users[jid] = { 
                messaggi: 0
            };
        }
        if (typeof users[jid].messaggi !== 'number') users[jid].messaggi = 0;
    });

    let count = 10;
    if (args[0] && ['10', '50', '100'].includes(args[0])) count = parseInt(args[0]);

    let usersData = participantJids
        .filter(jid => jid !== conn.user.jid && users[jid])
        .map(jid => ({
            jid: jid,
            messaggi: users[jid].messaggi || 0
        }))
        .sort((a, b) => b.messaggi - a.messaggi)
        .slice(0, count);

    if (usersData.length === 0) {
        return conn.reply(m.chat, "⚠︎ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐡𝐚 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨!", m);
    }

    let message = `🏆 𝕋𝕆ℙ 𝕄𝔼𝕊𝕊𝔸𝔾𝔾𝕀 🏆\n\n`;
    let mentions = [];
    let userPosition = null;

    usersData.forEach((user, i) => {
        let medal = "🏅";
        if (i === 0) medal = "🥇";
        else if (i === 1) medal = "🥈";
        else if (i === 2) medal = "🥉";

        message += `${medal} *${i + 1}.* @${user.jid.split('@')[0]} ➠ ${user.messaggi} 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢\n`;
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
                name: "𝐓𝐨𝐩 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢 ",
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