// Plugin manda una foto a visual
const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: { url: './storage/image/cagnolino.jpg' }, 
    viewOnce: true,
    caption: '*𝑬𝒄𝒄𝒐 𝒊𝒍 𝒄𝒖𝒄𝒄𝒊𝒐𝒍𝒐 𝒅𝒊 𝑨𝒙𝒕𝒓𝒂𝒍 𝒆 𝑲𝒊𝒏𝒅𝒆𝒓𝒊𝒏𝒐 🥰*'
  }, { quoted: m });
};

handler.command = /^jaise9i2wijci$/i;
export default handler;
