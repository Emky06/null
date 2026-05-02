//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const BASE_PATH = './storage/giftrasformazioni';

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
        text: `⏳ *𝐓𝐑𝐀𝐒𝐅𝐎𝐑𝐌𝐀𝐙𝐈𝐎𝐍𝐄 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*\n\n${progressBar(percent)} ${percent}%`
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
          text: `⏳ *𝐓𝐑𝐀𝐒𝐅𝐎𝐑𝐌𝐀𝐙𝐈𝐎𝐍𝐄 𝐈𝐍 𝐂𝐎𝐑𝐒𝐎...*\n\n${progressBar(percent)} ${percent}%`,
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
      'Ozaru': 'ozaru.mp4',
      'Ozaru controllato': 'ozaru_controllato.mp4',
      'SSJ Leggendario': 'ssj_leggendario.mp4',
      'Kaioken': 'kaioken.mp4',
      'Fake Super Saiyan': 'fake_super_saiyan.mp4',
      'Super Saiyan': 'super_saiyan.mp4',
      'Super Saiyan Kaioken': 'super_saiyan_kaioken.mp4',
      'Super Saiyan 2': 'super_saiyan_2.mp4',
      'Super Saiyan 3': 'super_saiyan_3.mp4',
      'Super Saiyan 4 (Gt)': 'super_saiyan_4_gt.mp4',
      'Super Saiyan 4 (Daima)': 'super_saiyan_4_daima.mp4',
      'Super Saiyan God': 'super_saiyan_god.mp4',
      'Super Saiyan God Super Saiyan': 'super_saiyan_god_ssj.mp4',
      'Super Saiyan Blue Kaioken': 'super_saiyan_blue_kaioken.mp4',
      'Super Saiyan Blue Evolution': 'super_saiyan_blue_evolution.mp4',
      'Ultra Istinto Omen': 'ultra_istinto_omen.mp4',
      'Ultra Istinto Mastered': 'ultra_istinto_mastered.mp4',
      'Beast Form': 'beast_form.mp4',
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

    const finalMsg = `*✔️ 𝐓𝐑𝐀𝐒𝐅𝐎𝐑𝐌𝐀𝐙𝐈𝐎𝐍𝐄 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐓𝐀*  
━━━━━━━━━━━━━━━━━━━━━  
👤 *𝐏𝐞𝐫𝐬𝐨𝐧𝐚:* @${userId}  
🪐 *𝐓𝐫𝐚𝐬𝐟𝐨𝐫𝐦𝐚𝐳𝐢𝐨𝐧𝐞:* ${chosen}  
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
    await m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥\'𝐢𝐧𝐯𝐢𝐨 𝐝𝐞𝐥𝐥𝐚 𝐭𝐫𝐚𝐬𝐟𝐨𝐫𝐦𝐚𝐳𝐢𝐨𝐧𝐞.');
  }
};

handler.command = /^(saiyan)$/i;
handler.group = true;

export default handler;