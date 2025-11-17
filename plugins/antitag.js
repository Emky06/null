// Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata, isAdmin, isPrems, isBotAdmin, isOwner, isROwner }) {
    if (!m.isGroup) return false;
    
    const botNumber = conn.decodeJid(conn.user?.jid || conn.user?.id || '');
    const isBot = m.sender === botNumber;
    
    if (m.mentionedJid && m.mentionedJid.length > 0 && !isBot && !isOwner && !isROwner && !isAdmin && !isPrems) {
        const tagLimit = 40;
        let warnLimit = 3;

        if (m.mentionedJid.length > tagLimit) {
            let senderId = m.key.participant;
            let messageId = m.key.id;

            const userJid = conn.decodeJid(m.sender);
            if (!global.db.data.users[userJid]) {
                global.db.data.users[userJid] = {
                    warn: 0,
                    warnReasons: [],
                    registered: false,
                    exp: 0,
                    money: 0,
                    lvl: 0
                };
            }
            
            if (!global.db.data.users[userJid].warn) global.db.data.users[userJid].warn = 0;
            if (!global.db.data.users[userJid].warnReasons) global.db.data.users[userJid].warnReasons = [];

            global.db.data.users[userJid].warn += 1;
            global.db.data.users[userJid].warnReasons.push('tag eccessivi');

            if (isBotAdmin) {
                try {
                    await conn.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: messageId,
                            participant: senderId,
                        },
                    });
                } catch (e) {
                    console.error('Errore nella cancellazione del messaggio:', e);
                }
            }

            let warnCount = global.db.data.users[userJid].warn;
            let remaining = warnLimit - warnCount;

            let thumbnailBuffer;
            try {
                thumbnailBuffer = fs.readFileSync('./icone/warn.png');
            } catch (e) {
                thumbnailBuffer = null;
            }

            const botName = '⚠️ 𝐀𝐧𝐭𝐢-𝐓𝐚𝐠 𝐚𝐭𝐭𝐢𝐯𝐨 ⚠️';

            // Costruzione messaggio vCard da usare come quoted
            let vcardMessage = {
                key: {
                    participants: '0@s.whatsapp.net',
                    fromMe: false,
                    id: 'vcard1'
                },
                message: {
                    locationMessage: {
                        name: botName,
                        jpegThumbnail: thumbnailBuffer,
                        vcard: `BEGIN:VCARD
VERSION:3.0
N:;${botName};;;
FN:${botName}
ORG:Anti-Tag System
TEL;waid=${botNumber.split('@')[0]}:${botNumber.split('@')[0]}
END:VCARD`
                    }
                },
                participant: '0@s.whatsapp.net'
            };

            if (warnCount < warnLimit) {
                await conn.sendMessage(m.chat, { 
                    text: `𝐓𝐫𝐨𝐩𝐩𝐢 𝐭𝐚𝐠 𝐧𝐨𝐧 𝐬𝐨𝐧𝐨 𝐜𝐨𝐧𝐬𝐞𝐧𝐭𝐢𝐭𝐢\n*${warnCount}° AVVERTIMENTO*\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`
                }, { quoted: vcardMessage });
            } else {
                global.db.data.users[userJid].warn = 0;
                global.db.data.users[userJid].warnReasons = [];
                
                if (isBotAdmin) {
                    try {
                        await conn.groupParticipantsUpdate(m.chat, [userJid], 'remove');
                        await conn.sendMessage(m.chat, { 
                            text: `⛔ @${userJid.split('@')[0]} 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈`,
                            mentions: [userJid]
                        }, { quoted: vcardMessage });
                    } catch (e) {
                        console.error('Errore nella rimozione dell\'utente:', e);
                        await conn.sendMessage(m.chat, { 
                            text: `⛔ @${userJid.split('@')[0]} 𝐃𝐎𝐕𝐑𝐄𝐁𝐁𝐄 𝐄𝐒𝐒𝐄𝐑𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐌𝐀 𝐍𝐎𝐍 𝐇𝐎 𝐏𝐎𝐓𝐔𝐓𝐎 (𝐏𝐄𝐑𝐌𝐄𝐒𝐒𝐈 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓𝐈)`,
                            mentions: [userJid]
                        }, { quoted: vcardMessage });
                    }
                } else {
                    await conn.sendMessage(m.chat, { 
                        text: `⛔ @${userJid.split('@')[0]} 𝐃𝐎𝐕𝐑𝐄𝐁𝐁𝐄 𝐄𝐒𝐒𝐄𝐑𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐌𝐀 𝐈𝐋 𝐁𝐎𝐓 𝐍𝐎𝐍 𝐄̀ 𝐀𝐃𝐌𝐈𝐍`,
                        mentions: [userJid]
                    }, { quoted: vcardMessage });
                }
            }
            
            return true;
        }
    }
    
    return false;
};

export default handler;
