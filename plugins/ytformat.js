// Plugin fatto da Axtral_WiZaRd
import yts from 'yt-search';

const handler = async (m, { conn, text }) => {
  const search = await yts(text || '');
  const videoInfo = search.all[0];
  if (!videoInfo) return m.reply('Nessun risultato trovato.');

  const { url } = videoInfo;

  const infoMessage = `📥 𝐒𝐜𝐞𝐠𝐥𝐢 𝐢𝐥 𝐟𝐨𝐫𝐦𝐚𝐭𝐨 𝐜𝐡𝐞 𝐯𝐮𝐨𝐢 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐫𝐞:`;

  const buttons = [
    { buttonId: `.play1 ${url}`, buttonText: { displayText: '🎧 𝐀𝐮𝐝𝐢𝐨' }, type: 1 },
    { buttonId: `.play2 ${url}`, buttonText: { displayText: '🎥 𝐕𝐢𝐝𝐞𝐨' }, type: 1 }
  ];

  conn.sendMessage(m.chat, {
    text: infoMessage,
    buttons,
    headerType: 1 
  }, { quoted: m });
};

handler.command = ['ytformat'];
handler.tags = ['downloader'];
handler.help = ['ytformat'];

export default handler;