//Plugin fatto da Axtral_WiZaRd
import fetch from "node-fetch";

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text || !text.trim()) {
      return conn.reply(m.chat, `💣 Inserisci il link del video TikTok.`, m);
    }

    let url = text.trim();
    let videoUrl;

    if (command === "dldtiktok") {
      await conn.reply(m.chat, "🎥 Sto scaricando il video da TikTok...", m);


      const res = await fetch("https://www.tikwm.com/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      videoUrl = data?.data?.play || data?.data?.hdplay;
    }

    if (!videoUrl) {
      return conn.reply(m.chat, "❗ Errore: impossibile recuperare il video TikTok.", m);
    }


    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: "✅ Scaricato da TikTok con successo!"
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Errore TikTok:", error.message);
    return conn.reply(m.chat, "❌ Errore durante il download del video TikTok.", m);
  }
};

handler.command = ["dldtiktok"];
handler.tags = ["downloader"];
handler.help = ["dldtiktok <url>"];

export default handler;