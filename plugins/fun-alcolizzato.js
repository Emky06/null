//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {

    let mentionedJid = m.mentionedJid || [];
    let target;

    if (mentionedJid.length > 0) {
        target = mentionedJid[0];
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else {
        return m.reply(`Devi taggare una persona o rispondere ad un messaggio!\nEsempio: *.alcolizzato @utente*`);
    }

    let width = Math.floor(Math.random() * 31);

    let finalPhrase = width >= 8 
        ? "👮 *Il soggetto sembra mantenere un comportamento sobrio*"
        : "😅 *Il bro sta scivolando verso la tristezza alcolica*";

    let message = `
━━━━━━━━━━━━━━━━━━━━━
*MOMENTO DEL TEST DELL'ALCOL!🍷*
━━━━━━━━━━━━━━━━━━━━━
🍷 *Alcolicità di @${target.split("@")[0]}* : ${width}%
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    await conn.sendMessage(m.chat, {
        text: message,
        mentions: [target]
    }, { quoted: m });
};

handler.command = /^(alcolizzato)$/i;

export default handler;