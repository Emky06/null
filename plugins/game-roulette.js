//Plugin fatto da Axtral_WiZaRd
import * as baileys from '@whiskeysockets/baileys';

function delay(ms) {
return new Promise(res => setTimeout(res, ms));
}

// Flag per tracciare partite in corso per utente
const rouletteInGame = new Set();

let handler = async (m, { conn, text, command, usedPrefix, args }) => {
let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
let users = global.db.data.users[m.sender];
let colori = ["rosso", "nero"];

if (rouletteInGame.has(m.sender)) {  
    return await conn.reply(m.chat, `⏳ Hai già una partita di roulette in corso, aspetta che finisca prima di iniziare una nuova.`, m);  
}  

let cooldown = 30 * 1000;  
let now = Date.now();  

if (users.lastRoulette && now - users.lastRoulette < cooldown) {  
    let waitTime = ((cooldown - (now - users.lastRoulette)) / 1000).toFixed(1);  
    return await conn.reply(m.chat, `⏳ Devi aspettare *${waitTime} secondi* prima di poter giocare di nuovo alla roulette.`, m);  
}  

let sceltaUtente = args[0]?.toLowerCase();  
let scommessa = parseInt(args[1]);  

if (!sceltaUtente || !colori.includes(sceltaUtente)) {  
    return await conn.reply(m.chat, `🎰 *ROULETTE* 🎰\n\n❌ *Colore non valido!*\n✅ Scegli tra: *${colori.join(" / ")}*\n📌 *Esempio:* \`${usedPrefix}roulette rosso 150\``, m);  
}  

if (isNaN(scommessa) || scommessa <= 0) {  
    return await conn.reply(m.chat, `🎰 *ROULETTE* 🎰\n\n❌ *Inserisci un importo valido da scommettere!*\n📌 *Esempio:* \`${usedPrefix}roulette rosso 150\``, m);  
}  

if (scommessa > 2000) {
    return await conn.reply(
        m.chat,
        `🚫 *Importo troppo alto!*\n💸 Puoi scommettere al massimo *2.000 €* per partita.`,
        m
    );
}

if (scommessa > users.money) {  
    let deficit = scommessa - users.money;  
    return await conn.reply(m.chat, `💸 *Saldo insufficiente!*\n❌ Ti mancano *${deficit.toLocaleString('it-IT')}* € per giocare.`, m);  
}  

// Segna che la partita è iniziata  
rouletteInGame.add(m.sender);  
users.lastRoulette = now;  

// Prepara la sequenza alternata di colori (8 caselle)  
let sequenzaColori = [];  
for (let i = 0; i < 8; i++) {  
    sequenzaColori.push(i % 2 === 0 ? "🟥" : "⬛");  
}  

// Messaggio iniziale  
let messaggio = await conn.reply(m.chat, `🎰 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*`, m);  

// Genera numero casuale di passi totali tra 6 e 12 (meno per ridurre richieste)  
let minGiri = 6;  
let maxGiri = 12;  
let totaleGiri = Math.floor(Math.random() * (maxGiri - minGiri + 1)) + minGiri;  

// Calcola ritardi con rallentamento graduale in 5 secondi totali  
let delayTotale = 4000;  
let pesi = Array.from({ length: totaleGiri }, (_, i) => i + 1);  
let sommaPesi = pesi.reduce((a, b) => a + b, 0);  
let delayStep = pesi.map(p => Math.round((p / sommaPesi) * delayTotale));  

let posizioneFinale = 0;  

for (let i = 0; i < totaleGiri; i++) {  
    posizioneFinale = i % sequenzaColori.length;  
    let riga = sequenzaColori.map((el, idx) => (idx === posizioneFinale ? "⚪" : el)).join(' ');  
    await delay(delayStep[i]);  
    await conn.sendMessage(m.chat, { edit: messaggio.key, text: `🎰 *ROULETTE IN CORSO...*\n\n${riga}` });  
}  

// Determina risultato finale dal colore sulla posizione finale  
let risultato = (posizioneFinale % 2 === 0) ? "rosso" : "nero";  
let vincita = scommessa * 2;  
let coloreEmoji = risultato === "rosso" ? "🟥" : "⬛";  
let rigaFinale = sequenzaColori.map((el, idx) => (idx === posizioneFinale ? "⚪" : el)).join(' ');  

let messaggioRisultato = `🎰 *RISULTATO FINALE:*\n\n${rigaFinale}\n\n⚪ *La pallina si è fermata su:* *${risultato.toUpperCase()}* ${coloreEmoji}`;  

if (sceltaUtente === risultato) {  
    users.money += vincita;  
    messaggioRisultato += `\n\n🎉 *Hai vinto!* +${vincita.toLocaleString('it-IT')} € 💰\n💵 *Saldo attuale:* ${users.money.toLocaleString('it-IT')} €`;  
} else {  
    users.money -= scommessa;  
    messaggioRisultato += `\n\n😢 *Hai perso!* -${scommessa.toLocaleString('it-IT')} €\n💵 *Saldo attuale:* ${users.money.toLocaleString('it-IT')} €`;  
}  

await conn.sendMessage(m.chat, { edit: messaggio.key, text: messaggioRisultato });  

// Rimuovi flag partita in corso per questo utente  
rouletteInGame.delete(m.sender);  

return;

};

handler.command = /^(roulette)$/i;
export default handler;