import fs from 'fs';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who;

    // Determina chi baciare, se è un gruppo o una chat privata
    if (m.isGroup) {
        who = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted ? m.quoted.sender 
            : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
            : false;
    } else {
        who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat;
    }

    // Controlla se la persona da baciare è valida
    if (!who) return m.reply(`𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐛𝐚𝐜𝐢𝐚𝐫𝐞 💋`);

    // Recupera la miniatura locale
    const thumbnailBuffer = fs.readFileSync('./icone/bacia.png');
    const thumbnailText = "𝐁𝐀𝐂𝐈𝐎"; // Testo miniatura compatibile

    // Invia il messaggio del bacio con l'immagine in miniatura e la scritta
    let abrazo = await conn.sendMessage(m.chat, {
        text: `════════•⊰✰⊱•════════
@${who.split('@')[0]} 𝐬𝐞𝐢 𝐬𝐭𝐚𝐭𝐨/𝐚 𝐛𝐚𝐜𝐢𝐚𝐭𝐨/𝐚 𝐝𝐚 @${m.sender.split('@')[0]}
════════•⊰✰⊱•════════`,
        mentions: [who, m.sender],
    }, {
        quoted: {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: "Halo",
            },
            message: {
                locationMessage: {
                    name: thumbnailText, // Scritta in miniatura compatibile
                    jpegThumbnail: thumbnailBuffer, // Immagine in miniatura
                },
            },
            participant: "0@s.whatsapp.net",
        },
    });

    // Aggiungi la reazione al bacio (emoji testata)
    conn.sendMessage(m.chat, { react: { text: '', key: abrazo.key } });
};

handler.command = ['bacia'];
export default handler;