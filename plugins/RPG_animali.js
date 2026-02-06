const msToTime = (ms) => {
  if (ms <= 0) return 'ORA!';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}min`;
};

const animaliDisponibili = ['🐶 Cane', '🐱 Gatto', '🐰 Coniglio', '🦜 Pappagallo', '🐢 Tartaruga'];

const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;

  if (!users[who]) {
    users[who] = { animali: [], cibo: 0 };
    global.db.write();
  }

  const user = users[who];

  // Sicurezza dati
  if (!user.animali) user.animali = [];
  if (typeof user.cibo !== 'number') user.cibo = 0;

  let text = '*🐾 I TUOI ANIMALI 🐾*\n\n';
  const animaliAttivi = [];
  let rimossi = 0;

  for (const animale of user.animali) {
    const nonValido = !animaliDisponibili.includes(animale.nome);
    if (nonValido) {
      rimossi++;
    } else {
      animaliAttivi.push(animale);
    }
  }

  user.animali = animaliAttivi;
  global.db.write();

  if (user.animali.length === 0) {
    text += '_Non hai animali._\n';
  } else {
    const now = Date.now();
    user.animali.forEach((a, i) => {
      const tempo = a.prossimaPoppata - now;
      const [emoji] = a.nome.split(' ');
      const nomePersonalizzato = a.nomeUtente || a.nome.split(' ').slice(1).join(' ');
      text += `${i + 1}. ${emoji} *${nomePersonalizzato}* – da nutrire tra: *${msToTime(tempo)}*\n`;
    });
  }

  text += `\n🥫 *Cibo disponibile:* ${user.cibo ?? 0}`;
  if (rimossi > 0) {
    text += `\n⚠️ *${rimossi} animale/i rimossi* dallo shop (non più disponibili)`;
  }

  // Pulsanti
  const buttons = [
    { buttonId: '.daicibo', buttonText: { displayText: 'Dai da mangiare 🥫' } },
    { buttonId: '.shopanimali', buttonText: { displayText: 'Vai allo shop 🛒' } },
    { buttonId: '.helpnomina', buttonText: { displayText: 'Come rinominare ✏️' } },
    { buttonId: '.abbandonanimali', buttonText: { displayText: '⚠️ Abbandona animale ⚠️' } },
  ];

  await conn.sendMessage(
    m.chat,
    {
      text: text.trim(),
      buttons,
      headerType: 1,
    },
    { quoted: m }
  );
};

handler.command = /^animali$/i;
handler.exp = 0;
export default handler;

setInterval(async () => {
  const users = global.db.data.users;
  const now = Date.now();

  for (const userId in users) {
    const user = users[userId];
    if (!user.animali) continue;

    for (const animale of user.animali) {
      if (!animale.lastReminder) animale.lastReminder = 0;
      const tempoRimanente = animale.prossimaPoppata - now;

      if (tempoRimanente <= 0 && now - animale.lastReminder > 60000) {
        animale.lastReminder = now;
        const [emoji] = animale.nome.split(' ');
        const nomePersonalizzato = animale.nomeUtente || animale.nome.split(' ').slice(1).join(' ');

        await conn.sendMessage(userId, {
          text: `⚠️ Hey @${userId.split('@')[0]}, è ora di dare da mangiare a *${nomePersonalizzato}* ${emoji}!`,
          mentions: [userId],
        });
      }
    }
  }

  global.db.write();
}, 60000); 