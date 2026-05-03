//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const BASE_PATH = './storage/onepiece';

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function progressBar(percent) {
  const total = 10;
  const filled = Math.floor((percent / 100) * total);
  const empty = total - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

let handler = async (m, { conn }) => {
  try {
    let mention;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
      mention = m.mentionedJid[0];
    } else if (m.quoted) {
      mention = m.quoted.sender;
    } else {
      mention = m.sender;
    }

    const mentions = [mention];
    const userId = mention.split('@')[0];

    let percent = 0;

    let { key } = await conn.sendMessage(
      m.chat,
      {
        text: `⏳ *𝐒𝐂𝐀𝐍𝐒𝐈𝐎𝐍𝐄 𝐏𝐈𝐑𝐀𝐓𝐀 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*\n\n${progressBar(percent)} ${percent}%`
      },
      { quoted: m }
    );

    const steps = [30, 50, 70, 100];

    for (const p of steps) {
      await wait(800);
      percent = p;

      await conn.sendMessage(
        m.chat,
        {
          text: `⏳ *𝐒𝐂𝐀𝐍𝐒𝐈𝐎𝐍𝐄 𝐏𝐈𝐑𝐀𝐓𝐀 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*\n\n${progressBar(percent)} ${percent}%`,
          edit: key,
          mentions
        },
        { quoted: m }
      );
    }

    const delay = Math.floor(Math.random() * 7000) + 1000;
    const start = performance.now();
    await wait(delay);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(2);

    const localVideos = {
      'Monkey D. Luffy': 'luffy.mp4',
      'Roronoa Zoro': 'zoro.mp4',
      'Sanji': 'sanji.mp4',
      'TonyTony Chopper': 'chopper.mp4',
      'Brook': 'brook.mp4',
      'Jinbe': 'jinbe.mp4',
      'Franky': 'franky.mp4',
      'Usop': 'usop.mp4',
      'Nami': 'nami.mp4',
      'Nico Robin': 'nicorobin.mp4',
      'Shanks': 'shanks.mp4',
      'Ace': 'ace.mp4',
      'Trafalgar Law': 'trafalgar_law.mp4',
      'Donquijote Doflamingo': 'doflamingo.mp4',
      'Katakuri': 'katakuri.mp4',
      'Drakul Mihawk': 'mihawk.mp4',
      'Crocodile': 'crocodile.mp4',
      'Boa Hancock': 'hancock.mp4',
      'Edward Newgate (Barbabianca)': 'barbabianca.mp4',
      'Gol D. Roger': 'roger.mp4',
    };

    const keys = Object.keys(localVideos);
    const chosen = pickRandom(keys);
    const videoFile = localVideos[chosen];
    const videoPath = path.join(BASE_PATH, videoFile);

    if (!fs.existsSync(videoPath)) {
      await conn.sendMessage(
        m.chat,
        { text: `⚠️ 𝐕𝐢𝐝𝐞𝐨 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨: ${videoFile}`, edit: key, mentions },
        { quoted: m }
      );
      return;
    }

    const finalMsg = `*✔️ 𝐈𝐃𝐄𝐍𝐓𝐈𝐓𝐀̀ 𝐑𝐈𝐕𝐄𝐋𝐀𝐓𝐀*  
━━━━━━━━━━━━━━━━━━━━━  
👤 *𝐏𝐞𝐫𝐬𝐨𝐧𝐚:* @${userId}  
🪐 *𝐏𝐢𝐫𝐚𝐭𝐚:* ${chosen}  
🕒 *𝐓𝐞𝐦𝐩𝐨:* ${timeTaken}s  
━━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoPath },
        caption: finalMsg,
        mentions,
        gifPlayback: true
      },
      { quoted: m }
    );

  } catch (err) {
    console.error('Errore nel comando:', err);
    await m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥\'𝐢𝐧𝐯𝐢𝐨 𝐝𝐞𝐥 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐠𝐠𝐢𝐨.');
  }
};

handler.command = /^(onepiece)$/i;
handler.group = true;

export default handler;