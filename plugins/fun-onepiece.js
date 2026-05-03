// Plugin One Piece random - by Axtral_WiZaRd (modificato)

import { performance } from 'perf_hooks';

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

    if (m.mentionedJid?.length) {
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
        text: `🏴‍☠️ *SCANSIONE PIRATA IN CORSO...*\n\n${progressBar(percent)} ${percent}%`
      },
      { quoted: m }
    );

    const steps = [30, 60, 80, 100];

    for (const p of steps) {
      await wait(800);
      percent = p;

      await conn.sendMessage(
        m.chat,
        {
          text: `🏴‍☠️ *SCANSIONE PIRATA IN CORSO...*\n\n${progressBar(percent)} ${percent}%`,
          edit: key,
          mentions
        },
        { quoted: m }
      );
    }

    const delay = Math.floor(Math.random() * 4000) + 1000;
    const start = performance.now();
    await wait(delay);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(2);

    // PERSONAGGI + GIF ONLINE
    const characters = [
      {
        name: 'Monkey D. Luffy',
        gif: 'https://media.tenor.com/2roX3uxz_68AAAAC/luffy-gear5.gif'
      },
      {
        name: 'Roronoa Zoro',
        gif: 'https://media.tenor.com/9vRAkntogEMAAAAC/zoro-one-piece.gif'
      },
      {
        name: 'Sanji',
        gif: 'https://media.tenor.com/3z1Xb2K1jJ0AAAAC/sanji-fire.gif'
      },
      {
        name: 'Trafalgar Law',
        gif: 'https://media.tenor.com/yv5Fz7Y6Xw0AAAAC/law-room.gif'
      },
      {
        name: 'Portgas D. Ace',
        gif: 'https://media.tenor.com/8sUqP9vF7bAAAAAC/ace-fire.gif'
      },
      {
        name: 'Shanks',
        gif: 'https://media.tenor.com/yV6z0FqX7cQAAAAC/shanks-haki.gif'
      },
      {
        name: 'Kaido',
        gif: 'https://media.tenor.com/2d4G5ZkXK9gAAAAC/kaido-dragon.gif'
      },
      {
        name: 'Eustass Kid',
        gif: 'https://media.tenor.com/0XK7XyW9tKkAAAAC/kid-magnet.gif'
      }
    ];

    const chosen = pickRandom(characters);

    const finalMsg = `*🏴‍☠️ IDENTITÀ RIVELATA*  
━━━━━━━━━━━━━━━━━━━━━  
👤 *Utente:* @${userId}  
⚔️ *Sei:* ${chosen.name}  
🕒 *Tempo:* ${timeTaken}s  
━━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: chosen.gif },
        caption: finalMsg,
        mentions,
        gifPlayback: true
      },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    await m.reply('⚠️ Errore durante la scansione.');
  }
};

handler.command = /^(onepiece)$/i;
handler.group = true;

export default handler;