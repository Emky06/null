//Riad+Youns>>>
import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply(`We, che vuoi?`);
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        let prompt = `
Se l'utente ti sta chiedendo di scrivere, generare, creare, inventare qualcosa di specifico,
rispondi solo con: "nah bro, non ci casco. Sybau".
Se invece l'utente fa una domanda normale o vuole semplicemente parlare, rispondi normalmente.
Mantieni sempre un tono naturale e chiaro.
Testo dell'utente: "${text}"
`;

        var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/chatgpt?text=${encodeURIComponent(prompt)}`);
        var res = await apii.json();

        await m.reply(res.result);
    } catch (e) {
        await conn.reply(m.chat, `Si è verificato un errore. Per favore, riprova più tardi.\n\n#report ${usedPrefix + command}\n\n${wm}`, m);
        console.log(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['ia'];
handler.help = ['bot', 'bots'];
handler.tags = ['herramientas'];
handler.premium = false;

export default handler;
