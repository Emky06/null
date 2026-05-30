
//Plugin fatto da Axtral_WiZaRd
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const TMP_DIR = "./tmp";

const execPromise = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
};

const getPlaylistVideos = async (url) => {
  const output = await execPromise(`yt-dlp --flat-playlist -J "${url}"`);
  const data = JSON.parse(output);

  if (!data.entries?.length) {
    throw new Error("𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 𝐯𝐮𝐨𝐭𝐚 𝐨 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐚.");
  }

  return data.entries.map((v) => ({
    title: v.title || "𝐒𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨",
    url: `https://www.youtube.com/watch?v=${v.id}`
  }));
};

const downloadMp3 = async (url) => {
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  const filePath = path.join(TMP_DIR, `${fileName}.mp3`);

  await execPromise(
    `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`
  );

  return filePath;
};

const handler = async (m, { conn, text }) => {
  try {
    if (!text?.trim()) {
      return conn.sendMessage(m.chat, {
        text: "💣 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐥𝐢𝐧𝐤 𝐝𝐞𝐥𝐥𝐚 𝐩𝐥𝐚𝐲𝐥𝐢𝐬𝐭 𝐘𝐨𝐮𝐓𝐮𝐛𝐞."
      });
    }

    if (!text.includes("list=")) {
      return conn.sendMessage(m.chat, {
        text: "❗ 𝐃𝐞𝐯𝐢 𝐢𝐧𝐬𝐞𝐫𝐢𝐫𝐞 𝐮𝐧 𝐥𝐢𝐧𝐤 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐢 𝐩𝐥𝐚𝐲𝐥𝐢𝐬𝐭 𝐘𝐨𝐮𝐓𝐮𝐛𝐞."
      });
    }

    await conn.sendMessage(m.chat, {
      text: "📀 𝐒𝐭𝐨 𝐥𝐞𝐠𝐠𝐞𝐧𝐝𝐨 𝐥𝐚 𝐩𝐥𝐚𝐲𝐥𝐢𝐬𝐭..."
    });

    const videos = await getPlaylistVideos(text);

    await conn.sendMessage(m.chat, {
      text: `🎵 𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 𝐭𝐫𝐨𝐯𝐚𝐭𝐚!\n📦 𝐁𝐫𝐚𝐧𝐢: ${videos.length}\n⏳ 𝐈𝐧𝐢𝐳𝐢𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝...`
    });

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];

      try {
        await conn.sendMessage(m.chat, {
          text: `🎶 (${i + 1}/${videos.length}) 𝐒𝐜𝐚𝐫𝐢𝐜𝐨:\n${video.title}`
        });

        const audioPath = await downloadMp3(video.url);

        await conn.sendMessage(m.chat, {
          audio: fs.readFileSync(audioPath),
          mimetype: "audio/mpeg",
          fileName: `${video.title}.mp3`
        });

        fs.unlinkSync(audioPath);
      } catch (err) {
        console.error(err);

        await conn.sendMessage(m.chat, {
          text: `❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐜𝐨𝐧:\n${video.title}`
        });
      }
    }

    await conn.sendMessage(m.chat, {
      text: "✅ 𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐚 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐦𝐞𝐧𝐭𝐞."
    });

  } catch (error) {
    console.error(error);

    return conn.sendMessage(m.chat, {
      text: `❗ 𝐄𝐫𝐫𝐨𝐫𝐞: ${error.message || error}`
    });
  }
};

handler.command = ["dldplaylist"];
handler.help = ["dldplaylist <link playlist yt>"];
handler.tags = ["downloader"];
handler.owner = true;

export default handler;