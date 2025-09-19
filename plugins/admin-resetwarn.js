import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid?.[0] ?? m.quoted?.sender ?? false;
    } else {
        who = m.chat;
    }

    if (!who || !(who in global.db.data.users)) return;

    let userData = global.db.data.users[who];
    let warn = userData.warn;

    if (warn > 0) {
        userData.warn = 0;
        userData.warnReasons = [];

        const imagePath = path.join('icone', 'resetwarn.png');
        const profileBuffer = fs.readFileSync(imagePath);

        const messageText = `𝑰 𝒘𝒂𝒓𝒏 𝒅𝒊 @${who.split('@')[0]} 𝒔𝒐𝒏𝒐 𝒔𝒕𝒂𝒕𝒊 𝒂𝒛𝒛𝒆𝒓𝒂𝒕𝒊 ✔︎`;

        await conn.sendMessage(
            m.chat,
            {
                text: messageText,
                mentions: [who],
            },
            {
                quoted: {
                    key: {
                        participants: "0@s.whatsapp.net",
                        fromMe: false,
                        id: "Halo",
                    },
                    message: {
                        locationMessage: {
                            name: "𝑨𝒛𝒛𝒆𝒓𝒂𝒎𝒆𝒏𝒕𝒐 𝒘𝒂𝒓𝒏 ✔︎",
                            jpegThumbnail: profileBuffer,
                        },
                    },
                    participant: "0@s.whatsapp.net",
                },
            }
        );
    }
};

handler.help = ['delallwarn @user'];
handler.tags = ['group'];
handler.command = ['resetwarn'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;