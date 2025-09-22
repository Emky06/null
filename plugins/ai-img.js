// crediti by Kinderino e bla bla bla 
import fetch from 'node-fetch';

async function handler(m, { conn, text }) {
    if (!text) return m.reply('Scrivi un testo per generare l\'immagine.');

    try {
        const msg = await conn.sendMessage(m.chat, { text: 'Sto generando l\'immagine...' }, { quoted: m });

        const res = await fetch(`https://apis-starlights-team.koyeb.app/starlight/txt-to-image2?text=${encodeURIComponent(text)}`);
        const json = await res.json();

        if (!json.data || !json.data.image) {
            await conn.sendMessage(m.chat, { text: 'Errore nella generazione dell\'immagine.' }, { quoted: m });
            return;
        }

        await conn.sendMessage(m.chat, { image: { url: json.data.image }, caption: `Immagine generata per: ${text}` }, { quoted: m });

        try {
            await conn.sendMessage(m.chat, { delete: msg.key });
        } catch { /* ignora se non supportato */ }

    } catch (err) {
        console.error(err);
        m.reply('Si è verificato un errore durante la generazione dell\'immagine.');
    }
}

handler.command = ['img'];
handler.help = ['img <testo>'];
handler.tags = ['creativo'];
handler.premium = false;

export default handler;
