//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text }) => {
    // Se non hai testo, né risposta, né menzione, fermati
    if (!text && !m.quoted && !m.mentionedJid?.length) throw 'Tagga o rispondi a qualcuno!';

    // Prendi la persona menzionata o quella a cui rispondi
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) throw '𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐!';

    // Prendi il nome della persona menzionata o usa il testo (se presente)
    let name = text || (await conn.getName(user));

    // Calcolo della percentuale di odio
    let percentage = Math.floor(Math.random() * 101);

    // Frase finale basata sulla percentuale
    let finalPhrase = percentage >= 50 
        ? "😡 *Wow, sembra che tra voi due ci sia davvero tensione!*" 
        : "😌 *Forse non è così grave come pensi.*";

    // Messaggio completo
    let hate = `
━━━━━━━━━━━━━━━━━━━━━
🔥𝐂𝐀𝐋𝐂𝐎𝐋𝐀𝐓𝐎𝐑𝐄 𝐃𝐈 𝐎𝐃𝐈𝐎🔥
━━━━━━━━━━━━━━━━━━━━━
👿 *L'odio tra te e* @${user.split('@')[0]}:  
💢 *${percentage}%* di intensità! 💢
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    conn.reply(m.chat, hate, m, { mentions: [user] });
};

handler.command = /^(odio)$/i;
export default handler;