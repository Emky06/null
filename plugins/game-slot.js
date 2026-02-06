//Plugin fatto da Axtral_WiZaRd
function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const slotInGame = new Set();

function generaSlotPersonalizzato() {
    const emojis = ["💎", "💰", "👑"];
    const tipo = Math.floor(Math.random() * 3);

    if (tipo === 0) {
        const e = emojis[Math.floor(Math.random() * emojis.length)];
        return [e, e, e];
    }

    if (tipo === 1) {
        const dup = emojis[Math.floor(Math.random() * emojis.length)];
        let altri = emojis.filter(e => e !== dup);
        const singolo = altri[Math.floor(Math.random() * altri.length)];
        const pos = Math.floor(Math.random() * 3);
        let slot = [dup, dup, dup];
        slot[pos] = singolo;
        return slot;
    }

    if (tipo === 2) {
        let copia = [...emojis];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }
}

let handler = async (m, { conn, args, usedPrefix }) => {
let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
    let users = global.db.data.users[m.sender];
    let cooldown = 30 * 1000;
    let now = Date.now();

    if (slotInGame.has(m.sender)) {
        return await conn.reply(m.chat, `⏳ 𝐇𝐚𝐢 𝐠𝐢𝐚̀ 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚 𝐝𝐢 𝐬𝐥𝐨𝐭 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨, 𝐚𝐬𝐩𝐞𝐭𝐭𝐚 𝐜𝐡𝐞 𝐟𝐢𝐧𝐢𝐬𝐜𝐚.`, m);
    }

    if (users.lastSlot && now - users.lastSlot < cooldown) {
        let waitTime = ((cooldown - (now - users.lastSlot)) / 1000).toFixed(1);
        return await conn.reply(m.chat, `⏳ 𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 *${waitTime} 𝐬𝐞𝐜𝐨𝐧𝐝𝐢* 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐩𝐨𝐭𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐚𝐥𝐥𝐚 𝐬𝐥𝐨𝐭.`, m);
    }

    let scommessa = parseInt(args[0]);
    if (!scommessa || isNaN(scommessa) || scommessa <= 0) {
        return await conn.reply(m.chat, `🎰 𝐔𝐬𝐚: ${usedPrefix}slot <importo>`, m);
    }
   
     if (scommessa > 100) {
  return await conn.reply(m.chat, `🚫 *𝐋𝐢𝐦𝐢𝐭𝐞 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐬𝐮𝐩𝐞𝐫𝐚𝐭𝐨!*
𝐏𝐮𝐨𝐢 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 *𝟏𝟎𝟎 €* 𝐩𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐭𝐚.`, m);
}
    
    if (scommessa > users.money) {
        return await conn.reply(m.chat, `💸 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢. 𝐓𝐢 𝐦𝐚𝐧𝐜𝐚𝐧𝐨 ${ (scommessa - users.money).toLocaleString('it-IT') }€`, m);
    }

    slotInGame.add(m.sender);

    function formattaSlot(slot) {
        return `🎰 *𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄* 🎰\n\n` +
               `╔═══════════╗\n` +
               `║ ${slot[0]} │ ${slot[1]} │ ${slot[2]}  ║\n` +
               `╚═══════════╝`;
    }

    let messaggio = await conn.reply(m.chat, `🎰 *𝐒𝐥𝐨𝐭 𝐦𝐚𝐜𝐡𝐢𝐧𝐞 𝐢𝐧 𝐩𝐚𝐫𝐭𝐞𝐧𝐳𝐚...*`, m);
    let frames = 5;
    let finalSlot = [];

    for (let i = 0; i < frames; i++) {
        let slot = generaSlotPersonalizzato();
        if (i === frames - 1) finalSlot = slot;

        let testo = formattaSlot(slot) + `\n\n${i === frames - 1 ? '🎲 *𝐂𝐚𝐥𝐜𝐨𝐥𝐨 𝐫𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨...*' : '🎰 *𝐑𝐨𝐭𝐚𝐳𝐢𝐨𝐧𝐞...*'}`;
        await delay(800);
        await conn.sendMessage(m.chat, { text: testo, edit: messaggio.key });
    }

    let vincita = 0;
    let testoFinale = formattaSlot(finalSlot) + '\n\n';

    if (finalSlot.every(s => s === finalSlot[0])) {
        vincita = scommessa * 2;
        users.money += vincita;
        testoFinale += `🎉 *𝐇𝐀𝐈 𝐕𝐈𝐍𝐓𝐎!*\n+${vincita.toLocaleString('it-IT')}€\n*𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${users.money.toLocaleString('it-IT')}€`;
    } else if (
        finalSlot[0] === finalSlot[1] ||
        finalSlot[1] === finalSlot[2] ||
        finalSlot[0] === finalSlot[2]
    ) {
        vincita = Math.floor(scommessa / 2);
        users.money += vincita;
        testoFinale += `😊 *Vincita parziale!*\n+${vincita.toLocaleString('it-IT')}€\n*Saldo attuale:* ${users.money.toLocaleString('it-IT')}€`;
    } else {
        users.money -= scommessa;
        testoFinale += `😢 *𝐇𝐚𝐢 𝐩𝐞𝐫𝐬𝐨!*\n-${scommessa.toLocaleString('it-IT')}€\n*𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${users.money.toLocaleString('it-IT')}€`;
    }

    await delay(800);
    await conn.sendMessage(m.chat, { text: testoFinale, edit: messaggio.key });
    slotInGame.delete(m.sender);
    users.lastSlot = now;
};

handler.command = /^(slot)$/i;
export default handler;