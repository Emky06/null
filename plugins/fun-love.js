//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text }) => {
    let mentionedJid = [];

    // Se rispondi a un messaggio
    if (m.quoted) {
        mentionedJid = [m.quoted.sender];
    }
    // Se tagghi qualcuno con @
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        mentionedJid = m.mentionedJid;
    }

    if (mentionedJid.length === 0) {
        return m.reply(`𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐!\nEsempio: *.amore @utente*`);
    }

    let target = mentionedJid[0];
    let percentuale = Math.floor(Math.random() * 100);

    let love = `─────────────────────
𝐂𝐀𝐋𝐂𝐎𝐋𝐀𝐓𝐎𝐑𝐄 𝐃𝐈 𝐀𝐌𝐎𝐑𝐄 ❤️
Affinità tra @${target.split('@')[0]} e te: ${percentuale}%
─────────────────────`;

    let message;
    if (percentuale >= 80) {
        message = `😍 *Anime gemelle!* 💖`;
    } else if (percentuale >= 60) {
        message = `😊 *Buona affinità!* 💞`;
    } else if (percentuale >= 40) {
        message = `😅 *Non è male!*`;
    } else if (percentuale >= 20) {
        message = `😕 *Meglio amici!*`;
    } else {
        message = `😬 *Più odio che amore!*`;
    }

    await conn.sendMessage(m.chat, {
        text: love + '\n' + message,
        contextInfo: {
            mentionedJid: [target]
        }
    }, { quoted: m });
};

handler.help = ['love'];
handler.tags = ['fun'];
handler.command = /^(love|amore)$/i;

export default handler;