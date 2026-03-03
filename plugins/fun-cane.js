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

    let livelli = [
        { testo: "🤡 0% Cane — Sei il tipo che abbaia solo quando non c'è nessuno.", min: 0, max: 5 },
        { testo: "🐀 10% Cane — Più topo di fogna che cane da guardia.", min: 6, max: 20 },
        { testo: "🗑️ 25% Cane — Fai rumore ma non servi a niente.", min: 21, max: 40 },
        { testo: "🐩 50% Cane — Ti credi feroce ma sembri uscito dal parrucchiere.", min: 41, max: 60 },
        { testo: "💩 75% Cane — Abbaia tanto, cervello poco.", min: 61, max: 85 },
        { testo: "🔥 100% CANE DA TASTIERA — Aggressivo solo online, dal vivo muto totale.", min: 86, max: 100 }
    ];

    let scelta = livelli[Math.floor(Math.random() * livelli.length)];
    let percentuale = Math.floor(Math.random() * (scelta.max - scelta.min + 1)) + scelta.min;

    let messaggio = `*☣️ SCANSIONE IN CORSO: quanto cane è @${target.split('@')[0]}...*\n\n` +
                    `📊 *Livello tossicità:* ${percentuale}%\n` +
                    `💀 *Verdetto finale:* ${scelta.testo}\n\n` +
                    `⚠️ Consiglio: meno abbaiare, più dignità.`;

    await conn.sendMessage(m.chat, {
        text: messaggio,
        mentions: [target]
    }, { quoted: m });
};

handler.command = ["cane"];

export.default handler: