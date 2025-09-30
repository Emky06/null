// Plugin fatto da Axtral_WiZaRd fix chatunity
import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080'];

global.APIs = {
  xyro: { url: "https://xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null },
  vreden: { url: "https://api.vreden.web.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  zenzxz: { url: "https://api.zenzxz.my.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null }
};

async function fetchFromApis(apis) {
  for (const { endpoint, extractor } of apis) {
    try {
      const { data } = await axios.get(endpoint, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const url = extractor(data);
      if (url) return url;
    } catch {}
  }
  throw new Error('❗𝐍𝐞𝐬𝐬𝐮𝐧 𝐥𝐢𝐧𝐤 𝐯𝐚𝐥𝐢𝐝𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐝𝐚𝐥𝐥𝐞 𝐀𝐏𝐈.');
}

async function getAud(url) {
  const apis = [
    { endpoint: `${global.APIs.xyro.url}/download/youtubemp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.dl },
    { endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.enlace },
    { endpoint: `${global.APIs.vreden.url}/api/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url },
    { endpoint: `${global.APIs.delirius.url}/download/ymp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url },
    { endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
    { endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3v2?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }
  ];
  const downloadUrl = await fetchFromApis(apis);
  if (!formatAudio.some(f => downloadUrl.endsWith(f))) throw new Error('❗𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐚𝐮𝐝𝐢𝐨 𝐧𝐨𝐧 𝐬𝐮𝐩𝐩𝐨𝐫𝐭𝐚𝐭𝐨.');
  return downloadUrl;
}

async function getVid(url) {
  const apis = [
    { endpoint: `${global.APIs.xyro.url}/download/youtubemp4?url=${encodeURIComponent(url)}&quality=360`, extractor: res => res.result?.dl },
    { endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.formatos?.[0]?.url },
    { endpoint: `${global.APIs.vreden.url}/api/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url },
    { endpoint: `${global.APIs.delirius.url}/download/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url },
    { endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
    { endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp4v2?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }
  ];
  const downloadUrl = await fetchFromApis(apis);
  if (!formatVideo.some(f => downloadUrl.includes(f))) throw new Error('❗𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐯𝐢𝐝𝐞𝐨 𝐧𝐨𝐧 𝐬𝐮𝐩𝐩𝐨𝐫𝐭𝐚𝐭𝐨.');
  return downloadUrl;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `💣 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥𝐥𝐚 𝐦𝐮𝐬𝐢𝐜𝐚.`, m);

    const search = await yts(text);
    if (!search.all.length) return conn.reply(m.chat, '❗ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐫𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.', m);

    const videoInfo = search.all[0];
    const { title, url } = videoInfo;

    if (command === 'play1') {
      await conn.reply(m.chat, `🎵 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐥'𝐚𝐮𝐝𝐢𝐨...`, m);
      const downloadUrl = await getAud(url);
      await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });

    } else if (command === 'play2' || command === 'ytmp4') {
      await conn.reply(m.chat, `🎥 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐢𝐥 𝐯𝐢𝐝𝐞𝐨...`, m);
      const downloadUrl = await getVid(url);

      const buttons = [
        { buttonId: `${usedPrefix}tomp3`, buttonText: { displayText: '🎧 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐢 𝐢𝐧 𝐚𝐮𝐝𝐢𝐨' }, type: 1 }
      ];

      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        fileName: `${title}.mp4`,
        mimetype: 'video/mp4',
        caption: '✅ 𝐒𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨',
        buttons: buttons,
        headerType: 4
      }, { quoted: m });

    } else {
      throw "❗ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐧𝐨𝐧 𝐫𝐢𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨.";
    }

  } catch (error) {
    return conn.reply(m.chat, error.message, m);
  }
};

handler.command = handler.help = ['play1', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;
