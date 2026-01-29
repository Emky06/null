//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    video: { url: './storage/video/flecia.mp4' },
    viewOnce: true,
    caption: '*𝑷𝒂𝒖𝒍𝒂 𝒅𝒊 𝒄𝒉𝒆*'
  }, { quoted: m });
};

handler.command = /^flecia$/i;
export default handler;