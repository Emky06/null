//Crediti: Onix, di Riad 
import { generateWAMessageFromContent } from '@axtral_wizard/baileys'
import fs from 'fs'

let countdowns = {}; 

let startCountdown = async (conn, m, participants, text, minutes, chatId) => {
    try {
        let time = minutes * 60; 

        let minuteLabel = minutes === 1 ? "𝐦𝐢𝐧𝐮𝐭𝐨" : "𝐦𝐢𝐧𝐮𝐭𝐢";

        const profileBuffer = fs.readFileSync('./icone/countdown.png');

        conn.sendMessage(chatId, {
            text: `𝐂𝐨𝐮𝐧𝐭𝐝𝐨𝐰𝐧 𝐚𝐯𝐯𝐢𝐚𝐭𝐨. 𝐓𝐚𝐠 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐨 𝐭𝐫𝐚 ${minutes} ${minuteLabel}. `,

        }, {
            quoted: {
                key: {
                    participants: "0@s.whatsapp.net",
                    fromMe: false,
                    id: "Halo",
                },
                message: {
                    locationMessage: {
                        name: "𝑪𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏 𝒕𝒂𝒈 ⏳", 
                        jpegThumbnail: profileBuffer, 
                    },
                },
                participant: "0@s.whatsapp.net",
            },
        });

        countdowns[chatId] = countdowns[chatId] || []; 
        countdowns[chatId].push(setTimeout(async () => {
            try {
                let users = participants.map(u => conn.decodeJid(u.id));
                let msg = generateWAMessageFromContent(chatId, {
                    extendedTextMessage: { text: text || "", contextInfo: { mentionedJid: users } }
                }, {});
                await conn.relayMessage(chatId, msg.message, { messageId: msg.key.id });
            } catch (innerError) {

            }
        }, time * 1000)); 
    } catch (err) {

    }
};

let handler = async (m, { conn, text, participants, args }) => {
    try {
        let minutes = parseInt(args[0]) || 0; 

        let message = args.slice(1).join(" ");  // Resto del messaggio dopo i minuti

        if (isNaN(minutes) || minutes <= 0) {
            return conn.sendMessage(m.chat, { text: "✖ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐛𝐞𝐧𝐞 𝐢𝐥 𝐭𝐞𝐦𝐩𝐨 𝐢𝐧 𝐦𝐢𝐧𝐮𝐭𝐢.\n> 𝑬𝒔𝒆𝒎𝒑𝒊𝒐: .𝒄𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏 5 𝒄𝒊𝒂𝒐 𝒂 𝒕𝒖𝒕𝒕𝒊" }, { quoted: m });
        }

        if (minutes > 1440) {
            return conn.sendMessage(m.chat, { text: "✖ 𝐈𝐥 𝐭𝐞𝐦𝐩𝐨 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐜𝐨𝐧𝐬𝐞𝐧𝐭𝐢𝐭𝐨 𝐞̀ 𝐝𝐢 𝟏𝟒𝟒𝟎 𝐦𝐢𝐧𝐮𝐭𝐢, 𝐨𝐬𝐬𝐢𝐚 𝟐𝟒 𝐨𝐫𝐞. " }, { quoted: m });
        }

        if (!message) {
            return conn.sendMessage(m.chat, { text: "✖ 𝐌𝐚𝐧𝐜𝐚 𝐢𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐝𝐚𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞 𝐢 𝐦𝐢𝐧𝐮𝐭𝐢." }, { quoted: m });
        }

        await startCountdown(conn, m, participants, message, minutes, m.chat);
    } catch (err) {

    }
};

handler.command = /^(countdown)$/;
handler.group = true;
handler.staff = true;
export default handler;