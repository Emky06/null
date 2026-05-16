import axios from 'axios';

let handler = async (m, { conn, text, usedprefix }) => {
    const jid = m.chat;
    const prefix = usedprefix || '.';

    if (!text?.trim()) {
        return m.reply(`📌 Inserisci il nome dell'immagine da cercare.`);
    }

    try {
        const page = await axios.get(
            `https://duckduckgo.com/?q=${encodeURIComponent(text)}&iax=images&ia=images`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );

        const vqd = page.data.match(/vqd=([\d-]+)/)?.[1];
        if (!vqd) return m.reply('❌ Nessun risultato trovato.');

        const res = await axios.get(
            `https://duckduckgo.com/i.js?q=${encodeURIComponent(text)}&vqd=${vqd}&o=json&f=,,,&p=1&s=0`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://duckduckgo.com/'
                }
            }
        );

        const images = res.data.results.slice(0, 5);
        if (!images.length) return m.reply('❌ Nessun risultato trovato.');

        const cards = images.map((img, index) => {
            const shortTitle =
                (img.title || text).substring(0, 55) +
                ((img.title || text).length > 55 ? '...' : '');

            return {
                image: { url: img.image },
                title: `${index + 1}. ${shortTitle}`,
                body: `『 🔍 』 *Ricerca:* ${text}\n『 🌐 』 *DuckDuckGo Image Search*`,
                footer: `𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 Image Search • Risultato ${index + 1} di ${images.length}`,
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🖼️ Apri immagine',
                            url: img.image
                        })
                    },
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📎 Copia link',
                            copy_code: img.image
                        })
                    }
                ]
            };
        });

        await conn.sendMessage(jid, {
            text: `『 🔍 』 Risultati trovati per: ${text}`,
            footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 Image Search',
            cards
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        m.reply('❌ Errore durante la ricerca immagini.');
    }
};

handler.command = ['ci', 'cercaimmagine'];
handler.help = ['cercaimmagine <testo>'];
handler.tags = ['ricerca'];

export default handler;