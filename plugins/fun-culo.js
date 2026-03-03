//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, usedPrefix, text }) => {
    let mentionedJid = m.mentionedJid || [];
    let target;

    // Se viene menzionato qualcuno
    if (mentionedJid.length > 0) {
        target = mentionedJid[0];
    }
    // Se si risponde a un messaggio
    else if (m.quoted) {
        target = m.quoted.sender;
    }
    // Se non c'è né mention né reply
    else {
        return m.reply(`Devi taggare una persona o rispondere a un suo messaggio!\nEsempio: *.ano @utente*`);
    }

    // Range e frasi
    let grandezze = [
        { testo: "🟢 Piccolo come una formica 🐜", min: 1, max: 5 },
        { testo: "🔵 Normale, niente di speciale 😌", min: 6, max: 10 },
        { testo: "🟠 Medio, ci passa un dito 🖕", min: 11, max: 15 },
        { testo: "🔴 Enorme! Ci passa una bottiglia 🍾", min: 25, max: 35 },
        { testo: "⚫ Distrutto, sembra un tunnel ferroviario 🚇", min: 45, max: 60 },
        { testo: "💥 Non hai più un buco, è esploso 💣", min: 70, max: 100 }
    ];

    let scelta = grandezze[Math.floor(Math.random() * grandezze.length)];
    let misura = Math.floor(Math.random() * (scelta.max - scelta.min + 1)) + scelta.min;

    let messaggio = `*Analizzando il buco di @${target.split('@')[0]}...*\n\n📏 *Risultato:* ${scelta.testo}\n📏 *Apertura di:* ${misura} cm`;

    await conn.sendMessage(m.chat, { 
        text: messaggio, 
        mentions: [target] 
    }, { quoted: m });
};

handler.command = ["ano", "culo"];
export default handler;