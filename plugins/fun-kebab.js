//Plugin fatto da Axtral_WiZaRd
import { performance } from "perf_hooks";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, text }) => {
    let target;

    if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else {
        target = m.sender;
    }

    let tag = '@' + target.split('@')[0];

    let messages = [
        `🍢 Inizio a preparare un Kebab per ${tag}...`,
        `🍖 Sto affettando la carne!`,
        `🥗 Aggiungo le verdure fresche...`,
        `🫓 Prendo il pane caldo.`,
        `🌶️ Un tocco di salsa segreta!`,
        `🔥 Il Kebab è quasi pronto...`,
        `🥙 Voilà! Kebab servito per ${tag}!`
    ];

    for (let msg of messages) {
        await conn.reply(m.chat, msg, m, {
            mentions: [target]
        });
        await delay(2000);
    }

    let start = performance.now();
    let end = performance.now();
    let time = (end - start).toFixed(3);

    let finalMessage = `🍢 Kebab preparato in *${time}ms*! Buon appetito, ${tag}!`;
    await conn.reply(m.chat, finalMessage, m, {
        mentions: [target]
    });
};

handler.command = ['kebab'];
handler.tags = ['fun'];
handler.help = ['.kebab (rispondi o tagga qualcuno)'];

export default handler;