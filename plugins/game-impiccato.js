const parole = [
  'cane', 'gatto', 'leone', 'elefante', 'tigre', 'pinguino', 'orso', 'squalo',
  'scuola', 'universita', 'ospedale', 'stadio', 'biblioteca', 'banca', 'mercato',
  'telefono', 'computer', 'stampante', 'televisore', 'monitor', 'finestra', 'porta', 'sedia',
  'bicicletta', 'macchina', 'aereo', 'treno', 'barca', 'razzo', 'sottomarino',
  'montagna', 'mare', 'collina', 'lago', 'isola', 'deserto', 'vulcano',
  'albero', 'fiore', 'bosco', 'prato', 'giardino', 'foresta', 'cielo',
  'amico', 'famiglia', 'felicita', 'paura', 'sogno', 'speranza', 'giustizia', 'liberta'
];

const premio = 200;
const durataGioco = 180000; // 3 minuti

let handler = async (m, { conn, command, args }) => {
  const chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) {
    return m.reply('📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\nI giochi sono in pausa al momento.');
  }

  if (!global.gamesImpiccato) global.gamesImpiccato = {};

  const key = `${m.chat}`;
  const subcmd = args[0]?.toLowerCase();

  if (!subcmd) {
    const buttons = [
      { buttonId: '.impiccato singleplayer', buttonText: { displayText: '🎮 Singleplayer' }, type: 1 },
      { buttonId: '.impiccato multi', buttonText: { displayText: '👥 Multiplayer' }, type: 1 }
    ];
    return await conn.sendMessage(m.chat, {
      text: '🪓 *Gioco dell\'Impiccato*\nScegli la modalità:',
      buttons,
      headerType: 1
    }, { quoted: m });
  }

  if (global.gamesImpiccato[key]?.attivo) {
    return m.reply('⚠️ C\'è già una partita in corso!');
  }

  const parola = parole[Math.floor(Math.random() * parole.length)];
  const indovinata = Array(parola.length).fill('_');
  const tipo = subcmd === 'singleplayer' ? 'singolo' : 'multi';

  const game = {
    parola,
    indovinata,
    sbagliate: [],
    tentativi: 6,
    attivo: true,
    tipo,
    autore: m.sender,
    start: Date.now(),
    timeout: setTimeout(() => {
      conn.reply(m.chat, `⏰ Tempo scaduto! La parola era: *${parola}*`, m);
      delete global.gamesImpiccato[key];
    }, durataGioco)
  };

  global.gamesImpiccato[key] = game;

  return conn.reply(m.chat,
    `🎮 *Impiccato (${tipo === 'singolo' ? 'Singleplayer' : 'Multiplayer'})*\n\n` +
    `Parola: ${indovinata.join(' ')}\nTentativi rimasti: 6\nLettere sbagliate: Nessuna\n` +
    `> Hai 3 minuti per indovinare!`, m);
};

handler.before = async function (m, { conn }) {
  const key = `${m.chat}`;
  const game = global.gamesImpiccato?.[key];
  if (!game || !game.attivo) return;

  const testo = m.text?.toLowerCase().trim();
  if (!testo) return;

  if (game.tipo === 'singolo' && m.sender !== game.autore) return;

  if (testo.length > 1) {
    // Tentativo parola intera
    if (testo === game.parola) {
      clearTimeout(game.timeout);
      delete global.gamesImpiccato[key];

      const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {});
      user.money = (user.money || 0) + premio;

      return conn.reply(m.chat, `🎉 *Bravo @${m.sender.split('@')[0]}!* Hai indovinato la parola completa: *${game.parola}*!\n💰 +${premio}€`, m, { mentions: [m.sender] });
    }
    return; // Non dice nulla se sbagli
  }

  if (!/^[a-zàèéìòù]$/i.test(testo)) return;

  if (game.sbagliate.includes(testo) || game.indovinata.includes(testo)) {
    return conn.reply(m.chat, '❌ Lettera già usata!', m);
  }

  if (game.parola.includes(testo)) {
    for (let i = 0; i < game.parola.length; i++) {
      if (game.parola[i] === testo) game.indovinata[i] = testo;
    }

    if (game.indovinata.join('') === game.parola) {
      clearTimeout(game.timeout);
      delete global.gamesImpiccato[key];

      const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {});
      user.money = (user.money || 0) + premio;

      return conn.reply(m.chat, `🎉 *Bravo @${m.sender.split('@')[0]}!* Hai completato la parola: *${game.parola}*!\n💰 +${premio}€`, m, { mentions: [m.sender] });
    }
  } else {
    game.sbagliate.push(testo);
    game.tentativi--;

    if (game.tentativi <= 0) {
      clearTimeout(game.timeout);
      delete global.gamesImpiccato[key];
      return conn.reply(m.chat, `💀 Hai perso! La parola era: *${game.parola}*`, m);
    }
  }

  return conn.reply(m.chat,
    `🎮 *Gioco dell'Impiccato*\n\n${game.indovinata.join(' ')}\nTentativi rimanenti: ${game.tentativi}\n` +
    `Lettere sbagliate: ${game.sbagliate.join(', ') || 'Nessuna'}`, m);
};

handler.command = /^impiccato(?:\s(singolo|multi))?$/i;

export default handler;