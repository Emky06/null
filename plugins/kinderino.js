// Plugin .kinderino - manda una foto a visual
const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: { url: './storage/image/kinderino.jpg' },
    viewOnce: true,
    caption: '*𝑻𝒊𝒆𝒏𝒊 𝒖𝒏 𝑲𝒊𝒏𝒅𝒆𝒓 𝑩𝒖𝒆𝒏𝒐*'
  }, { quoted: m });
};

handler.command = /^kinderino$/i;
export default handler;