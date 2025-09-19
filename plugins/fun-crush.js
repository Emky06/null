//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text }) => {
    let targetName = text;

    // Se rispondi a un messaggio
    if (!text && m.quoted) {
        targetName = '@' + m.quoted.sender.split('@')[0];
    }

    // Se tagghi con @ ma senza testo esplicito
    if (!text && m.mentionedJid && m.mentionedJid.length > 0) {
        targetName = '@' + m.mentionedJid[0].split('@')[0];
    }

    if (!targetName) {
        return m.reply('Scrivi il nome della tua crush, tagga qualcuno o rispondi a un messaggio!\nEsempio: *.crush Asia*');
    }

    let percentuale = Math.floor(Math.random() * 101);
    let love = `*💘CALCOLATORE DI AMORE💘*
━━━━━━━━━━━━━━━━━━━━━
🌹 *Amore dei tuoi sogni:* ${targetName}
💌 *Livello di amore:* *${percentuale}%* su *100%*
━━━━━━━━━━━━━━━━━━━━━
❓ *Perché non ti dichiari?*
🤔 *L'amore potrebbe sorprenderti!*`;

    await conn.sendMessage(m.chat, {
        text: love,
        mentions: [ ...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : []) ]
    }, { quoted: m });
};

handler.help = ['crush'];
handler.tags = ['fun'];
handler.command = /^(crush)$/i;

export default handler;