//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, usedPrefix, text }) => {
    let target;

    if (m.quoted) {
        target = m.quoted.sender;
    } else if (text) {
        let match = text.match(/@?(\d{5,})/);
        if (match) {
            target = match[1] + '@s.whatsapp.net';
        }
    }

    if (!target) return m.reply(
        `Chi devo taggare?\nUsa: *${usedPrefix}sega @utente*\nOppure rispondi a un messaggio`
    );

    let tempoVenuto = (Math.random() * 4.9 + 0.1).toFixed(1);

    let { key } = await conn.sendMessage(
        m.chat,
        { text: "💥Preparati, il motore si scalda..." },
        { quoted: m }
    );

    await new Promise(r => setTimeout(r, 1000));

    const array = [
        "8==👊==D",
        "8===👊=D",
        "8=👊===D",
        "8==👊==D",
        "8===👊=D",
        "8=👊===D",
        "8==👊==D💦",
        "8===👊=D💦",
        "8=👊===D💦",
        "8===👊=D💦💦"
    ];

    for (let item of array) {
        await conn.sendMessage(
            m.chat,
            { text: item, edit: key },
            { quoted: m }
        );
        await new Promise(r => setTimeout(r, 500));
    }

    let finale = `
━━━━━━━━━━━━━━━━━━━━━
😋 *Oh @${target.split('@')[0]} ha raggiunto il culmine!* 💦
━━━━━━━━━━━━━━━━━━━━━
⏱️💦 *È venuto in: ${tempoVenuto} secondi.*
`.trim();

    return conn.sendMessage(
        m.chat,
        {
            text: finale,
            edit: key,
            mentions: [target]
        },
        { quoted: m }
    );
};

handler.help = ['sega @utente'];
handler.tags = ['info', 'tools'];
handler.command = /^(sega)$/i;

export default handler;