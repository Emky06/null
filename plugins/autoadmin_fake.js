// Codice di tieni.js

// Plugin .tieni - manda una foto a visual
const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: { url: './storage/image/tieni.jpg' }, // Assicurati che il file esista nella root del bot
    viewOnce: true,
    caption: '*𝑯𝒂𝒉𝒂𝒉𝒂, 𝒄𝒊 𝒉𝒂𝒊 𝒄𝒓𝒆𝒅𝒖𝒕𝒐 𝒗𝒆𝒓𝒂𝒎𝒆𝒏𝒕𝒆😂*'
  }, { quoted: m });
};

handler.command = /^autoadmin$/i;
export default handler;