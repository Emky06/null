import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭━━⊱「 ❌ *ERRORE* 」
┃ Inserisci il testo per cercare un'immagine
┃
┃ 📝 *Esempio:*
┃ ${usedPrefix + command} Ozuna
╰━━━━━━━━━━━━━━⊱`);
  }

  try {
    const page = await axios.get(`https://duckduckgo.com/?q=${encodeURIComponent(text)}&iax=images&ia=images`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const vqd = page.data.match(/vqd=([\d-]+)/)?.[1];

    if (!vqd) {
      await m.react('❌');
      return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: ${text}
┃
┃ 💡 Suggerimento:
┃ Prova con termini di ricerca diversi
╰━━━━━━━━━━━━━━⊱`);
    }

    const res = await axios.get(`https://duckduckgo.com/i.js?q=${encodeURIComponent(text)}&vqd=${vqd}&o=json&f=,,,&p=1&s=0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    const data = res.data.results;

    const maxImages = Math.min(data.length, 10);
    const albumItems = [];

    for (let i = 0; i < maxImages; i++) {
      const item = data[i];
      const imageUrl = item.image;
      const contextLink = item.source || item.image;
      const imageTitle = item.title || `Immagine ${i + 1}`;
      const shortTitle = imageTitle.length > 35
        ? imageTitle.substring(0, 35) + '...'
        : imageTitle;

      try {
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        const caption = i === 0
          ? `『 🔍 』 Ricerca: ${text}\n> \`𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 image search\``
          : `『 🌐 』 Sito Origine: ${contextLink}`;

        albumItems.push({
          image: Buffer.from(imageResponse.data),
          caption
        });

      } catch (imageError) {
        console.error('Errore immagine:', imageError);

        let thumbnailUrl = item.thumbnail || imageUrl;
        if (thumbnailUrl.includes('encrypted-tbn') || thumbnailUrl.includes('s=')) {
          thumbnailUrl = thumbnailUrl.replace(/s=\d+/, 's=1024');
        }

        try {
          const thumbResponse = await axios.get(thumbnailUrl, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0'
            }
          });

          const caption = i === 0
            ? `『 🔍 』 Ricerca: ${text}\n> \`𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 image search\``
            : `『 🌐 』 Sito Origine: ${contextLink}`;

          albumItems.push({
            image: Buffer.from(thumbResponse.data),
            caption
          });

        } catch (thumbError) {
          console.error('Errore thumbnail:', thumbError);
        }
      }
    }

    if (albumItems.length > 0) {
      await conn.sendMessage(m.chat, {
        album: albumItems
      }, { quoted: m });
    } else {
      await m.reply('❌ Nessuna immagine valida trovata');
    }

    await m.react('✅');

  } catch (error) {
    console.error('Errore DuckDuckGo:', error);
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