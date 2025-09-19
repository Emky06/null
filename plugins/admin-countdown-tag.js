// Codice di admin-countdown-tag.js

//Crediti: Onix, di Riad 
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fs from 'fs'

let countdowns = {}; // Oggetto per gestire più countdown separati per chat

let startCountdown = async (conn, m, participants, text, minutes, chatId) => {
    try {
        let time = minutes * 60; // Converte i minuti in secondi

        // Usa "minuto" al singolare se minutes è 1, altrimenti usa "minuti"
        let minuteLabel = minutes === 1 ? "𝐦𝐢𝐧𝐮𝐭𝐨" : "𝐦𝐢𝐧𝐮𝐭𝐢";

        // Recupera l’immagine dal percorso locale
        const profileBuffer = fs.readFileSync('./icone/countdown.png');

        // Messaggio con countdown avviato, accompagnato dall'immagine in miniatura
        conn.sendMessage(chatId, {
            text: `𝐂𝐨𝐮𝐧𝐭𝐝𝐨𝐰𝐧 𝐚𝐯𝐯𝐢𝐚𝐭𝐨. 𝐓𝐚𝐠 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐨 𝐭𝐫𝐚 ${minutes} ${minuteLabel}. `,
             // Menziona tutti i partecipanti
        }, {
            quoted: {
                key: {
                    participants: "0@s.whatsapp.net",
                    fromMe: false,
                    id: "Halo",
                },
                message: {
                    locationMessage: {
                        name: "𝑪𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏 𝒕𝒂𝒈 ⏳", // Scritta miniatura
                        jpegThumbnail: profileBuffer, // Immagine in miniatura
                    },
                },
                participant: "0@s.whatsapp.net",
            },
        });

        countdowns[chatId] = countdowns[chatId] || []; // Assicuriamoci che ci sia un array per ogni chat
        countdowns[chatId].push(setTimeout(async () => {
            try {
                let users = participants.map(u => conn.decodeJid(u.id));
                let msg = generateWAMessageFromContent(chatId, {
                    extendedTextMessage: { text: text || "", contextInfo: { mentionedJid: users } }
                }, {});
                await conn.relayMessage(chatId, msg.message, { messageId: msg.key.id });
            } catch (innerError) {
                // Gli errori vengono ignorati completamente
            }
        }, time * 1000)); // Moltiplica per 1000 per convertire i secondi in millisecondi
    } catch (err) {
        // Gli errori vengono ignorati completamente
    }
};

let handler = async (m, { conn, text, participants, args }) => {
    try {
        let minutes = parseInt(args[0]) || 0; // Prende i minuti dal comando

        // Il messaggio sarà tutto il resto dopo i minuti (i successivi argomenti)
        let message = args.slice(1).join(" ");  // Resto del messaggio dopo i minuti

        // Se solo i minuti sono passati, considera i secondi come 0
        if (isNaN(minutes) || minutes <= 0) {
            return conn.sendMessage(m.chat, { text: "✖ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐛𝐞𝐧𝐞 𝐢𝐥 𝐭𝐞𝐦𝐩𝐨 𝐢𝐧 𝐦𝐢𝐧𝐮𝐭𝐢.\n> 𝑬𝒔𝒆𝒎𝒑𝒊𝒐: .𝒄𝒐𝒖𝒏𝒕𝒅𝒐𝒘𝒏 5 𝒄𝒊𝒂𝒐 𝒂 𝒕𝒖𝒕𝒕𝒊" }, { quoted: m });
        }

        // Limite di 24 ore (1440 minuti)
        if (minutes > 1440) {
            return conn.sendMessage(m.chat, { text: "✖ 𝐈𝐥 𝐭𝐞𝐦𝐩𝐨 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐜𝐨𝐧𝐬𝐞𝐧𝐭𝐢𝐭𝐨 𝐞̀ 𝐝𝐢 𝟏𝟒𝟒𝟎 𝐦𝐢𝐧𝐮𝐭𝐢, 𝐨𝐬𝐬𝐢𝐚 𝟐𝟒 𝐨𝐫𝐞. " }, { quoted: m });
        }

        // Se non c'è un messaggio, invia un avviso
        if (!message) {
            return conn.sendMessage(m.chat, { text: "✖ 𝐌𝐚𝐧𝐜𝐚 𝐢𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐝𝐚𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞 𝐢 𝐦𝐢𝐧𝐮𝐭𝐢." }, { quoted: m });
        }

        // Avvia il countdown con il messaggio
        await startCountdown(conn, m, participants, message, minutes, m.chat);
    } catch (err) {
        // Gli errori vengono ignorati completamente
    }
};

handler.command = /^(countdown)$/;
handler.group = true;
handler.admin = true;
export default handler;