//Plugin fatto da Axtral_WiZaRd
import { performance } from "perf_hooks";

let handler = async (m, { conn, text }) => {
    if (!text && !m.quoted) {
        return m.reply("Chi devo ditalinare? Rispondi a un messaggio o scrivi qualcosa tipo:\n*.ditalino @utente*");
    }

    let target;
    let nome;

    if (m.quoted) {
        target = m.quoted.sender;
        nome = '@' + target.split('@')[0];
    } else if (m.mentionedJid && m.mentionedJid.length) {
        target = m.mentionedJid[0];
        nome = '@' + target.split('@')[0];
    } else {
        target = null;
        nome = text;
    }

    // Messaggi animati
    const messaggi = [
        `🤟🏻 Ora faccio un ditalino a *${nome}*...`,
        `👆🏻 Preparati!`,
        `✌🏻 Andiamo avanti...`,
        `☝🏻 Quasi fatto...`,
        `✌🏻 È il momento giusto!`,
        `👋🏻 Fatto?`,
        `👋🏻 Un attimo ancora...`,
        `✌🏻 Wow, sembra promettere bene!`,
        `🤟🏻 Ora ci siamo...`,
        `👋🏻 Ohhssy, ancora, ahhhh!`,
    ];

    let start = performance.now();

    for (let i = 0; i < messaggi.length; i++) {
        await conn.sendMessage(m.chat, {
            text: messaggi[i],
            mentions: i === 0 && target ? [target] : [],
        }, { quoted: m });
        await new Promise(res => setTimeout(res, 500));
    }

    let end = performance.now();
    let durationSec = ((end - start) / 1000).toFixed(2);

    let finale = `✨ *${nome}* è venuta! 🥵 Dopo *${durationSec} secondi*!`;

    await conn.sendMessage(m.chat, {
        text: finale,
        mentions: target ? [target] : [],
    }, { quoted: m });
};

handler.help = ['ditalino @utente'];
handler.tags = ['fun'];
handler.command = /^(ditalino)$/i;

export default handler;