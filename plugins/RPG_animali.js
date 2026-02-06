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

  if (!users[who]) users[who] = { animali: [], cibo: 0, money: 0, bank: 0 };

  const user = users[who];

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
  if (rimossi > 0) text += `\n⚠️ *${rimossi} animale/i rimossi* dallo shop (non più disponibili)`;

  const buttons = [
    { buttonId: '.daicibo', buttonText: { displayText: 'Dai da mangiare 🥫' } },
    { buttonId: '.shopanimali', buttonText: { displayText: 'Vai allo shop 🛒' } },
    { buttonId: '.helpnomina', buttonText: { displayText: 'Come rinominare ✏️' } },
    { buttonId: '.abbandonanimali', buttonText: { displayText: '⚠️ Abbandona animale ⚠️' } },
  ];

  await conn.sendMessage(
    m.chat,
    { text: text.trim(), buttons, headerType: 1 },
    { quoted: m }
  );
};

handler.command = /^animali$/i;
handler.exp = 0;
export default handler;

// ----------------- SHOP ANIMALI -----------------
const confirmationAcquistoAnimale = {};

export const shopAnimaliHandler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;
  if (!users[who]) users[who] = { animali: [], cibo: 0, animaliMorti: 0, money: 0, bank: 0 };
  const user = users[who];

  const animali = [
    { nome: '🐶 Cane', prezzo: 17000 },
    { nome: '🐱 Gatto', prezzo: 15000 },
    { nome: '🐰 Coniglio', prezzo: 12000 },
    { nome: '🦜 Pappagallo', prezzo: 20000 },
    { nome: '🐢 Tartaruga', prezzo: 13000 },
    { nome: '🥫 Cibo (x1)', prezzo: 3000, tipo: 'cibo' },
  ];

  const text = (m.text || '').trim();
  const args = text.split(/\s+/);

  if (args.length === 1) {
    let reply = '*🐾 SHOP ANIMALI 🐾*\n\nScegli cosa vuoi acquistare:\n\n';
    animali.forEach((a, i) => {
      reply += `${i + 1}. ${a.nome} – *${a.prezzo.toLocaleString('it-IT')} €*\n`;
    });

    const buttons = animali.map((a, i) => ({
      buttonId: `.shopanimali ${i + 1}`,
      buttonText: { displayText: `Compra ${a.nome}` }
    }));

    await conn.sendMessage(m.chat, { text: reply, buttons, headerType: 1 }, { quoted: m });

    confirmationAcquistoAnimale[who] = setTimeout(() => delete confirmationAcquistoAnimale[who], 60000);
    return;
  }

  if (!(who in confirmationAcquistoAnimale)) return conn.reply(m.chat, '❌ Devi prima aprire il menu con il comando .shopanimali', m);

  const scelta = parseInt(args[1]);
  if (!scelta || scelta < 1 || scelta > animali.length) return conn.reply(m.chat, '❌ Scelta non valida.', m);

  const selezionato = animali[scelta - 1];
  const totaleSoldi = (user.money || 0) + (user.bank || 0);

  if (totaleSoldi < selezionato.prezzo) {
    return conn.reply(m.chat,
      `❌ Non hai abbastanza soldi per comprare ${selezionato.nome}.\nPrezzo: *${selezionato.prezzo.toLocaleString('it-IT')} €*\nSaldo totale: *${totaleSoldi.toLocaleString('it-IT')} €*`,
      m
    );
  }

  if (user.money >= selezionato.prezzo) {
    user.money -= selezionato.prezzo;
  } else {
    const diff = selezionato.prezzo - user.money;
    user.money = 0;
    user.bank -= diff;
  }

  if (selezionato.tipo === 'cibo') {
    user.cibo += 1;
    global.db.write();
    return conn.reply(m.chat, `🥫 Hai comprato 1 unità di cibo per *${selezionato.prezzo.toLocaleString('it-IT')} €*.`, m);
  }

  user.animali.push({
    nome: selezionato.nome,
    adottato: Date.now(),
    prossimaPoppata: Date.now() + 5 * 60 * 60 * 1000,
    chatId: m.chat
  });

  global.db.write();

  return conn.reply(m.chat,
    `✅ Hai acquistato ${selezionato.nome} per *${selezionato.prezzo.toLocaleString('it-IT')} €*!\nRicorda di dargli da mangiare con *.daicibo* ogni 5 ore.`,
    m
  );
};

shopAnimaliHandler.command = /^shopanimali$/i;
shopAnimaliHandler.exp = 0;

// ----------------- PROMEMORIA -----------------
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

        if (animale.chatId) {
          await conn.sendMessage(animale.chatId, {
            text: `⚠️ Hey @${userId.split('@')[0]}, è ora di dare da mangiare a *${nomePersonalizzato}* ${emoji}!`,
            mentions: [userId],
          });
        }
      }
    }
  }

  global.db.write();
}, 60000);