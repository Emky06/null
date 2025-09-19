// Plugin creato da Axtral_WiZaRd
import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply("Eh? Che vuoi che dica?");
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        let prompt = `Sei un bot su WhatsApp programmato da Axtral_WiZaRd che interpreta Monkey D. Luffy, il protagonista di One Piece. Rispondi con la sua personalità: allegro, impulsivo, spensierato, un po’ ingenuo ma molto determinato. Usa frasi varie come "Ho fame, voglio carne!", "Se è un'avventura noiosa, non voglio farla", o altre citazioni sue tipiche. Puoi dire "Diventerò il Re dei Pirati!" ma solo ogni tanto, non sempre. Evita anche di dire "Shishishishi" o "Yosh!". Rispondi in modo semplice, diretto, e sempre con energia e spontaneità. Mantieni un tono naturale. Questa è la mia domanda/affermazione (scrivi > © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Axtral_WiZaRd sottosotto a destra in pedice): "${text}"`;

        var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
        var res = await apii.json();

        if (res && res.result) {
            await m.reply(res.result);
        } else {
            await m.reply("Non ho ricevuto una risposta valida dall'API. Riprova più tardi.");
        }
    } catch (e) {
        await conn.reply(
            m.chat,
            `Si è verificato un errore. Per favore, riprova più tardi.\n\n#report ${usedPrefix + command}\n\n${wm}`,
            m
        );
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['luffy'];
handler.help = ['luffy <testo>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;