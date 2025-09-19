//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, args, usedPrefix }) => {
    let sender = m.sender;
    let mentionedJid = m.mentionedJid[0] || (m.quoted && m.quoted.sender);

    if (!mentionedJid) {
        return conn.reply(m.chat, `🚨 Devi taggare qualcuno da cui rubare!\nEsempio: *${usedPrefix}ruba @utente*`, m);
    }

    if (mentionedJid === sender) {
        return conn.reply(m.chat, `🙃 Non puoi rubare a te stesso, furbetto...`, m);
    }

    let ladro = global.db.data.users[sender];
    let vittima = global.db.data.users[mentionedJid];

    if (!ladro || !vittima) {
        return conn.reply(m.chat, `⚠️ Qualcosa è andato storto. Assicurati che entrambi abbiano interagito con il bot.`, m);
    }

    const cooldown = 60 * 60 * 1000; // 1 ora
    const now = Date.now();

    if (ladro.lastRob && now - ladro.lastRob < cooldown) {
        let wait = ((cooldown - (now - ladro.lastRob)) / 1000 / 60).toFixed(1);
        return conn.reply(m.chat, `⏳ Devi aspettare ancora *${wait} minuti* prima di tentare un altro furto.`, m);
    }

    if (vittima.money < 100) {
        return conn.reply(m.chat, `💸 L'utente non ha abbastanza soldi da rubare.`, m);
    }

    // Chance polizia: 30%
    const presoDallaPolizia = Math.random() < 0.3;

    if (presoDallaPolizia) {
        let multa = 200;
let daContanti = Math.min(ladro.money, multa);
let restante = multa - daContanti;
let daBanca = Math.min(ladro.bank || 0, restante);

ladro.money -= daContanti;
ladro.bank = (ladro.bank || 0) - daBanca;

ladro.money = Math.max(0, ladro.money);
ladro.bank = Math.max(0, ladro.bank);
        ladro.lastRob = now;

        let saldoTotale = ladro.money + (ladro.bank || 0);
return conn.reply(m.chat, 
    `🚓 *Arrestato!* Hai provato a rubare a @${mentionedJid.split('@')[0]} ma sei stato *preso dalla polizia!*\n💸 Multa: -${multa.toLocaleString('it-IT')}€\n*Saldo attuale:* ${saldoTotale.toLocaleString('it-IT')}€`,
    m, { mentions: [mentionedJid] }
);
    }

    // Furto riuscito
    let importo = Math.floor(Math.random() * 201) + 100; // 100-300€
    importo = Math.min(importo, vittima.money); // Non può rubare più di quanto ha la vittima

    vittima.money -= importo;
    ladro.money += importo;
    ladro.lastRob = now;

    let saldoTotale = ladro.money + (ladro.bank || 0);
return conn.reply(m.chat,
    `🕵️‍♂️ *Furto riuscito!*\nHai rubato ${importo.toLocaleString('it-IT')}€ a @${mentionedJid.split('@')[0]} 💰\n\n*Il tuo saldo totale:* ${saldoTotale.toLocaleString('it-IT')}€`,
    m, { mentions: [mentionedJid] }
);
};

handler.command = /^(ruba)$/i;
export default handler;