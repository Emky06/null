let handler = async (m, { conn, command, text }) => {
    if (!text && !m.quoted && !m.mentionedJid?.length) throw 'Tagga o rispondi a qualcuno!';

    // Prendi la persona menzionata o quella a cui rispondi
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) throw 'Tagga o rispondi a qualcuno!';

    // Lista di taglie
    let boobsSizes = ['prima', 'seconda', 'terza', 'quarta', 'quinta', 'sesta', 'settima'];

    // Scelta casuale
    let size = pickRandom(boobsSizes);

    // Estrai numero senza dominio per il tag testuale
    let number = user.split('@')[0];

    // Messaggio finale con tag
    let message = `*🍒 CALCOLATORE DI TAGLIA 🍒*
━━━━━━━━━━━━━━━━━━━━━
🔍 @${number} tiene una: 👉 *${size}* 🍒
━━━━━━━━━━━━━━━━━━━━━`.trim();

    // Risposta con menzione corretta
    conn.reply(m.chat, message, m, { mentions: [user] });
};

// Funzione per scelta casuale
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

handler.help = ['tette'];
handler.tags = ['fun'];
handler.command = /^(tette)$/i;

export default handler;