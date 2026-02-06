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
        return conn.reply(m.chat, `🔫 𝐇𝐚𝐢 𝐠𝐢𝐚̀ 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚 𝐝𝐢 *𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞 𝐫𝐮𝐬𝐬𝐚* 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...`, m);
    }

    let cooldown = 30 * 1000;
    let now = Date.now();

    if (users.lastRussianRoulette && now - users.lastRussianRoulette < cooldown) {
        let wait = ((cooldown - (now - users.lastRussianRoulette)) / 1000).toFixed(1);
        return conn.reply(m.chat, `⏳ 𝐀𝐬𝐩𝐞𝐭𝐭𝐚 *${wait} 𝐬𝐞𝐜𝐨𝐧𝐝𝐢* 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐫𝐢𝐬𝐜𝐡𝐢𝐚𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐥𝐚 𝐯𝐢𝐭𝐚...`, m);
    }

    let scommessa = parseInt(args[0]);
    if (isNaN(scommessa) || scommessa <= 0) {
        return conn.reply(m.chat, `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐚 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞.\n📌 𝐄𝐬𝐞𝐦𝐩𝐢𝐨: \`${usedPrefix}${command} 100\``, m);
    }

    if (scommessa > 100) {
        return conn.reply(m.chat, `🚫 *𝐈𝐦𝐩𝐨𝐫𝐭𝐨 𝐭𝐫𝐨𝐩𝐩𝐨 𝐚𝐥𝐭𝐨!*\n💸 𝐏𝐮𝐨𝐢 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 *𝟏𝟎𝟎 €* 𝐚𝐥𝐥𝐚 𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞 𝐫𝐮𝐬𝐬𝐚.`, m);
}

    if (scommessa > users.money) {
        let diff = scommessa - users.money;
        return conn.reply(m.chat, `💸 *Saldo insufficiente!*\n❌ 𝐓𝐢 𝐦𝐚𝐧𝐜𝐚𝐧𝐨 *${diff.toLocaleString('it-IT')}€* 𝐩𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞.`, m);
    }

    russianRouletteInGame.add(m.sender);
    users.lastRussianRoulette = now;

    let messaggio = await conn.reply(m.chat, `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n🎲 𝐏𝐫𝐞𝐩𝐚𝐫𝐚𝐧𝐝𝐨 𝐥𝐚 𝐩𝐢𝐬𝐭𝐨𝐥𝐚...`, m);

    await delay(2500);
await conn.sendMessage(m.chat, {
    edit: messaggio.key,
    text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n🔄 𝐂𝐚𝐫𝐢𝐜𝐨 𝐮𝐧 𝐬𝐨𝐥𝐨 𝐩𝐫𝐨𝐢𝐞𝐭𝐭𝐢𝐥𝐞 𝐧𝐞𝐥 𝐭𝐚𝐦𝐛𝐮𝐫𝐨...`
});

await delay(2500);
await conn.sendMessage(m.chat, {
    edit: messaggio.key,
    text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n🔁 𝐅𝐚𝐜𝐜𝐢𝐨 𝐠𝐢𝐫𝐚𝐫𝐞 𝐢𝐥 𝐭𝐚𝐦𝐛𝐮𝐫𝐨...\n😰 𝐏𝐮𝐧𝐭𝐨 𝐥𝐚 pistola 𝐚𝐥𝐥𝐚 𝐭𝐮𝐚 𝐭𝐞𝐬𝐭𝐚...`
});

await delay(2500);
await conn.sendMessage(m.chat, {
    edit: messaggio.key,
    text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n😰 𝐏𝐮𝐧𝐭𝐨 𝐥𝐚 𝐩𝐢𝐬𝐭𝐨𝐥𝐚 𝐚𝐥𝐥𝐚 𝐭𝐮𝐚 𝐭𝐞𝐬𝐭𝐚...\n\n*𝐂𝐥𝐢𝐜𝐤!* 🔫`
});

await delay(2500); 

    await delay(1800);

    let colpoInCanne = Math.floor(Math.random() * 3); // da 0 a 2
    let messaggioFinale = '';

    if (colpoInCanne === 0) {
        users.money -= scommessa;
        messaggioFinale = `💥 *𝐁𝐀𝐍𝐆! 𝐒𝐞𝐢 𝐬𝐭𝐚𝐭𝐨 𝐜𝐨𝐥𝐩𝐢𝐭𝐨!*\n😵 𝐇𝐚𝐢 𝐩𝐞𝐫𝐬𝐨 *${scommessa.toLocaleString('it-IT')}€*!\n💰 *𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${users.money.toLocaleString('it-IT')}€`;
    } else {
        let vincita = scommessa * 2;
        users.money += vincita;
        messaggioFinale = `😮 *𝐒𝐞𝐢 𝐬𝐨𝐩𝐫𝐚𝐯𝐯𝐢𝐬𝐬𝐮𝐭𝐨!*\n🎉 𝐇𝐚𝐢 𝐯𝐢𝐧𝐭𝐨 *${vincita.toLocaleString('it-IT')}€*! 💰\n💰 *𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${users.money.toLocaleString('it-IT')}€`;
    }

    await conn.sendMessage(m.chat, { edit: messaggio.key, text: `🔫 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀 - 𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎 𝐅𝐈𝐍𝐀𝐋𝐄*\n\n${messaggioFinale}` });

    russianRouletteInGame.delete(m.sender);
};

handler.command = /^rr$/i;
export default handler;