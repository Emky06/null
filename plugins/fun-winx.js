import fs from 'fs';

let handler = async (m, { conn }) => {
    let targetUser;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        targetUser = m.quoted.sender;
    } else {
        targetUser = m.sender;
    }

    let username = `@${targetUser.split('@')[0]}`;

    let winx = pickRandom([
        {
            name: 'Bloom',
            power: 'Fuoco del Drago',
            description: 'Determinata, coraggiosa e sempre pronta a difendere i suoi amici!',
            image: 'storage/fotowinx/bloom.png'
        },
        {
            name: 'Stella',
            power: 'Luce del Sole',
            description: 'Solare, creativa e sempre alla moda! Sei la luce del gruppo!',
            image: 'storage/fotowinx/stella.png'
        },
        {
            name: 'Flora',
            power: 'Natura',
            description: 'Dolce, gentile e con un cuore grande. Ami la natura e la vita!',
            image: 'storage/fotowinx/flora.png'
        },
        {
            name: 'Tecna',
            power: 'Tecnologia',
            description: 'Intelligente, logica e sempre alla ricerca di soluzioni innovative!',
            image: 'storage/fotowinx/tecna.png'
        },
        {
            name: 'Musa',
            power: 'Musica',
            description: 'Creativa e passionale, trovi sempre un modo per esprimere le tue emozioni!',
            image: 'storage/fotowinx/musa.png'
        },
        {
            name: 'Aisha',
            power: 'Onde e Acqua',
            description: 'Energica, avventurosa e sempre pronta a nuove sfide!',
            image: 'storage/fotowinx/aisha.png'
        }
    ]);

    let message = `🧚‍♀️ ${username}, la Winx che ti rappresenta è *${winx.name}*! 🧚‍♀️\n\n✨ *Potere*: ${winx.power}\n💖 *Descrizione*: ${winx.description}`;

    let thumbnail = null;
    try {
        thumbnail = fs.readFileSync(winx.image);
    } catch (err) {
        console.error('Errore nel caricamento immagine:', err);
    }

    let fintoMsg = {
        key: { participants: "0@s.whatsapp.net", fromMe: false, id: "WinxTest" },
        message: {
            locationMessage: {
                name: 'La tua Winx è...',
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Winx;Bot;;;\nFN:Winx\nitem1.TEL;waid=${targetUser.split('@')[0]}:${targetUser.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    await conn.reply(m.chat, message, fintoMsg, { mentions: [targetUser] });
};

handler.help = ['chewinxsei'];
handler.tags = ['fun'];
handler.command = /^winx$/i;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}