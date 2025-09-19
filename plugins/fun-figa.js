//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text }) => {
    let width = Math.floor(Math.random() * 31);

    let finalPhrase = width >= 8 
        ? "🔥 *Complimenti, siamo su livelli impressionanti!*"
        : "😅 *Un risultato discreto, c'è sempre margine di miglioramento!*";

    // Determina chi menzionare
    let targetName = text;

    if (!text && m.quoted) {
        targetName = '@' + m.quoted.sender.split('@')[0];
    }

    if (!text && m.mentionedJid && m.mentionedJid.length > 0) {
        targetName = '@' + m.mentionedJid[0].split('@')[0];
    }

    if (!targetName) {
        return m.reply('Scrivi un nome, tagga qualcuno o rispondi a un messaggio!\nEsempio: *.figa @utente*');
    }

    let message = `
━━━━━━━━━━━━━━━━━━━━━
*CALCOLATORE DI APERTURA📏*
━━━━━━━━━━━━━━━━━━━━━
🔍 *${targetName}* ha un'apertura stimata di:  
👉 *${width} cm🥔!*  
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    await conn.sendMessage(m.chat, {
        text: message,
        mentions: [ ...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : []) ]
    }, { quoted: m });
};

handler.command = /^(figa)$/i;

export default handler;