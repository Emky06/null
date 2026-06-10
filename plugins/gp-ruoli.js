//Plugin fatto da Axtral_WiZaRd
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

        await conn.sendMessage(message.chat, {
            text: `@${senderUsername} 𝐡𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${promotedUsername}`,
            contextInfo: {
                mentionedJid: [sender, promotedUser],
                /*externalAdReply: {
                    title: '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐩𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞 👑',
                    thumbnail: await fetchBuffer(profilePicture || imageFallback),
                    mediaType: 1,
                    renderLargerThumbnail: false
                },*/
            },
        }, { quoted: null });
    }

  
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

        await conn.sendMessage(message.chat, {
            text: `@${senderUsername} 𝐡𝐚 𝐥𝐞𝐯𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${demotedUsername}`,
            contextInfo: {
                mentionedJid: [sender, demotedUser],
                /*externalAdReply: {
                    title: '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 🙇🏻‍♂️',
                    thumbnail: await fetchBuffer(profilePicture || imageFallback),
                    mediaType: 1,
                    renderLargerThumbnail: false
                },*/
            },
        }, { quoted: null });
    }
};

export default handler;