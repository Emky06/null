// Plugin fatto da Axtral_WiZaRd
const prefissi = [
  { prefisso: '+93', paese: 'afghanistan', bandiera: '🇦🇫' },
  { prefisso: '+355', paese: 'albania', bandiera: '🇦🇱' },
  { prefisso: '+213', paese: 'algeria', bandiera: '🇩🇿' },
  { prefisso: '+376', paese: 'andorra', bandiera: '🇦🇩' },
  { prefisso: '+244', paese: 'angola', bandiera: '🇦🇴' },
  { prefisso: '+1-268', paese: 'antigua e barbuda', bandiera: '🇦🇬' },
  { prefisso: '+54', paese: 'argentina', bandiera: '🇦🇷' },
  { prefisso: '+374', paese: 'armenia', bandiera: '🇦🇲' },
  { prefisso: '+61', paese: 'australia', bandiera: '🇦🇺' },
  { prefisso: '+43', paese: 'austria', bandiera: '🇦🇹' },
  { prefisso: '+994', paese: 'azerbaigian', bandiera: '🇦🇿' },

  { prefisso: '+1-242', paese: 'bahamas', bandiera: '🇧🇸' },
  { prefisso: '+973', paese: 'bahrein', bandiera: '🇧🇭' },
  { prefisso: '+880', paese: 'bangladesh', bandiera: '🇧🇩' },
  { prefisso: '+1-246', paese: 'barbados', bandiera: '🇧🇧' },
  { prefisso: '+375', paese: 'bielorussia', bandiera: '🇧🇾' },
  { prefisso: '+32', paese: 'belgio', bandiera: '🇧🇪' },
  { prefisso: '+501', paese: 'belize', bandiera: '🇧🇿' },
  { prefisso: '+229', paese: 'benin', bandiera: '🇧🇯' },
  { prefisso: '+975', paese: 'bhutan', bandiera: '🇧🇹' },
  { prefisso: '+591', paese: 'bolivia', bandiera: '🇧🇴' },
  { prefisso: '+387', paese: 'bosnia ed erzegovina', bandiera: '🇧🇦' },
  { prefisso: '+267', paese: 'botswana', bandiera: '🇧🇼' },
  { prefisso: '+55', paese: 'brasile', bandiera: '🇧🇷' },
  { prefisso: '+673', paese: 'brunei', bandiera: '🇧🇳' },
  { prefisso: '+359', paese: 'bulgaria', bandiera: '🇧🇬' },
  { prefisso: '+226', paese: 'burkina faso', bandiera: '🇧🇫' },
  { prefisso: '+257', paese: 'burundi', bandiera: '🇧🇮' },

  { prefisso: '+855', paese: 'cambogia', bandiera: '🇰🇭' },
  { prefisso: '+237', paese: 'camerun', bandiera: '🇨🇲' },
  { prefisso: '+1', paese: 'canada', bandiera: '🇨🇦' },
  { prefisso: '+238', paese: 'capo verde', bandiera: '🇨🇻' },
  { prefisso: '+236', paese: 'repubblica centrafricana', bandiera: '🇨🇫' },
  { prefisso: '+235', paese: 'ciad', bandiera: '🇹🇩' },
  { prefisso: '+56', paese: 'cile', bandiera: '🇨🇱' },
  { prefisso: '+86', paese: 'cina', bandiera: '🇨🇳' },
  { prefisso: '+57', paese: 'colombia', bandiera: '🇨🇴' },
  { prefisso: '+269', paese: 'comore', bandiera: '🇰🇲' },
  { prefisso: '+242', paese: 'repubblica del congo', bandiera: '🇨🇬' },
  { prefisso: '+243', paese: 'repubblica democratica del congo', bandiera: '🇨🇩' },
  { prefisso: '+506', paese: 'costa rica', bandiera: '🇨🇷' },
  { prefisso: '+385', paese: 'croazia', bandiera: '🇭🇷' },
  { prefisso: '+53', paese: 'cuba', bandiera: '🇨🇺' },
  { prefisso: '+357', paese: 'cipro', bandiera: '🇨🇾' },
  { prefisso: '+420', paese: 'repubblica ceca', bandiera: '🇨🇿' },

  { prefisso: '+45', paese: 'danimarca', bandiera: '🇩🇰' },
  { prefisso: '+253', paese: 'gibuti', bandiera: '🇩🇯' },
  { prefisso: '+1-767', paese: 'dominica', bandiera: '🇩🇲' },
  { prefisso: '+1-809', paese: 'repubblica dominicana', bandiera: '🇩🇴' },

  { prefisso: '+593', paese: 'ecuador', bandiera: '🇪🇨' },
  { prefisso: '+20', paese: 'egitto', bandiera: '🇪🇬' },
  { prefisso: '+503', paese: 'el salvador', bandiera: '🇸🇻' },
  { prefisso: '+240', paese: 'guinea equatoriale', bandiera: '🇬🇶' },
  { prefisso: '+291', paese: 'eritrea', bandiera: '🇪🇷' },
  { prefisso: '+372', paese: 'estonia', bandiera: '🇪🇪' },
  { prefisso: '+268', paese: 'eswatini', bandiera: '🇸🇿' },
  { prefisso: '+251', paese: 'etiopia', bandiera: '🇪🇹' },

  { prefisso: '+358', paese: 'finlandia', bandiera: '🇫🇮' },
  { prefisso: '+33', paese: 'francia', bandiera: '🇫🇷' },

  { prefisso: '+49', paese: 'germania', bandiera: '🇩🇪' },
  { prefisso: '+30', paese: 'grecia', bandiera: '🇬🇷' },
  { prefisso: '+44', paese: 'regno unito', bandiera: '🇬🇧' },
  { prefisso: '+1', paese: 'stati uniti', bandiera: '🇺🇸' },
  { prefisso: '+39', paese: 'italia', bandiera: '🇮🇹' },
  { prefisso: '+81', paese: 'giappone', bandiera: '🇯🇵' },
  { prefisso: '+82', paese: 'corea del sud', bandiera: '🇰🇷' },
  { prefisso: '+7', paese: 'russia', bandiera: '🇷🇺' },
  { prefisso: '+34', paese: 'spagna', bandiera: '🇪🇸' },
  { prefisso: '+46', paese: 'svezia', bandiera: '🇸🇪' },
  { prefisso: '+41', paese: 'svizzera', bandiera: '🇨🇭' },
  { prefisso: '+90', paese: 'turchia', bandiera: '🇹🇷' },
  { prefisso: '+971', paese: 'emirati arabi uniti', bandiera: '🇦🇪' },
  { prefisso: '+27', paese: 'sudafrica', bandiera: '🇿🇦' }
];

let handler = async (m, { conn }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨.');
  }

  if (!global.partitePrefissi) global.partitePrefissi = {};
  if (!global.cooldownPrefissi) global.cooldownPrefissi = {};

  const id = m.chat;

  if (global.partitePrefissi[id]?.attiva) {
    return conn.reply(m.chat, '⚠️ C\'è già una sfida attiva in questa chat!', m);
  }

  if (global.cooldownPrefissi[id]) {
    const tempoRimasto = Math.ceil((global.cooldownPrefissi[id] - Date.now()) / 1000);
    if (tempoRimasto > 0)
      return conn.reply(m.chat, `⏳ Attendi *${tempoRimasto} secondi* prima di iniziare una nuova sfida!`, m);
  }

  const scelta = prefissi[Math.floor(Math.random() * prefissi.length)];
  const primaLettera = scelta.paese[0].toUpperCase();

  const messaggio = await conn.reply(
    m.chat,
    `╭━━━━━━━━━━━━━━━━━━━╮
┃📞 Indovina il paese di questo prefisso:
┣━━━━━━━━━━━━━━━━━━━
┃            ${scelta.prefisso}
┣━━━━━━━━━━━━━━━━━━━
┃💡 *Indizio iniziale:* la nazione
┃inizia con *${primaLettera}*
╰━━━━━━━━━━━━━━━━━━━╯
> Hai *30* secondi per rispondere a questo messaggio con il nome del paese.`,
    m
  );

  const timeoutId = setTimeout(() => {
    const partita = global.partitePrefissi[id];
    if (partita && partita.attiva) {
      const rispostaGiusta = partita.risposta.charAt(0).toUpperCase() + partita.risposta.slice(1);
      conn.reply(m.chat,
        `╭━━━━━━━━━━━━━━━━━━━╮
┃⏰ *Tempo scaduto!* 😞
┣━━━━━━━━━━━━━━━━━━━
┃La risposta corretta era: *${rispostaGiusta}*
╰━━━━━━━━━━━━━━━━━━━╯`,
        messaggio
      );

      delete global.partitePrefissi[id];
      global.cooldownPrefissi[id] = Date.now() + 15000;
      setTimeout(() => delete global.cooldownPrefissi[id], 15000);
    }
  }, 30000);

  global.partitePrefissi[id] = {
    risposta: scelta.paese.toLowerCase(),
    messaggioId: messaggio.key.id,
    attiva: true,
    tentativi: 0,
    startTime: Date.now(),
    timeoutId
  };
};

handler.before = async function (m, { conn }) {
  const id = m.chat;
  const partita = global.partitePrefissi?.[id];
  if (!partita || !partita.attiva) return;

  const testo = m.text?.toLowerCase().trim();
  if (!testo) return;

  const isReply = m.quoted && m.quoted.id === partita.messaggioId;
  if (!isReply) return;

  partita.tentativi++;

  if (testo === partita.risposta) {
    const userId = m.sender;

    if (!global.db.data.users[userId]) global.db.data.users[userId] = {};
    if (!global.db.data.users[userId].vittoriePrefissi)
      global.db.data.users[userId].vittoriePrefissi = 0;

    global.db.data.users[userId].vittoriePrefissi += 1;

    const reward = 100;
    global.db.data.users[userId].money =
      (global.db.data.users[userId].money || 0) + reward;

    const elapsed = Math.floor((Date.now() - partita.startTime) / 1000);
    const rispostaGiusta =
      partita.risposta.charAt(0).toUpperCase() + partita.risposta.slice(1);

    partita.attiva = false;
    clearTimeout(partita.timeoutId);

    const dati = prefissi.find(p => p.paese === partita.risposta);

await conn.sendMessage(m.chat, {
  text: `╭━━━━━━━━━━━━━━━━━━━╮
┃✅ *@${userId.split('@')[0]} ha indovinato!*
┣━━━━━━━━━━━━━━━━━━━
┃🌍 Nazione: *${dati.paese.toUpperCase()}* ${dati.bandiera}
┣━━━━━━━━━━━━━━━━━━━
┃📞 Prefisso: *${dati.prefisso}*
┣━━━━━━━━━━━━━━━━━━━
┃⏱️ Tempo: *${elapsed} secondi*
┣━━━━━━━━━━━━━━━━━━━
┃💰 Guadagno: *${reward}* €
╰━━━━━━━━━━━━━━━━━━━╯`,
  mentions: [userId]
});

    global.cooldownPrefissi[id] = Date.now() + 10000;
    setTimeout(() => delete global.cooldownPrefissi[id], 10000);
    delete global.partitePrefissi[id];
  } else {
    if (partita.tentativi === 2) {
      const risposta = partita.risposta;
      const primeDueLettere = risposta.slice(0, 2).toUpperCase();
      const numeroLettere = risposta.length;

      await conn.reply(
        m.chat,
        `💡 *Indizio:*\nComposta da *${numeroLettere} lettere* e inizia con *${primeDueLettere}...*`,
        m
      );
    }

    await conn.reply(m.chat, `❌ *Risposta errata, riprova!*`, m);
  }

  return true;
};

handler.command = /^prefisso$/i;
export default handler;