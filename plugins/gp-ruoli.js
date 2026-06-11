1//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

const handler = m => m;

handler.before = async function (message, { conn }) {
    const imageFallback = 'icone/profilo.png'; 

    const fetchBuffer = async (url) => {
        if (!url) return null;
        if (url.startsWith('http')) {
            const res = await fetch(url);
            return await res.buffer();
        } else {
            return fs.readFileSync(url);
        }
    };

    const getPP = async (jid) => {
        try {
            return await conn.profilePictureUrl(jid, 'image');
        } catch {
            return null;
        }
    };

    const chat = global.db.data.chats[message.chat] || {};
    const detectEnabled = chat.detect;

    // PROMOZIONE
    if (message.messageStubType === 29 && detectEnabled) {

        let profilePicture;
        try {
            profilePicture = await conn.profilePictureUrl(message.messageStubParameters[0], 'image');
        } catch (e) {
            profilePicture = null;
        }

        const promotedUser = message.messageStubParameters[0];
        const sender = message.sender;
        const promotedUsername = promotedUser.split('@')[0];
        const senderUsername = sender.split('@')[0];

        const pp = await getPP(promotedUser);

        const quotedMessage = {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: 'Promo'
            },
            message: {
                locationMessage: {
                    name: `${nomebot}`,
                    jpegThumbnail: pp ? await fetchBuffer(pp) : null,
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:Bot\nEND:VCARD"
                }
            },
            participant: '0@s.whatsapp.net'
        };

        await conn.sendMessage(message.chat, {
            text: `@${senderUsername} 𝐡𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${promotedUsername}`,
            contextInfo: {
                mentionedJid: [sender, promotedUser],
            },
        }, { quoted: quotedMessage });
    }

    // DEMOZIONE
    if (message.messageStubType === 30 && detectEnabled) {

        let profilePicture;
        try {
            profilePicture = await conn.profilePictureUrl(message.messageStubParameters[0], 'image');
        } catch (e) {
            profilePicture = null;
        }

        const demotedUser = message.messageStubParameters[0];
        const sender = message.sender;
        const demotedUsername = demotedUser.split('@')[0];
        const senderUsername = sender.split('@')[0];

        const pp = await getPP(demotedUser);

        const quotedMessage = {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: 'Demote'
            },
            message: {
                locationMessage: {
                    name: `${nomebot}`,
                    jpegThumbnail: pp ? await fetchBuffer(pp) : null,
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:Bot\nEND:VCARD"
                }
            },
            participant: '0@s.whatsapp.net'
        };

        await conn.sendMessage(message.chat, {
            text: `@${senderUsername} 𝐡𝐚 𝐥𝐞𝐯𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${demotedUsername}`,
            contextInfo: {
                mentionedJid: [sender, demotedUser],
            },
        }, { quoted: quotedMessage });
    }
};

export default handler;