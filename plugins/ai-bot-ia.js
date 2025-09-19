import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply("Che vuoi?");
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        const mention = m.mentionedJid && m.mentionedJid[0];
        const isGroup = m.isGroup;
        const senderName = m.pushName || "Qualcuno";

        // Se in gruppo e c'è un tag, fa la risposta tipo "ha detto che..."
        if (isGroup && mention) {
            const targetJid = mention;
            const targetTag = '@' + targetJid.split('@')[0];

            // Pulisce il testo da menzioni e "dì a" / "che"
            let messaggioPulito = text.replace(/@\d+/g, '').trim();
            messaggioPulito = messaggioPulito
                .replace(/^d[iì] a/i, '')
                .replace(/^.*?che/i, '')
                .trim();

            // Sostituzioni smart per trasformare in seconda persona
            let messaggioPersonalizzato = messaggioPulito
                .replace(/\ble\b/gi, 'ti')
                .replace(/\bgli\b/gi, 'ti')
                .replace(/\bvoglio bene\b/gi, 'vuole bene')
                .replace(/\bamo\b/gi, 'ama')
                .replace(/\badoro\b/gi, 'adora')
                .replace(/\bmanchi\b/gi, 'manchi') // opzionale

            const rispostaFinale = `${targetTag} ${senderName} ha detto che ${messaggioPersonalizzato}.\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Axtral_WiZaRd`;
            await conn.sendMessage(m.chat, { text: rispostaFinale, mentions: [targetJid] });
            return;
        }

        // Se non c'è una mention, usa l'IA normalmente
        const prompt = `Sei un bot su WhatsApp programmato da Axtral_WiZaRd. Rispondi in modo educato e coerente a questo messaggio: ${text}`;

        const apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(prompt)}`);
        const res = await apii.json();

        if (res && res.result) {
            const rispostaIA = res.result + "\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ Axtral_WiZaRd";
            await m.reply(rispostaIA);
        } else {
            await m.reply("Non ho ricevuto una risposta valida dall'API. Riprova più tardi.");
        }

    } catch (e) {
        await conn.reply(
            m.chat,
            `Si è verificato un errore. Per favore, riprova più tardi.\n\n#report ${usedPrefix + command}`,
            m
        );
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['ia'];
handler.help = ['ia <testo>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;