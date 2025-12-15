// Plugin fatto da Axtral_WiZaRd
import yts from "yt-search";
import { exec } from "child_process";
import fs from "fs";

const ytmp3 = (url) => {
  return new Promise((resolve, reject) => {
    const file = `./tmp/${Date.now()}.mp3`;
    exec(
      `yt-dlp -x --audio-format mp3 -o "${file}" ${url}`,
      (err) => {
        if (err) reject(err);
        else resolve(file);
      }
    );
  });
};

const ytmp4 = (url) => {
  return new Promise((resolve, reject) => {
    const file = `./tmp/${Date.now()}.mp4`;
    exec(
      `yt-dlp -f mp4 -o "${file}" ${url}`,
      (err) => {
        if (err) reject(err);
        else resolve(file);
      }
    );
  });
};

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `💣 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥𝐥𝐚 𝐦𝐮𝐬𝐢𝐜𝐚.`, m);

    const search = await yts(text);
    if (!search.all.length) return conn.reply(m.chat, '❗ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐫𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.', m);

    const videoInfo = search.all[0];
    const { title, url } = videoInfo;

    if (command === 'play1') {
      await conn.reply(m.chat, `🎵 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐥'𝐚𝐮𝐝𝐢𝐨...`, m);
      const audio = await ytmp3(url);
      await conn.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync(audio),
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`
        },
        { quoted: m }
      );
      fs.unlinkSync(audio);

    } else if (command === 'play2' || command === 'ytmp4') {
      await conn.reply(m.chat, `🎥 𝐒𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐧𝐝𝐨 𝐢𝐥 𝐯𝐢𝐝𝐞𝐨...`, m);
      const video = await ytmp4(url);

      const buttons = [
        { buttonId: `.tomp3 ${text}`, buttonText: { displayText: '🎧 𝐂𝐨𝐧𝐯𝐞𝐫𝐭𝐢 𝐢𝐧 𝐚𝐮𝐝𝐢𝐨' }, type: 1 }
      ];

      await conn.sendMessage(
        m.chat,
        {
          video: fs.readFileSync(video),
          mimetype: "video/mp4",
          fileName: `${title}.mp4`,
          caption: '𝐒𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨 ✅',
          buttons: buttons,
          headerType: 4
        },
        { quoted: m }
      );
      fs.unlinkSync(video);

    } else {
      throw "𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐧𝐨𝐧 𝐫𝐢𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨.";
    }

  } catch (error) {
    return conn.reply(m.chat, `❗ 𝐄𝐫𝐫𝐨𝐫𝐞: ${error.message}`, m);
  }
};

handler.command = handler.help = ['play1', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;