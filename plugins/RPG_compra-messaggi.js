const confirmationAcquista = {};

const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;
  if (!users[who]) users[who] = { money: 0, bank: 0, messaggi: 0 };
  const user = users[who];

  const options = [
    { msgs: 500, price: 40000 },
    { msgs: 1000, price: 50000 },
    { msgs: 2000, price: 70000 },
    { msgs: 5000, price: 120000 },
    { msgs: 10000, price: 230000 },
  ];

  const text = (m.text || '').trim();
  const args = text.split(/\s+/);

  // Se il comando è solo ".acquista" mostro i pulsanti
  if (args.length === 1) {
    let reply = '*💼 ACQUISTA MESSAGGI 💼*\n\nScegli una delle opzioni disponibili:\n\n';
    options.forEach(({ msgs, price }, i) => {
      reply += `${i + 1}. Acquista *${msgs.toLocaleString('it-IT')} messaggi* a *${price.toLocaleString('it-IT')} €*\n`;
    });

    // Pulsanti singoli
    const button1 = {
      buttonId: `.acquista 1`,
      buttonText: { displayText: 'Compra 500 Msg - 40.000€' }
    };
    const button2 = {
      buttonId: `.acquista 2`,
      buttonText: { displayText: 'Compra 1000 Msg - 50.000€' }
    };
    const button3 = {
      buttonId: `.acquista 3`,
      buttonText: { displayText: 'Compra 2000 Msg - 70.000€' }
    };
    const button4 = {
      buttonId: `.acquista 4`,
      buttonText: { displayText: 'Compra 5000 Msg - 120.000€' }
    };
    const button5 = {
      buttonId: `.acquista 5`,
      buttonText: { displayText: 'Compra 10.000 Msg - 230.000€' }
    };

    const buttons = [button1, button2, button3, button4, button5];

    await conn.sendMessage(m.chat, {
      text: reply,
      buttons: buttons,
      headerType: 1
    }, { quoted: m });

    // Salvo chi ha aperto il menu, per 60 secondi
    confirmationAcquista[who] = setTimeout(() => {
      delete confirmationAcquista[who];
    }, 60000);

    return;
  }

  // Controllo che chi acquista abbia aperto il menu
  if (!(who in confirmationAcquista)) {
    return conn.reply(m.chat, '❌ Devi prima aprire il menu con il comando .acquista', m);
  }

  // Se arrivo qui, significa che c'è un argomento (es: .acquista 2)
  const choice = parseInt(args[1]);
  if (!choice || choice < 1 || choice > options.length) {
    return conn.reply(m.chat, '❌ Scelta non valida, scegli un numero da 1 a 5.', m);
  }

  const { msgs, price } = options[choice - 1];

  // Verifica che chi ha inviato il comando sia lo stesso che sta acquistando (da sempre vero qui)
  if (m.sender !== who) {
    return conn.reply(m.chat, '❌ Solo chi esegue il comando può fare l\'acquisto.', m);
  }

  const totaleSoldi = (user.money || 0) + (user.bank || 0);

  if (totaleSoldi < price) {
    return conn.reply(
      m.chat,
      `❌ Non hai abbastanza soldi per acquistare *${msgs.toLocaleString('it-IT')}* messaggi.\nPrezzo: *${price.toLocaleString('it-IT')} €*\nSaldo totale: *${totaleSoldi.toLocaleString('it-IT')} €*`,
      m
    );
  }

  // Deduzione soldi da contanti e banca
  if ((user.money || 0) >= price) {
    user.money -= price;
  } else {
    const resto = price - (user.money || 0);
    user.money = 0;
    user.bank = (user.bank || 0) - resto;
  }

  user.messaggi = (user.messaggi || 0) + msgs;
  global.db.write();

  return conn.reply(
    m.chat,
    `✅ Acquisto effettuato con successo!\nHai comprato *${msgs.toLocaleString('it-IT')}* messaggi per *${price.toLocaleString('it-IT')} €*.\nMessaggi totali disponibili: *${user.messaggi.toLocaleString('it-IT')}*\nSoldi rimasti: *${((user.money || 0) + (user.bank || 0)).toLocaleString('it-IT')} €*`,
    m
  );
};

handler.command = /^acquista$/i;
handler.exp = 0;
export default handler;