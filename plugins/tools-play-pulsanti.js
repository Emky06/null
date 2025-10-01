// Plugin fatto da Axtral_WiZaRd
import yts from 'yt-search';

const handler = async (m, { conn, text }) => {
  if (!text.trim()) return conn.reply(m.chat, `💣 Inserisci il nome della musica.`, m);

  const search = await yts(text);
  if (!search.all.length) return m.reply('Nessun risultato trovato.');

  const videoInfo = search.all[0];
  const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
  const formattedViews = new Intl.NumberFormat().format(views);
  const infoMessage = `╭━━━━━━━━━━━━━━━━━━━━╮
   ⭐ *𝑻𝒊𝒕𝒐𝒍𝒐:* ${title}
   ⏳ *𝑫𝒖𝒓𝒂𝒕𝒂:* ${timestamp}
   👁️ *𝑽𝒊𝒔𝒖𝒂𝒍:* ${formattedViews}
   📺 *𝑪𝒂𝒏𝒂𝒍𝒆:* ${author?.name || 'Sconosciuto'}
   📅 *𝑷𝒖𝒃𝒃𝒍𝒊𝒄𝒂𝒕𝒐:* ${ago}
   🔗 *𝑳𝒊𝒏𝒌:* ${url}
╰━━━━━━━━━━━━━━━━━━━━╯
> ⏳𝐈𝐧𝐟𝐨 𝐒𝐨𝐧𝐠 𝐭𝐫𝐨𝐯𝐚𝐭𝐞, 𝐬𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐟𝐨𝐫𝐦𝐚𝐭𝐨...`;

  const buttons = [
    { buttonId: `.play1 ${url}`, buttonText: { displayText: '🎧 𝐀𝐮𝐝𝐢𝐨' }, type: 1 },
    { buttonId: `.play2 ${url}`, buttonText: { displayText: '🎥 𝐕𝐢𝐝𝐞𝐨' }, type: 1 }
  ];

  const thumb = (await conn.getFile(thumbnail))?.data;

  conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: infoMessage,
    footer: '📥 𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐮𝐧 𝐟𝐨𝐫𝐦𝐚𝐭𝐨:',
    buttons,
    headerType: 4
  }, { quoted: m });
};

handler.command = ['play'];
handler.tags = ['downloader'];
handler.help = ['play <nome musica>'];

export default handler;
