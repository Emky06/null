import yts from "yt-search";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
const cookieParam = fs.existsSync('./cookies.txt') ? '--cookies ./cookies.txt' : '';

const ytmp3 = (url) => {
  return new Promise((resolve, reject) => {
    const file = path.join(tmpDir, `${Date.now()}.mp3`);
    const cmd = `yt-dlp --js-runtime node --remote-components ejs:github ${cookieParam} -x --audio-format mp3 --audio-quality 128K -o "${file}" "${url}"`;
    exec(cmd, (err) => { if (err) reject(err); else resolve(file); });
  });
};

const ytmp4 = (url) => {
  return new Promise((resolve, reject) => {
    const file = path.join(tmpDir, `${Date.now()}.mp4`);
    const cmd = `yt-dlp --js-runtime node --remote-components ejs:github ${cookieParam} -f "mp4" -S "vcodec:h264,res:720,acodec:m4a" --merge-output-format mp4 -o "${file}" "${url}"`;
    exec(cmd, (err) => { if (err) reject(err); else resolve(file); });
  });
};

const handler = async (m, { conn, command, text, usedPrefix }) => {
  const prefix = usedPrefix || '.';
  
  let targetChat = m.chat;
  let targetQuote = m;
  let actualText = text;

  if (text && text.includes('| ROUTE:')) {
      const parts = text.split('| ROUTE:');
      actualText = parts[0].trim();
      const routeInfo = parts[1];
      const routeMatch = routeInfo.match(/(.+) \| QUOTE:(.+) \| SENDER:(.+)/);
      if (routeMatch) {
          targetChat = routeMatch[1].trim();
          const quoteId = routeMatch[2].trim();
          const actualSender = routeMatch[3].trim();
          targetQuote = { key: { remoteJid: targetChat, fromMe: false, id: quoteId, participant: actualSender }, message: { conversation: "Origin Request" } };
      }
  }
  text = actualText;
  
  const reply = async (txt) => conn.sendMessage(targetChat, { text: txt }, { quoted: targetQuote });
  const react = async (emoji) => conn.sendMessage(targetChat, { react: { text: emoji, key: targetQuote.key } });

  if (!text) return reply('❌ Inserisci un nome o un link di YouTube');

  try {
    if (command === 'playaudio' || command === 'playvideo') {
      const isVideo = command === 'playvideo';
      let videoUrl = text;
      let videoTitle = 'Media';
      await react('⏳');

      if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
        const search = await yts(text);
        if (!search.all.length) throw '❌ Nessun risultato trovato.';
        videoUrl = search.all[0].url;
        videoTitle = search.all[0].title;
      }
      if (isVideo) {
        const file = await ytmp4(videoUrl);
        await conn.sendMessage(targetChat, { video: fs.readFileSync(file), mimetype: 'video/mp4', caption: '> 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕' }, { quoted: targetQuote });
        if (fs.existsSync(file)) fs.unlinkSync(file); 
      } else {
        const file = await ytmp3(videoUrl);
        await conn.sendMessage(targetChat, { audio: fs.readFileSync(file), mimetype: 'audio/mpeg', ptt: false }, { quoted: targetQuote });
        if (fs.existsSync(file)) fs.unlinkSync(file); 
      }
      await react('✅');
      return;
    }

    const search = await yts(text);
    if (!search.all.length) throw '❌ Nessun risultato trovato.';
    const results = search.videos.slice(0, 5); 
    const cards = results.map((v, i) => ({
      image: { url: v.thumbnail },
      title: `${i + 1}. ${v.title.substring(0, 55)}`,
      body: `👤 ${v.author?.name || 'Sconosciuto'}
⏱ ${v.duration?.timestamp || '?'}`,
      buttons: [
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🎵 Audio', id: `${prefix}playaudio ${v.url}` }) },
        { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🎬 Video', id: `${prefix}playvideo ${v.url}` }) }
      ]
    }));
    await conn.sendMessage(targetChat, { text: `『 🔍 』 Risultati per: ${text}`, footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕', cards }, { quoted: targetQuote });
  } catch (e) {
    await react('❌');
    await reply(`❌ Errore.`);
  }
};

handler.command = ['playk', 'playaudio', 'playvideo'];
export default handler;