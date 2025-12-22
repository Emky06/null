//Plugin fatto da Axtral_WiZaRd
import ytSearch from 'yt-search'

const handler = async (m, { conn, text, usedprefix }) => {
    const jid = m.chat;
    const prefix = usedprefix || '.';

    if (!text?.trim()) return m.reply('📌 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐯𝐢𝐝𝐞𝐨 𝐝𝐚 𝐜𝐞𝐫𝐜𝐚𝐫𝐞.', m);

    try {
        const searchResults = await ytSearch(text);
        const videos = searchResults.videos.slice(0, 5);
        if (!videos.length) return m.reply('❌ Nessun risultato trovato.', m);


        const cardsPromises = videos.map(async (video, index) => {
            const duration = video.duration?.timestamp || video.duration || '?';
            const views = video.views?.toLocaleString() || '?';
            const author = video.author?.name || 'Sconosciuto';
            const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
            const shortTitle = video.title.substring(0, 55) + (video.title.length > 55 ? '...' : '');

            return {
                image: { url: thumbnailUrl },
                title: `${index + 1}. ${shortTitle}`,
                body: `『 👤 』 *${author}*\n『 ⏱️ 』 *${duration}*\n『 👁️ 』 *${views}*`,
                footer: `Risultato ${index + 1} di ${videos.length}`,
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📲 Apri su YouTube',
                            url: video.url
                        })
                    },
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📎 Copia link',
                            copy_code: video.url
                        })
                    }
                ]
            };
        });

        const cards = await Promise.all(cardsPromises);

        await conn.sendMessage(jid, {
            text: `『 🔍 』 𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐢 𝐭𝐫𝐨𝐯𝐚𝐭𝐢 𝐩𝐞𝐫: ${text}`,
            footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫',
            cards
        }, { quoted: m });


        const formatButtons = videos.map((video, i) => ({
            buttonId: `${prefix}ytformat ${video.url}`,
            buttonText: { displayText: `${i + 1}` },
            type: 1
        }));

        await conn.sendMessage(jid, {
            text: '🔢 𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐮𝐧 𝐯𝐢𝐝𝐞𝐨 𝐝𝐚𝐢 𝐫𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐢 𝐬𝐨𝐩𝐫𝐚 𝐩𝐞𝐫 𝐬𝐜𝐞𝐠𝐥𝐢𝐞𝐫𝐞 𝐢𝐥 𝐟𝐨𝐫𝐦𝐚𝐭𝐨 𝐝𝐚 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐫𝐞:',
            footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫',
            buttons: formatButtons,
            headerType: 1
        }, { quoted: m });


        conn.ytCache = conn.ytCache || {};
        conn.ytCache[jid] = videos;

    } catch (e) {
        console.error(e);
        m.reply('❌ Si è verificato un errore durante la ricerca.', m);
    }
};

handler.command = ['ytsearch'];
handler.help = ['.ytsearch <titolo>'];
handler.tags = ['downloader'];

export default handler;