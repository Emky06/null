let handler = async (m, { conn }) => {
    let mentionedJid = m.mentionedJid || [];
    let target;

    if (mentionedJid.length > 0) {
        target = mentionedJid[0];
    } else if (m.quoted) {
        target = m.quoted.sender;
    } else {
        return m.reply(`Devi taggare una persona o rispondere a un suo messaggio!\nEsempio: *.cane @utente*`);
    }

    let grandezze = [
        { testo: "🐶 Cagnolino inutile che abbaia solo quando è al sicuro.", min: 1, max: 5 },
        { testo: "🐕 Fa il duro ma tremi appena lo guardano negli occhi.", min: 6, max: 15 },
        { testo: "🦴 Ringhia dietro lo schermo perché nella realtà non apri bocca.", min: 16, max: 30 },
        { testo: "🐕‍🦺 Ti credi un cane da guerra ma sembri solo un barboncino nervoso.", min: 31, max: 50 },
        { testo: "🐺 Bestia rumorosa che abbaia a tutti ma non morde mai.", min: 51, max: 70 },
        { testo: "💀 Cane randagio della tastiera, aggressivo solo online e inutile nella vita reale.", min: 71, max: 100 }
    ];

    let scelta = grandezze[Math.floor(Math.random() * grandezze.length)];
    let misura = Math.floor(Math.random() * (scelta.max - scelta.min + 1)) + scelta.min;

    let messaggio = `*🔎 Analizzando quanto cane è @${target.split('@')[0]}...*\n\n` +
                    `📊 *Risultato:* ${misura}%\n` +
                    `🔥 *Verdetto:* ${scelta.testo}`;

    await conn.sendMessage(m.chat, {
        text: messaggio,
        mentions: [target]
    }, { quoted: m });
};

handler.command = ["cane"];

export default handler;