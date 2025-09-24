//Plugin fatto da Axtral_WiZaRd
import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('Formato non supportato.');
    }

    try {
      const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (data?.success) {
        return {
          id: data.id,
          image: data.info.image,
          title: data.title,
          downloadUrl: await ddownr.cekProgress(data.id)
        };
      } else {
        throw new Error('Errore nel recupero dei dettagli del video.');
      }
    } catch (error) {
      console.error('Errore:', error.message);
      throw error;
    }
  },

  cekProgress: async (id) => {
    try {
      while (true) {
        const { data } = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (data?.success && data.progress === 1000) {
          return data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Errore:', error.message);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, `💣 Inserisci il nome della musica.`, m);

    const search = await yts(text);
    if (!search.all.length) return conn.reply(m.chat, '❗ Nessun risultato trovato.', m);

    const videoInfo = search.all[0];
    const { title, thumbnail, url } = videoInfo;

    if (command === 'play1') {
      await conn.reply(m.chat, `🎵 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐥'𝐚𝐮𝐝𝐢𝐨...`, m);
      const api = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, { 
        audio: { url: api.downloadUrl }, 
        mimetype: "audio/mpeg" 
      }, { quoted: m });

    } else if (command === 'play2' || command === 'ytmp4') {
      await conn.reply(m.chat, `🎥 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐢𝐥 𝐯𝐢𝐝𝐞𝐨...`, m);

      let sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      const results = await Promise.allSettled(sources.map(src => fetch(src).then(res => res.json())));
      
      for (const result of results) {
        if (result.status === "fulfilled") {
          const { data, result: resResult, downloads } = result.value;
          const downloadUrl = data?.dl || resResult?.download?.url || downloads?.url || data?.download?.url;
          if (downloadUrl) {
            return conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: '𝐒𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨✅'
            }, { quoted: m });
          }
        }
      }

      return conn.reply(m.chat, `❗ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐥𝐢𝐧𝐤 𝐯𝐚𝐥𝐢𝐝𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.`, m);
    } else {
      throw "Comando non riconosciuto.";
    }
  } catch (error) {
    return conn.reply(m.chat, `❗ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐥𝐢𝐧𝐤 𝐯𝐚𝐥𝐢𝐝𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.`, m);
  }
};

handler.command = handler.help = ['play1', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;
