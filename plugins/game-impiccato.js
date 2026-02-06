const parole = [
  'cane', 'gatto', 'leone', 'elefante', 'tigre', 'pinguino', 'orso', 'squalo',
  'scuola', 'universita', 'ospedale', 'stadio', 'biblioteca', 'banca', 'mercato',
  'telefono', 'computer', 'stampante', 'televisore', 'monitor', 'finestra', 'porta', 'sedia',
  'bicicletta', 'macchina', 'aereo', 'treno', 'barca', 'razzo', 'sottomarino',
  'montagna', 'mare', 'collina', 'lago', 'isola', 'deserto', 'vulcano',
  'albero', 'fiore', 'bosco', 'prato', 'giardino', 'foresta', 'cielo',
  'amico', 'famiglia', 'felicita', 'paura', 'sogno', 'speranza', 'giustizia', 'liberta'
];

const premio = 100;
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
      { buttonId: '.impiccato singleplayer', buttonText: { displayText: '🎮 𝐒𝐢𝐧𝐠𝐥𝐞𝐩𝐥𝐚𝐲𝐞𝐫' }, type: 1 },
      { buttonId: '.impiccato multi', buttonText: { displayText: '👥 𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫' }, type: 1 }
    ];
    return await conn.sendMessage(m.chat, {
      text: '🪓 *𝐆𝐢𝐨𝐜𝐨 𝐝𝐞𝐥𝐥\'𝐈𝐦𝐩𝐢𝐜𝐜𝐚𝐭𝐨*\n𝐒𝐜𝐞𝐠𝐥𝐢 𝐥𝐚 𝐦𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀:',
      buttons,
      headerType: 1
    }, { quoted: m });
  }

  if (global.gamesImpiccato[key]?.attivo) {
    return m.reply('⚠️ 𝐂\'𝐞̀ 𝐠𝐢𝐚̀ 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨!');
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
      conn.reply(m.chat, `⏰ 𝐓𝐞𝐦𝐩𝐨 𝐬𝐜𝐚𝐝𝐮𝐭𝐨! 𝐋𝐚 𝐩𝐚𝐫𝐨𝐥𝐚 𝐞𝐫𝐚: *${parola}*`, m);
      delete global.gamesImpiccato[key];
    }, durataGioco)
  };

  global.gamesImpiccato[key] = game;

  return conn.reply(m.chat,
    `🎮 *𝐈𝐦𝐩𝐢𝐜𝐜𝐚𝐭𝐨 (${tipo === 'singolo' ? '𝐒𝐢𝐧𝐠𝐥𝐞𝐩𝐥𝐚𝐲𝐞𝐫' : '𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫'})*\n\n` +
    `𝐏𝐚𝐫𝐨𝐥𝐚: ${indovinata.join(' ')}\n𝐓𝐞𝐧𝐭𝐚𝐭𝐢𝐯𝐢 𝐫𝐢𝐦𝐚𝐬𝐭𝐢: 𝟔\n𝐋𝐞𝐭𝐭𝐞𝐫𝐞 𝐬𝐛𝐚𝐠𝐥𝐢𝐚𝐭𝐞: Nessuna\n` +
    `> 𝐇𝐚𝐢 𝟑 𝐦𝐢𝐧𝐮𝐭𝐢 𝐩𝐞𝐫 𝐢𝐧𝐝𝐨𝐯𝐢𝐧𝐚𝐫𝐞!`, m);
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

      return conn.reply(m.chat, `🎉 *𝐁𝐫𝐚𝐯𝐨 @${m.sender.split('@')[0]}!* 𝐇𝐚𝐢 𝐢𝐧𝐝𝐨𝐯𝐢𝐧𝐚𝐭𝐨 𝐥𝐚 𝐩𝐚𝐫𝐨𝐥𝐚 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚: *${game.parola}*!\n💰 +${premio}€`, m, { mentions: [m.sender] });
    }
    return; 
  }

  if (!/^[a-zàèéìòù]$/i.test(testo)) return;

  if (game.sbagliate.includes(testo) || game.indovinata.includes(testo)) {
    return conn.reply(m.chat, '❌ 𝐋𝐞𝐭𝐭𝐞𝐫𝐚 𝐠𝐢𝐚̀ 𝐮𝐬𝐚𝐭𝐚!', m);
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

      return conn.reply(m.chat, `🎉 *𝐁𝐫𝐚𝐯𝐨 @${m.sender.split('@')[0]}!* 𝐇𝐚𝐢 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐨 𝐥𝐚 𝐩𝐚𝐫𝐨𝐥𝐚: *${game.parola}*!\n💰 +${premio}€`, m, { mentions: [m.sender] });
    }
  } else {
    game.sbagliate.push(testo);
    game.tentativi--;

    if (game.tentativi <= 0) {
      clearTimeout(game.timeout);
      delete global.gamesImpiccato[key];
      return conn.reply(m.chat, `💀 𝐇𝐚𝐢 𝐩𝐞𝐫𝐬𝐨! 𝐋𝐚 𝐩𝐚𝐫𝐨𝐥𝐚 𝐞𝐫𝐚: *${game.parola}*`, m);
    }
  }

  return conn.reply(m.chat,
    `🎮 *𝐆𝐢𝐨𝐜𝐨 𝐝𝐞𝐥𝐥'𝐈𝐦𝐩𝐢𝐜𝐜𝐚𝐭𝐨*\n\n${game.indovinata.join(' ')}\n𝐓𝐞𝐧𝐭𝐚𝐭𝐢𝐯𝐢 𝐫𝐢𝐦𝐚𝐧𝐞𝐧𝐭𝐢: ${game.tentativi}\n` +
    `𝐋𝐞𝐭𝐭𝐞𝐫𝐞 𝐬𝐛𝐚𝐠𝐥𝐢𝐚𝐭𝐞: ${game.sbagliate.join(', ') || 'Nessuna'}`, m);
};

handler.command = /^impiccato(?:\s(singolo|multi))?$/i;

export default handler;