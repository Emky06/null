//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text, isPrems, isBotAdmin }) => {
    if (!isPrems) return conn.reply(m.chat, "⚠️ Questo comando è disponibile solo per moderatori.", m);
    if (!isBotAdmin) return conn.reply(m.chat, "⚠️ Ho bisogno dei permessi di amministratore per chiudere il gruppo.", m);

    const chat = global.db.data.chats[m.chat] || {};
    const now = Date.now();

    // Cooldown globale per chat (1 ora = 3600000 ms)
    if (chat.lastChiudoTemp && (now - chat.lastChiudoTemp) < 3600000) {
        let minutiRimasti = Math.ceil((3600000 - (now - chat.lastChiudoTemp)) / 60000);
        return conn.reply(m.chat, `⏳ Questo comando è già stato usato.\nRiprova tra *${minutiRimasti} minuti*.`, m);
    }

    let [tempo] = text.split(' ');  
    if (!tempo) return conn.reply(m.chat, "⚠️ Usa il comando così: `.chiusotemp <tempo>`\nEsempio: `.chiusotemp 10m` per 10 minuti.", m);  

    // Converti il tempo in millisecondi  
    let durata = parseTime(tempo);  
    if (!durata) return conn.reply(m.chat, "⚠️ Tempo non valido. Usa un formato come `1m`, `5m`, `10m` ... (max 15m).", m);  

    // Calcolo minuti
    let minuti = durata / (60 * 1000);
    if (minuti <= 0 || minuti > 15) {
        return conn.reply(m.chat, "⚠️ Puoi chiudere il gruppo solo da 1 a 15 minuti massimo.", m);
    }

    // Aggiorna timestamp ultimo uso
    chat.lastChiudoTemp = now;
    global.db.data.chats[m.chat] = chat;

    await conn.groupSettingUpdate(m.chat, 'announcement'); // Chiudi il gruppo  
    conn.reply(m.chat, `🔒 *𝐂𝐇𝚲𝐓 𝐏𝚵𝐑 𝐆𝐋𝕀 𝐃𝚵𝕀*\n*𝐂𝐇𝚲𝐓 𝐏𝚵𝐑 𝕀𝐋 𝐏Ꮻ𝐏Ꮻ𝐋Ꮻ 𝐓𝐑𝚲* ${tempo}.`, m);  

    // Riapre il gruppo dopo il tempo specificato  
    setTimeout(async () => {  
        await conn.groupSettingUpdate(m.chat, 'not_announcement'); // Riapri il gruppo  
        conn.reply(m.chat, "🔓 *𝐂𝐇𝚲𝐓 𝚲𝐏𝚵𝐑𝐓𝚲*\n *𝐏𝚲𝐑𝐋𝚲𝐓𝚵 𝐏Ꮻ𝐏Ꮻ𝐋Ꮻ*.", m);  
    }, durata);
};

// Funzione per convertire il tempo in millisecondi (solo minuti)
function parseTime(time) {
    let match = time.match(/^(\d+)(m)$/); // Solo minuti (es. 10m)
    if (!match) return null;

    let value = parseInt(match[1]);  
    if (isNaN(value)) return null;

    return value * 60 * 1000; // minuti in ms
}

handler.command = ['chiusotemp'];
handler.tags = ['premium'];
handler.help = ['.chiusotemp <tempo> (max 15m, 1 volta/ora per chat)'];
handler.group = true;
handler.premium = true;
handler.botAdmin = true;

export default handler;