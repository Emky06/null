// Plugin fatto da Axtral_WiZaRd
function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const russianRouletteInGame = new Set();

let handler = async (m, { conn, usedPrefix, command, args }) => {
    let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
    let users = global.db.data.users[m.sender];

    if (russianRouletteInGame.has(m.sender)) {
        return conn.reply(m.chat, `🔫 Hai già una partita di *roulette russa* in corso...`, m);
    }

    let cooldown = 30 * 1000;
    let now = Date.now();

    if (users.lastRussianRoulette && now - users.lastRussianRoulette < cooldown) {
        let wait = ((cooldown - (now - users.lastRussianRoulette)) / 1000).toFixed(1);
        return conn.reply(m.chat, `⏳ Aspetta *${wait} secondi* prima di rischiare di nuovo la vita...`, m);
    }

    let scommessa = parseInt(args[0]);
    if (isNaN(scommessa) || scommessa <= 0) {
        return conn.reply(m.chat, `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n❌ Inserisci un importo valido da scommettere.\n📌 Esempio: \`${usedPrefix}${command} 200\``, m);
    }

    if (scommessa > 1000) {
        return conn.reply(m.chat, `🚫 *Importo troppo alto!*\n💸 Puoi scommettere al massimo *1.000 €* alla roulette russa.`, m);
}

    if (scommessa > users.money) {
        let diff = scommessa - users.money;
        return conn.reply(m.chat, `💸 *Saldo insufficiente!*\n❌ Ti mancano *${diff.toLocaleString('it-IT')}€* per giocare.`, m);
    }

    russianRouletteInGame.add(m.sender);
    users.lastRussianRoulette = now;

    // Messaggio iniziale
    let messaggio = await conn.reply(m.chat, `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n🎲 Preparando la pistola...`, m);

    await delay(2500);
await conn.sendMessage(m.chat, {
    edit: messaggio.key,
    text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n🔄 Carico un solo proiettile nel tamburo...`
});

await delay(2500);
await conn.sendMessage(m.chat, {
    edit: messaggio.key,
    text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n🔁 Faccio girare il tamburo...\n😰 Punto la pistola alla tua testa...`
});

await delay(2500);
await conn.sendMessage(m.chat, {
    edit: messaggio.key,
    text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n😰 Punto la pistola alla tua testa...\n\n*Click!* 🔫`
});

await delay(2500); // prima del risultato finale

    await delay(1800);

    let colpoInCanne = Math.floor(Math.random() * 3); // da 0 a 2
    let messaggioFinale = '';

    if (colpoInCanne === 0) {
        users.money -= scommessa;
        messaggioFinale = `💥 *BANG! Sei stato colpito!*\n😵 Hai perso *${scommessa.toLocaleString('it-IT')}€*!\n💰 *Saldo attuale:* ${users.money.toLocaleString('it-IT')}€`;
    } else {
        let vincita = scommessa * 2;
        users.money += vincita;
        messaggioFinale = `😮 *Sei sopravvissuto!*\n🎉 Hai vinto *${vincita.toLocaleString('it-IT')}€*! 💰\n💰 *Saldo attuale:* ${users.money.toLocaleString('it-IT')}€`;
    }

    await conn.sendMessage(m.chat, { edit: messaggio.key, text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀 - RISULTATO FINALE*\n\n${messaggioFinale}` });

    russianRouletteInGame.delete(m.sender);
};

handler.command = /^rr$/i;
export default handler;