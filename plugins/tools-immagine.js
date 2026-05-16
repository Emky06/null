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
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(text)}&iax=images&ia=images`;

    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const match = res.data.match(/vqd=([\d-]+)/);
    if (!match) {
      return m.reply("❌ Nessun risultato trovato");
    }

    const vqd = match[1];

    const api = `https://duckduckgo.com/i.js?q=${encodeURIComponent(text)}&vqd=${vqd}&o=json&f=,,,&p=1&s=0`;

    const json = await axios.get(api, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    const results = json.data.results;

    if (!results || results.length === 0) {
      await m.react('❌');
      return m.reply(`╭━━⊱「 ❌ *NESSUN RISULTATO* 」
┃ Nessuna immagine trovata per: *${text}*
╰━━━━━━━━━━━━━━⊱`);
    }

    const maxImages = Math.min(results.length, 10);
    const albumItems = [];

    for (let i = 0; i < maxImages; i++) {
      const img = results[i];

      const caption = i === 0
        ? `🔍 Ricerca: ${text}\n> \`DuckDuckGo\``
        : `🌐 Fonte: DuckDuckGo`;

      albumItems.push({
        image: { url: img.image },
        caption
      });
    }

    await conn.sendMessage(m.chat, {
      album: albumItems
    }, { quoted: m });

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