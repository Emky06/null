//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text }) => {
    // Controlla se c'è testo o risposta/tag
    if (!text && !m.quoted && !m.mentionedJid?.length)
        return m.reply("𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐!");

    // Prendi la persona taggata o quella a cui si risponde
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) return m.reply("𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐!");

    // Prendi il nome da text o dal contatto
    let name = text || (await conn.getName(user));

    // Calcolo della percentuale
    let percentage = Math.floor(Math.random() * 101);

    // Frase finale in base alla percentuale
    let finalPhrase = percentage >= 50 
        ? "🤔 *Wow, la situazione è grave! Potrebbe essere troppo tardi...*" 
        : "😅 *C'è ancora speranza, ma attenzione!*";

    // Messaggio completo con menzione
    let message = `
━━━━━━━━━━━━━━━━━━━━━
🤪 *CALCOLATORE DI RINCOGLIONIMENTO* 🤪
━━━━━━━━━━━━━━━━━━━━━
😵 *@${user.split('@')[0]} è rincoglionito al:*  
💥 *${percentage}%* di livello! 💥
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    m.reply(message, null, { mentions: [user] });
};

handler.command = /^(rincoglionito)$/i;
export default handler;