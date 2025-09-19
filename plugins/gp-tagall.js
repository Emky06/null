import fs from 'fs/promises';

let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, groupMetadata }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    let pesan = args.join` ` || ' 🚨 *𝐀𝐋𝐋𝐄𝐑𝐓𝐀!* 🚨';
    let oi = `📢  ${pesan}`;

    // Usa thumbnail locale come fallback
    let thumbnail;
    try {
        thumbnail = await fs.readFile('icone/tagall.png');
    } catch (e) {
        thumbnail = null; // in caso il file non esista
    }

    let prova = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: '⚡ 𝐍𝐎𝐍 𝐒𝐈 𝐃𝐎𝐑𝐌𝐄!!! ⚡',
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    let teks = `
╔════🔱 *𝐓𝐀𝐆 𝐀𝐋𝐋* 🔱════╗
🏠 *𝐆𝐫𝐮𝐩𝐩𝐨:* ${groupMetadata.subject || 'Non sei in un gruppo'}
👥 *𝐌𝐞𝐦𝐛𝐫𝐢:* ${participants.length}
💬 *𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨:* ${oi}
╚═══════════════════╝

➤ *MENTIONS:*
`.trim();

    teks += '\n' + participants
        .filter(p => p.id !== conn.user.jid)
        .map(p => `➤ @${p.id.split('@')[0]}`)
        .join('\n');

    teks += `\n\n🚀 *𝐁𝐘 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕* ☄️`;

    conn.sendMessage(m.chat, {
        text: teks,
        mentions: participants.filter(p => p.id !== conn.user.jid).map(p => p.id)
    }, { quoted: prova });
};

handler.help = ['tagall'];
handler.tags = ['group'];
handler.command = /^(tagall)$/i;
handler.group = true;

export default handler;