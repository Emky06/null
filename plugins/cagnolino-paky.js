// Plugin manda una foto a visual
const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: { url: './storage/image/cagnolino.jpg' }, // Assicurati che il file esista nella root del bot
    viewOnce: true,
    caption: '*𝑬𝒄𝒄𝒐 𝒊𝒍 𝒄𝒖𝒄𝒄𝒊𝒐𝒍𝒐 𝒅𝒊 𝑨𝒙𝒕𝒓𝒂𝒍 𝒆 𝑲𝒊𝒏𝒅𝒆𝒓𝒊𝒏𝒐 🥰*'
  }, { quoted: m });
};

handler.command = /^autoadmin$/i;
export default handler;
