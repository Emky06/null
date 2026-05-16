import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  console.log("🟡 text:", text);
  console.log("🟡 googlekey:", global.googlekey);
  console.log("🟡 googleCX:", global.googleCX);

  const GOOGLE_KEY = global.googlekey;
  const GOOGLE_CX = global.googleCX;

  console.log("🟢 GOOGLE_KEY:", GOOGLE_KEY);
  console.log("🟢 GOOGLE_CX:", GOOGLE_CX);

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

    console.log("🌐 apiUrl:", apiUrl);

    const response = await axios.get(apiUrl);
    const data = response.data;

    console.log("📦 keys:", Object.keys(data || {}));
    console.log("📦 items:", data?.items?.length);

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
      } catch (e) {
        console.log("❌ image error:", e.message);
      }
    }

    if (albumItems.length === 0) {
      return m.reply("❌ Nessuna immagine valida trovata");
    }

    await conn.sendMessage(m.chat, {
      album: albumItems
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    console.log("🔥 ERROR:", error?.response?.data || error.message);
    await m.react('❌');
    return m.reply("❌ Errore durante la ricerca immagini");
  }
};

handler.help = ['cercaimmagine <testo>'];
handler.tags = ['ricerca'];
handler.command = ['cercaimmagine', 'ci'];

export default handler;