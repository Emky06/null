//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, usedPrefix, text }) => {
    let mention;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
        mention = m.mentionedJid[0];
    } else if (m.quoted) {
        mention = m.quoted.sender;
    } else {
        mention = m.sender;
    }

    const jid = mention;
    const mentions = [jid];

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
😋 *Oh @${jid.split('@')[0]} ha raggiunto il culmine!* 💦
━━━━━━━━━━━━━━━━━━━━━
⏱️💦 *È venuto in: ${tempoVenuto} secondi.*
`.trim();

    return conn.sendMessage(
        m.chat,
        {
            text: finale,
            edit: key,
            mentions
        },
        { quoted: m }
    );
};

handler.help = ['sega @utente'];
handler.tags = ['info', 'tools'];
handler.command = /^(sega)$/i;

export default handler;