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
      {
        text: `🏴‍☠️ *ANALISI PIRATA IN CORSO...*\n\n${progressBar(percent)} ${percent}%`
      },
      { quoted: m }
    );

    for (const p of [25, 50, 75, 100]) {
      await wait(700);
      percent = p;

      await conn.sendMessage(
        m.chat,
        {
          text: `🏴‍☠️ *ANALISI PIRATA IN CORSO...*\n\n${progressBar(percent)} ${percent}%`,
          edit: key,
          mentions
        },
        { quoted: m }
      );
    }

    // 🎯 PERSONAGGI CON RARITÀ
    const pool = [
      // 🟢 COMUNI
      {
        name: 'Usopp',
        rarity: 'Comune',
        url: 'https://i.imgur.com/1X4Z1Zq.gif'
      },
      {
        name: 'Nami',
        rarity: 'Comune',
        url: 'https://i.imgur.com/0mKXcgK.gif'
      },
      {
        name: 'Chopper',
        rarity: 'Comune',
        url: 'https://i.imgur.com/jkW6F6R.gif'
      },

      // 🔵 RARI
      {
        name: 'Sanji',
        rarity: 'Raro',
        url: 'https://i.imgur.com/8R0pYwM.gif'
      },
      {
        name: 'Trafalgar Law',
        rarity: 'Raro',
        url: 'https://i.imgur.com/yvZ6FQk.gif'
      },
      {
        name: 'Portgas D. Ace',
        rarity: 'Raro',
        url: 'https://i.imgur.com/5K3sK0G.gif'
      },

      // 🟣 EPICI
      {
        name: 'Roronoa Zoro',
        rarity: 'Epico',
        url: 'https://i.imgur.com/Ye7gS5G.gif'
      },
      {
        name: 'Monkey D. Luffy',
        rarity: 'Epico',
        url: 'https://i.imgur.com/3k9ZK7F.gif'
      },

      // 🔴 LEGGENDARI
      {
        name: 'Shanks',
        rarity: 'Leggendario',
        url: 'https://i.imgur.com/Dh1ZK8G.gif'
      },
      {
        name: 'Kaido',
        rarity: 'Leggendario',
        url: 'https://i.imgur.com/V6X9YpL.gif'
      },
      {
        name: 'Gear 5 Luffy',
        rarity: 'Leggendario',
        url: 'https://i.imgur.com/6o7KQpR.gif'
      }
    ];

    // 🎲 SISTEMA RARITÀ
    function getCharacter() {
      const roll = Math.random() * 100;

      if (roll < 50) {
        return pickRandom(pool.filter(c => c.rarity === 'Comune'));
      } else if (roll < 80) {
        return pickRandom(pool.filter(c => c.rarity === 'Raro'));
      } else if (roll < 95) {
        return pickRandom(pool.filter(c => c.rarity === 'Epico'));
      } else {
        return pickRandom(pool.filter(c => c.rarity === 'Leggendario'));
      }
    }

    const chosen = getCharacter();

    const start = performance.now();
    await wait(Math.random() * 2000 + 1000);
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(2);

    // 🎨 ICONA RARITÀ
    const rarityIcon = {
      Comune: '🟢',
      Raro: '🔵',
      Epico: '🟣',
      Leggendario: '🔴'
    };

    const finalMsg = `*🏴‍☠️ IDENTITÀ PIRATA*  
━━━━━━━━━━━━━━━━━━━━━  
👤 @${userId}  
⚔️ *Sei:* ${chosen.name}  
${rarityIcon[chosen.rarity]} *Rarità:* ${chosen.rarity}  
🕒 Tempo: ${timeTaken}s  
━━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: chosen.url },
        caption: finalMsg,
        mentions,
        gifPlayback: true
      },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    await m.reply('⚠️ Errore durante la trasformazione.');
  }
};

handler.command = /^(onepiece)$/i;
handler.group = true;

export default handler;