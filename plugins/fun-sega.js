let handler = async (m, { conn, usedPrefix, text }) => {
    let target;

    // Se è una risposta a un messaggio, usa l'autore del messaggio risposto
    if (m.quoted) {
        target = m.quoted.sender;
        text = '@' + target.split('@')[0];
    } else {
        // Altrimenti cerca il tag nel messaggio
        let mentionedJid = text.match(/@(\d{5,})/);
        target = mentionedJid ? mentionedJid[1] + '@s.whatsapp.net' : null;
    }

    if (!target) return m.reply(`Chi devo taggare? Usa il comando così:\n*${usedPrefix}sega @utente*\nOppure rispondi a un messaggio con *${usedPrefix}sega*`);

    // Tempo a caso da 0.1 a 5.0 secondi
    let tempoVenuto = (Math.random() * 4.9 + 0.1).toFixed(1);

    let { key } = await conn.sendMessage(m.chat, { text: "💥Preparati, il motore si scalda..." }, { quoted: m });

    // Aspetta 1 secondo prima di iniziare l’animazione
    await new Promise(resolve => setTimeout(resolve, 1000));

    const array = [
        "8==👊==D", "8===👊=D", "8=👊===D", "8==👊==D",
        "8===👊=D", "8=👊===D", "8==👊==D💦", "8===👊=D💦",
        "8=👊===D💦", "8===👊=D💦💦"
    ];

    for (let item of array) {
        await conn.sendMessage(m.chat, { text: `${item}`, edit: key }, { quoted: m });
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    let finale = `
━━━━━━━━━━━━━━━━━━━━━
😋 *Oh ${text} ha raggiunto il culmine!* 💦
━━━━━━━━━━━━━━━━━━━━━
⏱️💦 *È venuto in: ${tempoVenuto} secondi.*
`.trim();

    return conn.sendMessage(
        m.chat,
        { text: finale, edit: key, mentions: [target] },
        { quoted: m }
    );
};

handler.help = ['sega @utente'];
handler.tags = ['info', 'tools'];
handler.command = /^(sega)$/i;

export default handler;