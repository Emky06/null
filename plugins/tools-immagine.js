import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const GOOGLE_KEY = global.googlekey;
  const GOOGLE_CX = global.googleCX;

  if (!text) {
    return m.reply(`╭━━⊱「 ❌ *ERRORE* 」
┃ Inserisci il testo per cercare un'immagine
┃
┃ 📝 *Esempio:*
┃ ${usedPrefix + command} Ozuna
╰━━━━━━━━━━━━━━⊱`);
  }

  if (!GOOGLE_KEY || !GOOGLE_CX) {
    return m.reply("❌ API Google non configurate");
  }

  try {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(text)}&searchType=image&num=10&lr=lang_it`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data.items || data.items.length === 0) {
      await m.react('❌');
      return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: *${text}*
╰━━━━━━━━━━━━━━⊱`);
    }

    const maxImages = Math.min(data.items.length, 10);
    const albumItems = [];

    for (let i = 0; i < maxImages; i++) {
      const item = data.items[i];

      try {
        const imageResponse = await axios.get(item.link, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        const caption = i === 0
          ? `🔍 Ricerca: ${text}`
          : `🌐 ${item.displayLink || item.link}`;

        albumItems.push({
          image: Buffer.from(imageResponse.data),
          caption
        });
      } catch (e) {}
    }

    if (albumItems.length === 0) {
      return m.reply("❌ Nessuna immagine valida trovata");
    }

    await conn.sendMessage(m.chat, {
      album: albumItems
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    await m.react('❌');
    return m.reply("❌ Errore durante la ricerca immagini");
  }
};

handler.help = ['cercaimmagine <testo>'];
handler.tags = ['ricerca'];
handler.command = ['cercaimmagine', 'ci'];

export default handler;