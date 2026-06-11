// Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

const handler = m => m;

handler.before = async function (message, { conn }) {
    const imageFallback = 'icone/profilo.png';

    const fetchBuffer = async (url) => {
        if (url.startsWith('http')) {
            const res = await fetch(url);
            return await res.buffer();
        } else {
            return fs.readFileSync(url);
        }
    };

    const chat = global.db.data.chats[message.chat] || {};
    const detectEnabled = chat.detect;

    if (message.messageStubType === 29 && detectEnabled) {

        const promotedUser = message.messageStubParameters[0];
        const sender = message.sender;

        const promotedUsername = promotedUser.split('@')[0];
        const senderUsername = sender.split('@')[0];

        const contactQuote = {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: "PromoContact"
            },
            message: {
                contactMessage: {
                    displayName: `𝐏𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞 👑`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${promotedUsername};;;\nFN:${promotedUsername}\nitem1.TEL;waid=${promotedUsername}:${promotedUsername}\nitem1.X-ABLabel:WhatsApp\nEND:VCARD`
                }
            },
            participant: "0@s.whatsapp.net"
        };

        await conn.sendMessage(message.chat, {
            text: `@${senderUsername} 𝐡𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${promotedUsername}`,
            contextInfo: {
                mentionedJid: [sender, promotedUser],
            },
        }, {
            quoted: contactQuote
        });
    }

    if (message.messageStubType === 30 && detectEnabled) {

        const demotedUser = message.messageStubParameters[0];
        const sender = message.sender;

        const demotedUsername = demotedUser.split('@')[0];
        const senderUsername = sender.split('@')[0];

        const contactQuote = {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: "DemoteContact"
            },
            message: {
                contactMessage: {
                    displayName: `𝐑𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 🙇🏻‍♂️`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${demotedUsername};;;\nFN:${demotedUsername}\nitem1.TEL;waid=${demotedUsername}:${demotedUsername}\nitem1.X-ABLabel:WhatsApp\nEND:VCARD`
                }
            },
            participant: "0@s.whatsapp.net"
        };

        await conn.sendMessage(message.chat, {
            text: `@${senderUsername} 𝐡𝐚 𝐥𝐞𝐯𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${demotedUsername}`,
            contextInfo: {
                mentionedJid: [sender, demotedUser],
            },
        }, {
            quoted: contactQuote
        });
    }
};

export default handler;