//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text }) => {
    if (!text && !m.quoted && !m.mentionedJid?.length) throw '𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐!';

    // Prendi la persona menzionata o quella a cui rispondi
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) throw 'Tagga o rispondi a qualcuno!';

    // Estrai il numero senza dominio per il tag testuale
    let number = user.split('@')[0];

    let message = `
*📏CALCOLATORE DI MISURA📏*
━━━━━━━━━━━━━━━━━━━━━
🔍 @${number} ha una lunghezza stimata di:
👉 *${Math.floor(Math.random() * 31)} cm🍆*
━━━━━━━━━━━━━━━━━━━━━
`.trim();

    conn.reply(m.chat, message, m, { mentions: [user] });
};

handler.help = ['calcolatore'];
handler.tags = ['divertimento'];
handler.command = /^(pene|pisello)$/i;

export default handler;