//Plugin fatto da Axtral_WiZaRd
import { igdl } from "ruhend-scraper";

const handler = async (m, { conn, text }) => {
  try {
    if (!text || !text.trim()) {
      return conn.reply(m.chat, "📸 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐥𝐢𝐧𝐤 𝐝𝐢 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦.", m);
    }

    let url = text.trim();

    await conn.reply(m.chat, "⏳ 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐢𝐥 𝐜𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨 𝐝𝐚 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦...", m);

    let res = await igdl(url);
    let data = res?.data;

    if (!data || data.length === 0) {
      return conn.reply(m.chat, "❗ 𝐄𝐫𝐫𝐨𝐫𝐞: 𝐢𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐫𝐞𝐜𝐮𝐩𝐞𝐫𝐚𝐫𝐞 𝐢𝐥 𝐜𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨.", m);
    }

    for (let media of data) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      await conn.sendMessage(
        m.chat,
        {
          video: { url: media.url },
          mimetype: "video/mp4",
          caption: "✅ 𝐂𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨!"
        },
        { quoted: m }
      );
    }

  } catch (error) {
    console.error("Errore IG:", error.message);
    return conn.reply(m.chat, "❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐢𝐥 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝.", m);
  }
};

handler.command = ["dldig"];
handler.tags = ["downloader"];
handler.help = ["dldig <url>"];
handler.group = true;

export default handler;