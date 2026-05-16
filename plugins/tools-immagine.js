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
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(text)}&iax=images&ia=images`;

    const page = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const vqdMatch = page.data.match(/vqd=([\d-]+)/);
    if (!vqdMatch) {
      return m.reply("❌ Nessun risultato trovato");
    }

    const vqd = vqdMatch[1];

    const apiUrl = `https://duckduckgo.com/i.js?q=${encodeURIComponent(text)}&vqd=${vqd}&o=json&f=,,,&p=1&s=0`;

    const res = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    const results = res.data.results;

    if (!results || results.length === 0) {
      await m.react('❌');
      return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: *${text}*
╰━━━━━━━━━━━━━━⊱`);
    }

    const maxImages = Math.min(results.length, 5); // 👈 SOLO 5 CARDS
    const albumItems = [];

    for (let i = 0; i < maxImages; i++) {
      const item = results[i];

      try {
        const imageRes = await axios.get(item.image, {
          responseType: 'arraybuffer',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const caption =
          i === 0
            ? `『 🔍 』 Ricerca: ${text}\n> \`DuckDuckGo\``
            : `『 🌐 』 Fonte: DuckDuckGo`;

        albumItems.push({
          image: Buffer.from(imageRes.data),
          caption
        });

      } catch (e) {
        console.log("Errore immagine:", e.message);
      }
    }

    if (albumItems.length > 0) {
      await conn.sendMessage(m.chat, {
        album: albumItems
      }, { quoted: m });
    } else {
      await m.reply("❌ Nessuna immagine valida trovata");
    }

    await m.react('✅');

  } catch (error) {
    console.log(error);
    await m.react('❌');
    return m.reply("❌ Errore durante la ricerca immagini");
  }
};

handler.help = ['cercaimmagine <testo>'];
handler.tags = ['ricerca'];
handler.command = ['cercaimmagine', 'ci'];

export default handler;