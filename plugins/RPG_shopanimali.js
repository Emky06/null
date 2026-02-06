const confirmationAcquistoAnimale = {};

const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;
  if (!users[who]) users[who] = { animali: [], cibo: 0, animaliMorti: 0 };
  const user = users[who];

  const animali = [
    { nome: '🐶 Cane', prezzo: 17000 },
    { nome: '🐱 Gatto', prezzo: 15000 },
    { nome: '🐰 Coniglio', prezzo: 12000 },
    { nome: '🦜 Pappagallo', prezzo: 20000 },
    { nome: '🐢 Tartaruga', prezzo: 13000 }, // ✅ Aggiunto qui
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

    await conn.sendMessage(m.chat, {
      text: reply,
      buttons,
      headerType: 1
    }, { quoted: m });

    confirmationAcquistoAnimale[who] = setTimeout(() => {
      delete confirmationAcquistoAnimale[who];
    }, 60000);

    return;
  }

  if (!(who in confirmationAcquistoAnimale)) {
    return conn.reply(m.chat, '❌ Devi prima aprire il menu con il comando .shopanimali', m);
  }

  const scelta = parseInt(args[1]);
  if (!scelta || scelta < 1 || scelta > animali.length) {
    return conn.reply(m.chat, '❌ Scelta non valida. Scegli un numero valido.', m);
  }

  const selezionato = animali[scelta - 1];
  const totaleSoldi = (user.money || 0) + (user.bank || 0);

  if (totaleSoldi < selezionato.prezzo) {
    return conn.reply(
      m.chat,
      `❌ Non hai abbastanza soldi per comprare ${selezionato.nome}.\nPrezzo: *${selezionato.prezzo.toLocaleString('it-IT')} €*\nSaldo totale: *${totaleSoldi.toLocaleString('it-IT')} €*`,
      m
    );
  }

  // Scala soldi
  if (user.money >= selezionato.prezzo) {
    user.money -= selezionato.prezzo;
  } else {
    const diff = selezionato.prezzo - user.money;
    user.money = 0;
    user.bank -= diff;
  }

  if (!user.animali) user.animali = [];
  if (typeof user.cibo !== 'number') user.cibo = 0;

  if (selezionato.tipo === 'cibo') {
    user.cibo += 1;
    global.db.write();
    return conn.reply(m.chat, `🥫 Hai comprato 1 unità di cibo per *${selezionato.prezzo.toLocaleString('it-IT')} €*.`, m);
  }

  // Animale nuovo
  user.animali.push({
    nome: selezionato.nome,
    adottato: Date.now(),
    prossimaPoppata: Date.now() + 10 * 1000
  });

  global.db.write();

  return conn.reply(
    m.chat,
    `✅ Hai acquistato ${selezionato.nome} per *${selezionato.prezzo.toLocaleString('it-IT')} €*!\nRicorda di dargli da mangiare con *.daicibo* ogni 5 ore.`,
    m
  );
};

handler.command = /^shopanimali$/i;
handler.exp = 0;
export default handler;