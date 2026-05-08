import fetch from 'node-fetch'

const gottacleants = (text) => {
    return text
        .replace(/\s+(x|feat\.?|ft\.?|with)\s+/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const anothershi = (text) => {
    return text
        .replace(/^[\s\S]*?Read More\s*/i, '')
        .replace(/^\d+\s*Contributors.*/i, '')
        .replace(/^.*?Translations.*/i, '')
        .replace(/^.*?Lyrics\s*/i, '')
        .replace(/\[.*?\]/g, '')
        .replace(/Embed$/i, '')
        .replace(/You might also like/gi, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

let handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) {
        return m.reply(`📝 *𝐔𝐬𝐨:* ${usedPrefix + command} <titolo> [artista]`);
    }

    try {
        const query = gottacleants(text);
        const res = await fetch(`https://api.popcat.xyz/v2/lyrics?song=${encodeURIComponent(query)}`);
        const json = await res.json();

        const { error, message } = json;
        if (error) {
            return m.reply(`🔍 𝐍𝐞𝐬𝐬𝐮𝐧 𝐫𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨 𝐩𝐞𝐫: "${query}"`);
        }

        const { title, artist, lyrics, image, url } = message;

        let cleanedLyrics = anothershi(lyrics);
        if (!cleanedLyrics || cleanedLyrics.length < 10) {
            cleanedLyrics = `⚠️ *𝐓𝐞𝐬𝐭𝐨 𝐩𝐫𝐨𝐭𝐞𝐭𝐭𝐨 𝐨 𝐧𝐨𝐧 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞.*\n𝐏𝐮𝐨𝐢 𝐥𝐞𝐠𝐠𝐞𝐫𝐥𝐨 𝐪𝐮𝐢: ${url}`;
        }

        let finalHeader = `- 『 🎶 』 *${title.toUpperCase()}*\n` +
            `- 『 👤 』 *𝐀𝐫𝐭𝐢𝐬𝐭𝐚:* ${artist}\n` +
            `\n𝑶𝒓𝒊𝒈𝒊𝒏✦\n\n`;

        const buttons = [
            { buttonId: `.play1 ${title} ${artist}`, buttonText: { displayText: '🎧 𝐒𝐜𝐚𝐫𝐢𝐜𝐚 𝐚𝐮𝐝𝐢𝐨' }, type: 1 },
            { buttonId: `.play2 ${title} ${artist}`, buttonText: { displayText: '🎥 𝐒𝐜𝐚𝐫𝐢𝐜𝐚 𝐯𝐢𝐝𝐞𝐨' }, type: 1 }
        ];

        let messageOptions = {
            text: finalHeader + cleanedLyrics,
            footer: '𝑶𝒓𝒊𝒈𝒊𝒏✦',
            buttons: buttons,
            headerType: 1
        };

        if (image) {
            try {
                const imgRes = await fetch(image);
                if (imgRes.ok) {
                    const imgBuff = Buffer.from(await imgRes.arrayBuffer());
                    messageOptions = {
                        image: imgBuff,
                        caption: finalHeader + cleanedLyrics,
                        footer: '𝑶𝒓𝒊𝒈𝒊𝒏✦',
                        buttons: buttons,
                        headerType: 4
                    };
                }
            } catch (e) {
                console.log('Error fetching image:', e);
            }
        }

        await conn.sendMessage(m.chat, messageOptions);

    } catch (e) {
        console.error(e);
        m.reply(`❌ 𝐄𝐫𝐫𝐨𝐫𝐞: ${e.message}`);
    }
};

handler.help = ['lyrics <titolo>'];
handler.tags = ['strumenti'];
handler.command = ['lyrics', 'testo', 'lyric'];

export default handler;