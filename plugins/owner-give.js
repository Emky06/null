import fetch from 'node-fetch';
import fs from 'fs';

let HF_SPACE_URL = process.env.HF_SPACE_URL;
let HF_TOKEN = process.env.HF_TOKEN;

try {
    const configFile = fs.readFileSync('give.txt', 'utf-8');
    const lines = configFile.split('\n');
    for (const line of lines) {
        if (line.startsWith('HF_SPACE_URL=')) {
            HF_SPACE_URL = line.split('=')[1].trim();
        } else if (line.startsWith('HF_TOKEN=')) {
            HF_TOKEN = line.split('=')[1].trim();
        }
    }
} catch (err) {
    console.log('give.txt non trovato, uso variabili ambiente');
}

const HF_SPACE_KEY = HF_TOKEN; 
const MAX_RESULTS = 5;

if (!global._giveKinderQueue) global._giveKinderQueue = [];
if (global._giveKinderRunning === undefined) global._giveKinderRunning = false;

function enqueueSearch(userId, task) {
    if (global._giveKinderQueue.some(e => e.userId === userId)) return false;
    global._giveKinderQueue.push({ userId, task });
    processQueue();
    return true;
}

async function processQueue() {
    if (global._giveKinderRunning || global._giveKinderQueue.length === 0) return;
    global._giveKinderRunning = true;
    const { task } = global._giveKinderQueue.shift();
    try {
        await task();
    } finally {
        global._giveKinderRunning = false;
        processQueue();
    }
}

async function searchHF(searchTerm, searchType) {
    console.log(`[give-kinder] searchHF API: term="${searchTerm}" type="${searchType}"`);
    const params = new URLSearchParams({ type: searchType, q: searchTerm, key: HF_SPACE_KEY });
    const res = await fetch(`https://${HF_SPACE_URL}/search?${params}`, {
        headers: { 'User-Agent': 'varebot-kinder', 'Authorization': `Bearer ${HF_TOKEN}` }
    });
    if (!res.ok) throw new Error(`Search API ${res.status}: ${res.statusText}`);
    const json = await res.json();
    console.log(`[give-kinder] Totale: ${json.count} risultati`);
    return json.results || [];
}

function normalizePhoneNumber(phoneNumber) {
    return phoneNumber.replace(/[^\d]/g, '');
}

function formatResult(line) {
    const parts = line.trim().split(':').map(p => p.trim());

    const numero         = parts[0] || 'N/A';
    const id             = parts[1] || 'N/A';
    const nome           = parts[2] || 'N/A';
    const cognome        = parts[3] || 'N/A';
    const genere         = parts[4] || 'N/A';
    const cittaHome      = parts[5] || 'N/A';
    const cittaWork      = parts[6] || 'N/A';
    const statoRelazione = parts[7] || 'N/A';
    const lavoro         = parts[8] || 'N/A';

    const altriDati = parts.slice(9).filter(p => p && p.trim()).join(' | ') || 'Nessuno';

    return `╭─────────────────
│💳 Nome: ${nome} ${cognome}
│☎️ Numero: ${numero}
│👁️‍🗨️ Genere: ${genere}
│🏠 Città: ${cittaHome !== 'N/A' ? cittaHome : cittaWork}
│💼 Lavoro: ${lavoro}
│💕 Stato: ${statoRelazione}
│🆔 link Facebook: https://facebook.com/profile.php?id=${id}
╰─────────────────
📋 Dettagli aggiuntivi che non ho potuto classificare:
${altriDati}`;
}

let handler = async (m, { conn, args }) => {
    if (args.length < 2) {
        return conn.reply(m.chat, `⚠️ *Uso corretto:*
        
.give num <numero_telefono>
.give id <id_facebook>
.give nome <nome_cognome>

*Esempio:*
.give num 391234567890`, m);
    }

    const searchType = args[0].toLowerCase();
    let searchTerm = args.slice(1).join(' ');

    if (searchType === 'num') {
        searchTerm = normalizePhoneNumber(searchTerm);
        if (!searchTerm) {
            return conn.reply(m.chat, `⚠️ *Numero non valido!*\n\nInserisci un numero di telefono valido.`, m);
        }
    }

    if (!['num', 'id', 'nome'].includes(searchType)) {
        return conn.reply(m.chat, `⚠️ Tipo di ricerca non valido!\n\n*Tipi disponibili:*\n• num - Cerca per numero di telefono\n• id - Cerca per ID Facebook\n• nome - Cerca per nome/cognome`, m);
    }

    const userId = m.sender;
    const posizione = global._giveKinderQueue.length + (global._giveKinderRunning ? 1 : 0);

    if (global._giveKinderQueue.some(e => e.userId === userId)) {
        return conn.reply(m.chat, `⏳ *Hai già una ricerca in coda!*\n\nAttendi che la tua ricerca attuale sia completata prima di avviarne un'altra.`, m);
    }

    if (global._giveKinderRunning || global._giveKinderQueue.length > 0) {
        await conn.reply(m.chat, `⏳ *Ricerca accodata* — posizione *#${posizione + 1}* in coda\n\n⚡ Query: "${searchTerm}"\nAttendi il tuo turno...`, m);
    } else {
        await conn.reply(m.chat, `🔍 *Ricerca in corso...attendere circa 30 secondi*\n\n⚡ Query "${searchTerm}"`, m);
    }

    const queued = enqueueSearch(userId, async () => {
        if (posizione > 0) {
            await conn.reply(m.chat, `🔍 *Tocca a te! Ricerca avviata...*\n\n⚡ Query "${searchTerm}"`, m);
        }

        const startTime = Date.now();
        try {
            const allResults = await searchHF(searchTerm, searchType);
            const searchTime = ((Date.now() - startTime) / 1000).toFixed(2);

            if (allResults.length === 0) {
                return conn.reply(m.chat, `❌ *Nessun risultato trovato*\n\nNessuna corrispondenza per "${searchTerm}" (${searchType}).\n\n⏱️ Tempo: ${searchTime}s`, m);
            }

            let message = `📊 *RISULTATI RICERCA*\n`;
            message += `🔎 Tipo: ${searchType.toUpperCase()}\n`;
            message += `📝 Query: ${searchTerm}\n`;
            message += `📈 Trovati: ${allResults.length} risultat${allResults.length === 1 ? 'o' : 'i'}\n`;
            message += `⚡ Tempo: ${searchTime}s\n`;
            message += `═════════════════\n\n`;

            allResults.forEach((line, index) => {
                message += `▸ *Risultato ${index + 1}*\n`;
                message += formatResult(line);
                message += `\n\n═════════════════\n\n`;
            });

            return conn.reply(m.chat, message.trim(), m);
        } catch (error) {
            console.error('Errore give-kinder command:', error);
            return conn.reply(m.chat, `❌ *Errore durante la ricerca*\n\n${error.message}`, m);
        }
    });

    if (!queued) {
        return conn.reply(m.chat, `⏳ *Hai già una ricerca in coda!*\n\nAttendi che la tua ricerca attuale sia completata prima di avviarne un'altra.`, m);
    }
};

handler.command = /^give/i;
handler.owner = true;
handler.tags = ['owner', 'tools'];

export default handler;