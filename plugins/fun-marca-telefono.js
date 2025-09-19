// Comando .marca - by Kinderino

import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply(`Scrivi il modello del telefono che vuoi cercare, ad esempio:\n\n${usedPrefix + command} Google Pixel 6 Pro`);
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        const prompt = `Sei un esperto di tecnologia che risponde su WhatsApp. Ti viene chiesto di fornire le specifiche tecniche complete e aggiornate di uno smartphone, in formato ben strutturato e ordinato, SENZA usare asterischi per gli elenchi. Usa emoji per le sezioni e struttura i dati in questo stile:

📲 Nome Modello

📰 Data di lancio: 
...

⚖️ Corpo:
- Dimensioni: ...
- Peso: ...
- Materiali: ...
- ...

E così via per display, chip, memoria, fotocamere, batteria, connettività, sensori, ecc. Non fare commenti aggiuntivi solo le info richieste del dispositivo.

Questa è la richiesta dell’utente: "${text}"`;

        const apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
        const res = await apii.json();

        await m.reply(res.result);
    } catch (e) {
        await conn.reply(m.chat, `Si è verificato un errore. Riprova più tardi.\n\n#report ${usedPrefix + command}`, null, m);
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['marca'];
handler.help = ['marca <modello>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;