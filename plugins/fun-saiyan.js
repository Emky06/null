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

let handler = async (m, { conn, text }) => {
  try {
    // Prendi la persona taggata, oppure quella citata nella risposta, oppure il mittente
    let mention;
    if (m.quoted) {
      mention = m.quoted.sender;
    } else if (text) {
      const rawMentions = text.match(/@(\d+|\w+)/g);
      if (rawMentions && rawMentions.length > 0) {
        mention = rawMentions[0].replace('@', '') + '@s.whatsapp.net';
      } else {
        mention = m.sender;
      }
    } else {
      mention = m.sender;
    }

    const mentions = [mention];
    const userId = mention.split('@')[0];

    await m.reply('⏳ *Inizio processo di TRASFORMAZIONE...*', null, { mentions });

    // Percentuali con pausa
    const progresses = ['30%', '50%', '70%', '100%'];
    for (const p of progresses) {
      await wait(800);
      await m.reply(`🔍 *Progresso:* ${p}`, null, { mentions });
    }

    // Delay casuale
    const delay = Math.floor(Math.random() * 9000) + 1000;
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
      await m.reply(`⚠️ Video non trovato: ${videoFile}`, null, { mentions });
      return;
    }

    const finalMsg = `*✔️ TRASFORMAZIONE COMPLETATA CON SUCCESSO*  
━━━━━━━━━━━━━━━━━━━━━  
👤 *Persona:* @${userId}  
🪐 *Trasformazione:* ${chosen}  
🕒 *Tempo di esecuzione:* ${timeTaken} secondi  
━━━━━━━━━━━━━━━━━━━━━  
╔═══════════════════╗  
║       ☄️𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕☄️      ║  
╚═══════════════════╝`;

    await m.reply(finalMsg, null, { mentions });

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoPath },
        caption: `👤 Trasformazione di @${userId} in ${chosen}`,
        mentions,
      },
      { quoted: m }
    );
  } catch (err) {
    console.error('Errore nel comando:', err);
    await m.reply('⚠️ Errore durante l\'invio della trasformazione.');
  }
};

handler.command = /^(saiyan)$/i;
handler.group = false;
handler.admin = false;
handler.botAdmin = false;

export default handler;