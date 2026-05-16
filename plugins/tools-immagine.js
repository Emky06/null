import axios from 'axios';

let handler = async (m, { conn, text, usedprefix, command }) => {
    const jid = m.chat;
    const prefix = usedprefix || '.';

    if (!text) {
        return m.reply(`╭━━⊱「 ❌ *𝐄𝐑𝐑𝐎𝐑𝐄* 」
┃ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐭𝐞𝐬𝐭𝐨 𝐩𝐞𝐫 𝐜𝐞𝐫𝐜𝐚𝐫𝐞 𝐮𝐧'𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞
┃
┃ 📝 *𝐄𝐬𝐞𝐦𝐩𝐢𝐨:*
┃ ${prefix + command} 𝐎𝐳𝐮𝐧𝐚
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
            return m.reply(`╭━━⊱「 ❌ *𝐍𝐄𝐒𝐒𝐔𝐍 𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎* 」
┃ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞 𝐭𝐫𝐨𝐯𝐚𝐭𝐚 𝐩𝐞𝐫: *${text}*
┃
┃ 💡 *𝐒𝐮𝐠𝐠𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐨:*
┃ 𝐏𝐫𝐨𝐯𝐚 𝐜𝐨𝐧 𝐭𝐞𝐫𝐦𝐢𝐧𝐢 𝐝𝐢 𝐫𝐢𝐜𝐞𝐫𝐜𝐚 𝐝𝐢𝐯𝐞𝐫𝐬𝐢
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
            return m.reply(`╭━━⊱「 ❌ *𝐍𝐄𝐒𝐒𝐔𝐍 𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎* 」
┃ 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞 𝐭𝐫𝐨𝐯𝐚𝐭𝐚 𝐩𝐞𝐫: *${text}*
╰━━━━━━━━━━━━━━⊱`);
        }

        const cards = images.map((img, index) => {
            const title = (img.title || text).substring(0, 50);

            return {
                image: { url: img.image },
                title: `${index + 1}. ${title}`,
                body: `『 🔍 』 *Ricerca:* ${text}`,
                footer: `𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐈𝐦𝐚𝐠𝐞 𝐒𝐞𝐚𝐫𝐜𝐡`,
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
            footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐈𝐦𝐚𝐠𝐞 𝐒𝐞𝐚𝐫𝐜𝐡',
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