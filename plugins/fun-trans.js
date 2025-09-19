let handler = async (m, { conn, command, text }) => {
    if (!text && !m.quoted && !m.mentionedJid?.length) throw 'Tagga o rispondi a qualcuno!';

    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) throw 'Tagga o rispondi a qualcuno!';

    let name = text || (await conn.getName(user));

    // Calcolo della percentuale di "transgender"
    let percentage = Math.floor(Math.random() * 101);

    // Frase finale basata sulla percentuale
    let finalPhrase = percentage >= 50 
        ? "🏳️‍⚧️ *Ci avrei scommesso che li sotto c'era la sorpresa!*"
        : "😅 *C'è ancora un po' di strada da fare*";

    // Messaggio completo
    let message = `
━━━━━━━━━━━━━━━━━━━━━
🏳️‍⚧️ *CALCOLATORE DI TRANS* 🏳️‍⚧️
━━━━━━━━━━━━━━━━━━━━━
🌈 *@${user.split('@')[0]} è trans al:*  
⚡ *${percentage}%* di livello! ⚡
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    conn.reply(m.chat, message, m, { mentions: [user] });
};

handler.command = /^(trans)$/i;

export default handler;