//Plugin fatto da Axtral_WiZaRd
import fetch from "node-fetch";

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text || !text.trim()) {
      return conn.reply(m.chat, "💣 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐥𝐢𝐧𝐤 𝐝𝐞𝐥 𝐯𝐢𝐝𝐞𝐨 𝐓𝐢𝐤𝐓𝐨𝐤.", m);
    }

    let url = text.trim();
    let videoUrl;

    if (command === "dldtiktok") {
      await conn.reply(m.chat, "🎥 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐢𝐥 𝐯𝐢𝐝𝐞𝐨 𝐝𝐚 𝐓𝐢𝐤𝐓𝐨𝐤...", m);

      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      videoUrl = data?.data?.play || data?.data?.hdplay;
    }

    if (!videoUrl) {
      return conn.reply(m.chat, "❗ 𝐄𝐫𝐫𝐨𝐫𝐞: 𝐢𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐫𝐞𝐜𝐮𝐩𝐞𝐫𝐚𝐫𝐞 𝐢𝐥 𝐯𝐢𝐝𝐞𝐨.", m);
    }

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: "✅ 𝐕𝐢𝐝𝐞𝐨 𝐓𝐢𝐤𝐓𝐨𝐤 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨!"
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Errore TikTok:", error.message);
    return conn.reply(m.chat, "❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐢𝐥 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝.", m);
  }
};

handler.command = ["dldtiktok"];
handler.tags = ["downloader"];
handler.help = ["dldtiktok <url>"];

export default handler;