//Plugin fatto da Axtral_WiZaRd
import { performance } from "perf_hooks";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, text }) => {
    let mentionedJid = [];

    // Se rispondi a un messaggio
    if (m.quoted) {
        mentionedJid = [m.quoted.sender];
    }
    // Se menzioni qualcuno con @
    else if (m.mentionedJid && m.mentionedJid.length) {
        mentionedJid = m.mentionedJid;
    }
    // Se scrivi @numero manualmente
    else if (text && text.startsWith('@')) {
        let number = text.replace('@', '').replace(/\s+/g, '') + '@s.whatsapp.net';
        mentionedJid = [number];
    }
    // Altrimenti usa l'autore del messaggio
    else {
        mentionedJid = [m.sender];
    }

    let nome = '@' + mentionedJid[0].split('@')[0];

    let messages = [
        `🍞 Inizio a preparare un Hamburger per ${nome}...`,
        `🥩 Sto cuocendo la carne sulla griglia!`,
        `🧀 Aggiungo una fetta di formaggio fuso...`,
        `🥬 Un po' di lattuga croccante.`,
        `🍅 Pomodori freschi a fette.`,
        `🧅 Cipolla caramellata, ovviamente!`,
        `🍞 Pane caldo sopra e sotto.`,
        `🍔 Voilà! Hamburger servito per ${nome}!`
    ];

    for (let msg of messages) {
        await conn.reply(m.chat, msg, m, {
            mentions: mentionedJid
        });
        await delay(2000);
    }

    let start = performance.now();
    let end = performance.now();
    let time = (end - start).toFixed(3);

    let finalMessage = `🍔 Hamburger pronto in *${time}ms*! Buon appetito, ${nome}!`;
    await conn.reply(m.chat, finalMessage, m, {
        mentions: mentionedJid
    });
};

handler.command = ['hamburger'];
handler.tags = ['fun'];
handler.help = ['.hamburger @utente'];

export default handler;