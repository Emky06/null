const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;

  if (!users[who]) {
    users[who] = { animali: [], cibo: 0, animaliMorti: 0, money: 0, bank: 0 };
  }

  const user = users[who];

  if (!user.animali || user.animali.length === 0) {
    return conn.reply(m.chat, '❌ Non hai animali da abbandonare.', m);
  }

  const MULTA = 10000;
  const totale = (user.money || 0) + (user.bank || 0);
  if (totale < MULTA) {
    return conn.reply(
      m.chat,
      `❌ Non hai abbastanza soldi per pagare la multa di *${MULTA.toLocaleString('it-IT')} €* per abbandonare un animale.`,
      m
    );
  }

  // Se il messaggio non contiene l'ID dell'animale, mostra i pulsanti
  const args = (m.text || '').trim().split(/\s+/);
  if (args.length === 1) {
    let text = '*💔 QUALE ANIMALE VUOI ABBANDONARE?*\n\n';
    const buttons = [];

    user.animali.forEach((a, i) => {
      const [emoji] = a.nome.split(' ');
      const nomePersonalizzato = a.nomeUtente || a.nome.split(' ').slice(1).join(' ');
      const nomeCompleto = `${emoji} ${nomePersonalizzato}`;

      text += `${i + 1}. *${nomeCompleto}*\n`;
      buttons.push({
        buttonId: `.abbandonanimali ${i + 1}`,
        buttonText: { displayText: `Abbandona ${nomeCompleto}` },
        type: 1
      });
    });

    await conn.sendMessage(m.chat, {
      text,
      buttons,
      headerType: 1
    }, { quoted: m });

    return;
  }

  // L'utente ha premuto un pulsante
  const index = parseInt(args[1]) - 1;
  if (isNaN(index) || index < 0 || index >= user.animali.length) {
    return conn.reply(m.chat, '❌ Numero non valido. Riprova.', m);
  }

  const abbandonato = user.animali.splice(index, 1)[0];

  if (user.money >= MULTA) {
    user.money -= MULTA;
  } else {
    const diff = MULTA - user.money;
    user.money = 0;
    user.bank -= diff;
  }

  global.db.write();

  const nomeAbbandonato = abbandonato.nomeUtente || abbandonato.nome;

  return conn.reply(
    m.chat,
    `💔 Hai abbandonato ${nomeAbbandonato}.\n💸 Hai pagato una multa di *${MULTA.toLocaleString('it-IT')} €*.`,
    m
  );
};

handler.command = /^abbandonanimali$/i;
handler.exp = 0;
export default handler;