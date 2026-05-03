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
    let mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    const mentions = [mention];
    const userId = mention.split('@')[0];

    let percent = 0;

    let { key } = await conn.sendMessage(
      m.chat,
      { text: `🏴‍☠️ *SCANSIONE PIRATA...*\n\n${progressBar(percent)} ${percent}%` },
      { quoted: m }
    );

    for (const p of [30, 60, 100]) {
      await wait(700);
      percent = p;

      await conn.sendMessage(
        m.chat,
        {
          text: `🏴‍☠️ *SCANSIONE PIRATA...*\n\n${progressBar(percent)} ${percent}%`,
          edit: key,
          mentions
        },
        { quoted: m }
      );
    }

    const pool = [
      {
        name: 'Monkey D. Luffy',
        rarity: 'Leggendario',
        url: 'https://files.catbox.moe/7k3p9m.mp4'
      },
      {
        name: 'Roronoa Zoro',
        rarity: 'Epico',
        url: 'https://files.catbox.moe/2x9kqv.mp4'
      },
      {
        name: 'Sanji',
        rarity: 'Raro',
        url: 'https://files.catbox.moe/9m1zla.mp4'
      },
      {
        name: 'Trafalgar Law',
        rarity: 'Raro',
        url: 'https://files.catbox.moe/0q8wjd.mp4'
      },
      {
        name: 'Shanks',
        rarity: 'Leggendario',
        url: 'https://files.catbox.moe/5v7n2c.mp4'
      },
      {
        name: 'Kaido',
        rarity: 'Leggendario',
        url: 'https://files.catbox.moe/8d1xpp.mp4'
      },
      {
        name: 'Portgas D. Ace',
        rarity: 'Epico',
        url: 'https://files.catbox.moe/3l9zrt.mp4'
      }
    ];

    const getCharacter = () => {
      const roll = Math.random() * 100;

      if (roll < 50) return pickRandom(pool.filter(x => x.rarity === 'Raro'));
      if (roll < 80) return pickRandom(pool.filter(x => x.rarity === 'Epico'));
      return pickRandom(pool.filter(x => x.rarity === 'Leggendario'));
    };

    const chosen = getCharacter();

    const start = performance.now();
    await wait(1200);
    const end = performance.now();

    const timeTaken = ((end - start) / 1000).toFixed(2);

    const rarityIcon = {
      Raro: '🔵',
      Epico: '🟣',
      Leggendario: '🔴'
    };

    const caption = `*🏴‍☠️ IDENTITÀ RIVELATA*  
━━━━━━━━━━━━━━━━━━━  
👤 @${userId}  
⚔️ Sei: *${chosen.name}*  
${rarityIcon[chosen.rarity]} Rarità: *${chosen.rarity}*  
🕒 Tempo: ${timeTaken}s  
━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: chosen.url },
        caption,
        mentions,
        gifPlayback: true
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Errore durante la trasformazione.');
  }
};

handler.command = /^(onepiece)$/i;
handler.group = true;

export default handler;