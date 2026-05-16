import axios from 'axios';

let handler = async (m, { conn, text, usedprefix, command }) => {
    const jid = m.chat;
    const prefix = usedprefix || '.';

    if (!text) {
        return m.reply(`╭━━⊱「 ❌ *ERRORE* 」
┃ Inserisci il testo per cercare un'immagine
┃
┃ 📝 *Esempio:*
┃ ${prefix + command} Ozuna
╰━━━━━━━━━━━━━━⊱`);
    }

    try {
        const page = await axios.get(
            `https://duckduckgo.com/?q=${encodeURIComponent(text)}&iax=images&ia=images`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );

        const vqd = page.data.match(/vqd=([\d-]+)/)?.[1];

        if (!vqd) {
            await m.react('❌');
            return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: *${text}*
┃
┃ 💡 *Suggerimento:*
┃ Prova con termini di ricerca diversi
╰━━━━━━━━━━━━━━⊱`);
        }

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

        if (!images.length) {
            await m.react('❌');
            return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: *${text}*
╰━━━━━━━━━━━━━━⊱`);
        }

        const cards = images.map((img, index) => {
            const title = (img.title || text).substring(0, 50);

            return {
                image: { url: img.image },
                title: `${index + 1}. ${title}`,
                body: `『 🔍 』 *Ricerca:* ${text}\n『 🌐 』 *𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 Image Search*`,
                footer: `𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 Image Search`,
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🖼️ 𝐀𝐩𝐫𝐢 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞',
                            url: img.image
                        })
                    },
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📎 𝐂𝐨𝐩𝐢𝐚 𝐥𝐢𝐧𝐤',
                            copy_code: img.image
                        })
                    }
                ]
            };
        });

        await conn.sendMessage(jid, {
            text: `『 🔍 』 𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐢 𝐭𝐫𝐨𝐯𝐚𝐭𝐢 𝐩𝐞𝐫: *${text}*`,
            footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 Image Search',
            cards
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.log(e);
        await m.react('❌');
        return m.reply(`╭━━⊱「 ❌ *ERRORE* 」
┃ Errore durante la ricerca immagini
╰━━━━━━━━━━━━━━⊱`);
    }
};

handler.help = ['cercaimmagine <testo>'];
handler.tags = ['ricerca'];
handler.command = ['cercaimmagine', 'ci'];

export default handler;