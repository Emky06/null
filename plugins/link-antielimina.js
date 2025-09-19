import fs from 'fs';

let handler = async (m, { conn }) => {
    // Ottieni tutti i membri del gruppo
    const groupMetadata = await conn.groupMetadata(m.chat);
    const mentions = groupMetadata.participants.map(u => u.id);

    await conn.relayMessage(
        m.chat,
        {
            requestPaymentMessage: {
                noteMessage: {
                    extendedTextMessage: {
                        text: '『🚫』 𝐂𝐈 𝐒𝐏𝐎𝐒𝐓𝐈𝐀𝐌𝐎 『🚫』\n𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈 𝐐𝐔𝐈:\nhttps://chat.whatsapp.com/CHz1iMtQvJhFrd00qew26f\n『🚫』𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈『🚫』\n',
                        contextInfo: {
                            mentionedJid: mentions, // qui tagga tutti
                            externalAdReply: {
                                title: 'ChatUnity Broadcast',
                                body: 'Unisciti ora!',
                                mediaType: 1,
                                renderLargerThumbnail: true,
                                showAdAttribution: false
                            }
                        }
                    },
                    currencyCodeIso4217: 'USD',
                    requestFrom: '0@s.whatsapp.net',
                    amount: 99,
                    expiryTimestamp: Date.now() + 99999
                }
            }
        },
        {}
    );
};

handler.command = /^axtralmsg$/i;
handler.owner = true;

export default handler;