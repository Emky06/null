//Plugin fatto da Axtral_WiZaRd
function delay(ms) {
return new Promise(res => setTimeout(res, ms));
}


const rouletteInGame = new Set();

let handler = async (m, { conn, text, command, usedPrefix, args }) => {
let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
let users = global.db.data.users[m.sender];
let colori = ["rosso", "nero"];

if (rouletteInGame.has(m.sender)) {  
    return await conn.reply(m.chat, `⏳ 𝐇𝐚𝐢 𝐠𝐢𝐚̀ 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚 𝐝𝐢 𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨, 𝐚𝐬𝐩𝐞𝐭𝐭𝐚 𝐜𝐡𝐞 𝐟𝐢𝐧𝐢𝐬𝐜𝐚 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐢𝐧𝐢𝐳𝐢𝐚𝐫𝐞 𝐮𝐧𝐚 𝐧𝐮𝐨𝐯𝐚.`, m);  
}  

let cooldown = 30 * 1000;  
let now = Date.now();  

if (users.lastRoulette && now - users.lastRoulette < cooldown) {  
    let waitTime = ((cooldown - (now - users.lastRoulette)) / 1000).toFixed(1);  
    return await conn.reply(m.chat, `⏳ 𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 *${waitTime} 𝐬𝐞𝐜𝐨𝐧𝐝𝐢* 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐩𝐨𝐭𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐚𝐥𝐥𝐚 𝐫𝐨𝐮𝐥𝐞𝐭𝐭𝐞.`, m);  
}  

let sceltaUtente = args[0]?.toLowerCase();  
let scommessa = parseInt(args[1]);  

if (!sceltaUtente || !colori.includes(sceltaUtente)) {  
    return await conn.reply(m.chat, `🎰 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄* 🎰\n\n❌ *𝐂𝐨𝐥𝐨𝐫𝐞 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨!*\n✅ 𝐒𝐜𝐞𝐠𝐥𝐢 𝐭𝐫𝐚: *${colori.join(" / ")}*\n📌 *𝐄𝐬𝐞𝐦𝐩𝐢𝐨:* \`${usedPrefix}roulette rosso 100\``, m);  
}  

if (isNaN(scommessa) || scommessa <= 0) {  
    return await conn.reply(m.chat, `🎰 *ROULETTE* 🎰\n\n❌ *𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐚 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞!*\n📌 *𝐄𝐬𝐞𝐦𝐩𝐢𝐨:* \`${usedPrefix}roulette rosso 100\``, m);  
}  

if (scommessa > 100) {
    return await conn.reply(
        m.chat,
        `🚫 *𝐈𝐦𝐩𝐨𝐫𝐭𝐨 𝐭𝐫𝐨𝐩𝐩𝐨 𝐚𝐥𝐭𝐨!*\n💸 𝐏𝐮𝐨𝐢 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 *𝟏𝟎𝟎 €* 𝐩𝐞𝐫 𝐩𝐚𝐫𝐭𝐢𝐭𝐚.`,
        m
    );
}

if (scommessa > users.money) {  
    let deficit = scommessa - users.money;  
    return await conn.reply(m.chat, `💸 *Saldo insufficiente!*\n❌ 𝐓𝐢 𝐦𝐚𝐧𝐜𝐚𝐧𝐨 *${deficit.toLocaleString('it-IT')}* € 𝐩𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞.`, m);  
}  

rouletteInGame.add(m.sender);  
users.lastRoulette = now;  
  
let sequenzaColori = [];  
for (let i = 0; i < 8; i++) {  
    sequenzaColori.push(i % 2 === 0 ? "🟥" : "⬛");  
}  

// Messaggio iniziale  
let messaggio = await conn.reply(m.chat, `🎰 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*`, m);  
 
let minGiri = 6;  
let maxGiri = 12;  
let totaleGiri = Math.floor(Math.random() * (maxGiri - minGiri + 1)) + minGiri;  

let delayTotale = 4000;  
let pesi = Array.from({ length: totaleGiri }, (_, i) => i + 1);  
let sommaPesi = pesi.reduce((a, b) => a + b, 0);  
let delayStep = pesi.map(p => Math.round((p / sommaPesi) * delayTotale));  

let posizioneFinale = 0;  

for (let i = 0; i < totaleGiri; i++) {  
    posizioneFinale = i % sequenzaColori.length;  
    let riga = sequenzaColori.map((el, idx) => (idx === posizioneFinale ? "⚪" : el)).join(' ');  
    await delay(delayStep[i]);  
    await conn.sendMessage(m.chat, { edit: messaggio.key, text: `🎰 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*\n\n${riga}` });  
}  

let risultato = (posizioneFinale % 2 === 0) ? "rosso" : "nero";  
let vincita = scommessa * 2;  
let coloreEmoji = risultato === "rosso" ? "🟥" : "⬛";  
let rigaFinale = sequenzaColori.map((el, idx) => (idx === posizioneFinale ? "⚪" : el)).join(' ');  

let messaggioRisultato = `🎰 *𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎 𝐅𝐈𝐍𝐀𝐋𝐄:*\n\n${rigaFinale}\n\n⚪ *𝐋𝐚 𝐩𝐚𝐥𝐥𝐢𝐧𝐚 𝐬𝐢 𝐞̀ 𝐟𝐞𝐫𝐦𝐚𝐭𝐚 𝐬𝐮:* *${risultato.toUpperCase()}* ${coloreEmoji}`;  

if (sceltaUtente === risultato) {  
    users.money += vincita;  
    messaggioRisultato += `\n\n🎉 *𝐇𝐚𝐢 𝐯𝐢𝐧𝐭𝐨!* +${vincita.toLocaleString('it-IT')} € 💰\n💵 *𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${users.money.toLocaleString('it-IT')} €`;  
} else {  
    users.money -= scommessa;  
    messaggioRisultato += `\n\n😢 *𝐇𝐚𝐢 𝐩𝐞𝐫𝐬𝐨!* -${scommessa.toLocaleString('it-IT')} €\n💵 *𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞:* ${users.money.toLocaleString('it-IT')} €`;  
}  

await conn.sendMessage(m.chat, { edit: messaggio.key, text: messaggioRisultato });  


rouletteInGame.delete(m.sender);  

return;

};

handler.command = /^(roulette)$/i;
export default handler;