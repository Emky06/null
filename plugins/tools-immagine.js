import { image_search } from "duckduckgo-images-api";
import axios from "axios";

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
    const results = await image_search({ query: text });

    if (!results || results.length === 0) {
      await m.react('❌');
      return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: *${text}*
┃
┃ 💡 *Suggerimento:*
┃ Prova con termini di ricerca diversi
╰━━━━━━━━━━━━━━⊱`);
    }

    const maxImages = Math.min(results.length, 10);
    const albumItems = [];

    for (let i = 0; i < maxImages; i++) {
      const item = results[i];
      const imageUrl = item.image;

      try {
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        const caption = i === 0
          ? `『 🔍 』 Ricerca: ${text}\n> \`DuckDuckGo Images\``
          : `『 🌐 』 Sito Origine: DuckDuckGo`;

        albumItems.push({
          image: Buffer.from(imageResponse.data),
          caption
        });

      } catch (e) {
        console.log('Errore immagine:', e.message);
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
    console.log('Errore DuckDuckGo:', error);
    await m.react('❌');
    return m.reply('❌ Errore durante la ricerca immagini');
  }
};

handler.help = ['cercaimmagine <testo>'];
handler.tags = ['ricerca'];
handler.command = ['cercaimmagine', 'ci'];

export default handler;