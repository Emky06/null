import axios from "axios";

var handler = async (m, { text, command, conn }) => {
  if (!text) {
    await m.reply("Per favore, scrivi una descrizione per generare l'immagine.");
    return;
  }

  if (!["fluxai", "image", "immagine", "imagine"].includes(command)) return;

  try {
    await m.reply("> *𝐂𝐫𝐞𝐚𝐳𝐢𝐨𝐧𝐞 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞...*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(text)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    if (!response || !response.data) {
      return m.reply("Errore: l'API non ha restituito un'immagine valida. Riprova più tardi.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `🔥 𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞 𝐝𝐢: *${text}*`
    });
  } catch (error) {
    console.error("FluxAI Error:", error);
    await m.reply(`Si è verificato un errore: ${error.response?.data?.message || error.message || "Errore sconosciuto"}`);
  }
};

handler.command = ["fluxai", "image", "immagine", "imagine"];

export default handler;
