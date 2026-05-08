//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text }) => {

    let width = Math.floor(Math.random() * 31);

    let finalPhrase = width >= 8 
        ? "🔥 *Complimenti, siamo su livelli impressionanti!*"
        : "😅 *Un risultato discreto, c'è sempre margine di miglioramento!*";

    let jid;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (m.quoted) {
        jid = m.quoted.sender;
    } else {
        jid = m.sender;
    }

    let targetName = `@${jid.split('@')[0]}`;

    let message = `
━━━━━━━━━━━━━━━━━━━━━
*CALCOLATORE DI APERTURA📏*
━━━━━━━━━━━━━━━━━━━━━
🔍 ${targetName} ha un'apertura stimata di:  
👉 *${width} cm🥔!*  
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    await conn.sendMessage(m.chat, {
        text: message,
        mentions: [jid]
    }, { quoted: m });
};

handler.command = /^(figa)$/i;

export default handler;