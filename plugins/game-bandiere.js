//Plugin fatto da Axtral_WiZaRd
const bandiere = [
  { emoji: '🇦🇫', paese: 'afghanistan' },
  { emoji: '🇦🇱', paese: 'albania' },
  { emoji: '🇩🇿', paese: 'algeria' },
  { emoji: '🇦🇩', paese: 'andorra' },
  { emoji: '🇦🇴', paese: 'angola' },
  { emoji: '🇦🇬', paese: 'antigua e barbuda' },
  { emoji: '🇦🇷', paese: 'argentina' },
  { emoji: '🇦🇲', paese: 'armenia' },
  { emoji: '🇦🇺', paese: 'australia' },
  { emoji: '🇦🇹', paese: 'austria' },
  { emoji: '🇦🇿', paese: 'azerbaigian' },
  { emoji: '🇧🇸', paese: 'bahamas' },
  { emoji: '🇧🇭', paese: 'bahrein' },
  { emoji: '🇧🇩', paese: 'bangladesh' },
  { emoji: '🇧🇧', paese: 'barbados' },
  { emoji: '🇧🇾', paese: 'bielorussia' },
  { emoji: '🇧🇪', paese: 'belgio' },
  { emoji: '🇧🇿', paese: 'belize' },
  { emoji: '🇧🇯', paese: 'benin' },
  { emoji: '🇧🇹', paese: 'bhutan' },
  { emoji: '🇧🇴', paese: 'bolivia' },
  { emoji: '🇧🇦', paese: 'bosnia ed erzegovina' },
  { emoji: '🇧🇼', paese: 'botswana' },
  { emoji: '🇧🇷', paese: 'brasile' },
  { emoji: '🇧🇳', paese: 'brunei' },
  { emoji: '🇧🇬', paese: 'bulgaria' },
  { emoji: '🇧🇫', paese: 'burkina faso' },
  { emoji: '🇧🇮', paese: 'burundi' },
  { emoji: '🇰🇭', paese: 'cambogia' },
  { emoji: '🇨🇲', paese: 'camerun' },
  { emoji: '🇨🇦', paese: 'canada' },
  { emoji: '🇨🇻', paese: 'capo verde' },
  { emoji: '🇨🇫', paese: 'repubblica centrafricana' },
  { emoji: '🇹🇩', paese: 'ciad' },
  { emoji: '🇨🇱', paese: 'cile' },
  { emoji: '🇨🇳', paese: 'cina' },
  { emoji: '🇨🇴', paese: 'colombia' },
  { emoji: '🇰🇲', paese: 'comore' },
  { emoji: '🇨🇬', paese: 'repubblica del congo' },
  { emoji: '🇨🇩', paese: 'repubblica democratica del congo' },
  { emoji: '🇨🇷', paese: 'costa rica' },
  { emoji: '🇭🇷', paese: 'croazia' },
  { emoji: '🇨🇺', paese: 'cuba' },
  { emoji: '🇨🇾', paese: 'cipro' },
  { emoji: '🇨🇿', paese: 'repubblica ceca' },
  { emoji: '🇩🇰', paese: 'danimarca' },
  { emoji: '🇩🇯', paese: 'gibuti' },
  { emoji: '🇩🇲', paese: 'dominica' },
  { emoji: '🇩🇴', paese: 'repubblica dominicana' },
  { emoji: '🇪🇨', paese: 'ecuador' },
  { emoji: '🇪🇬', paese: 'egitto' },
  { emoji: '🇸🇻', paese: 'el salvador' },
  { emoji: '🇬🇶', paese: 'guinea equatoriale' },
  { emoji: '🇪🇷', paese: 'eritrea' },
  { emoji: '🇪🇪', paese: 'estonia' },
  { emoji: '🇸🇿', paese: 'eswatini' },
  { emoji: '🇪🇹', paese: 'etiopia' },
  { emoji: '🇫🇯', paese: 'fiji' },
  { emoji: '🇫🇮', paese: 'finlandia' },
  { emoji: '🇫🇷', paese: 'francia' },
  { emoji: '🇬🇦', paese: 'gabon' },
  { emoji: '🇬🇲', paese: 'gambia' },
  { emoji: '🇬🇪', paese: 'georgia' },
  { emoji: '🇩🇪', paese: 'germania' },
  { emoji: '🇬🇭', paese: 'ghana' },
  { emoji: '🇬🇷', paese: 'grecia' },
  { emoji: '🇬🇩', paese: 'grenada' },
  { emoji: '🇬🇹', paese: 'guatemala' },
  { emoji: '🇬🇳', paese: 'guinea' },
  { emoji: '🇬🇼', paese: 'guinea-bissau' },
  { emoji: '🇬🇾', paese: 'guyana' },
  { emoji: '🇭🇹', paese: 'haiti' },
  { emoji: '🇭🇳', paese: 'honduras' },
  { emoji: '🇭🇺', paese: 'ungheria' },
  { emoji: '🇮🇸', paese: 'islanda' },
  { emoji: '🇮🇳', paese: 'india' },
  { emoji: '🇮🇩', paese: 'indonesia' },
  { emoji: '🇮🇷', paese: 'iran' },
  { emoji: '🇮🇶', paese: 'iraq' },
  { emoji: '🇮🇪', paese: 'irlanda' },
  { emoji: '🇮🇱', paese: 'israele' },
  { emoji: '🇮🇹', paese: 'italia' },
  { emoji: '🇯🇲', paese: 'giamaica' },
  { emoji: '🇯🇵', paese: 'giappone' },
  { emoji: '🇯🇴', paese: 'giordania' },
  { emoji: '🇰🇿', paese: 'kazakistan' },
  { emoji: '🇰🇪', paese: 'kenya' },
  { emoji: '🇰🇮', paese: 'kiribati' },
  { emoji: '🇰🇼', paese: 'kuwait' },
  { emoji: '🇰🇬', paese: 'kirghizistan' },
  { emoji: '🇱🇦', paese: 'laos' },
  { emoji: '🇱🇻', paese: 'lettonia' },
  { emoji: '🇱🇧', paese: 'libano' },
  { emoji: '🇱🇸', paese: 'lesotho' },
  { emoji: '🇱🇷', paese: 'liberia' },
  { emoji: '🇱🇾', paese: 'libia' },
  { emoji: '🇱🇹', paese: 'lituania' },
  { emoji: '🇱🇺', paese: 'lussemburgo' },
  { emoji: '🇲🇰', paese: 'macedonia del nord' },
  { emoji: '🇲🇬', paese: 'madagascar' },
  { emoji: '🇲🇼', paese: 'malawi' },
  { emoji: '🇲🇾', paese: 'malesia' },
  { emoji: '🇲🇻', paese: 'maldive' },
  { emoji: '🇲🇱', paese: 'mali' },
  { emoji: '🇲🇹', paese: 'malta' },
  { emoji: '🇲🇭', paese: 'isole marshal' },
  { emoji: '🇲🇶', paese: 'martinica' },
  { emoji: '🇲🇷', paese: 'mauritania' },
  { emoji: '🇲🇺', paese: 'mauritius' },
  { emoji: '🇲🇽', paese: 'messico' },
  { emoji: '🇫🇲', paese: 'micronesia' },
  { emoji: '🇲🇩', paese: 'moldavia' },
  { emoji: '🇲🇨', paese: 'monaco' },
  { emoji: '🇲🇳', paese: 'mongolia' },
  { emoji: '🇲🇪', paese: 'montenegro' },
  { emoji: '🇲🇦', paese: 'marocco' },
  { emoji: '🇲🇿', paese: 'mozambico' },
  { emoji: '🇲🇲', paese: 'myanmar' },
  { emoji: '🇳🇦', paese: 'namibia' },
  { emoji: '🇳🇵', paese: 'nepal' },
  { emoji: '🇳🇱', paese: 'paesi bassi' },
  { emoji: '🇳🇿', paese: 'nuova zelanda' },
  { emoji: '🇳🇮', paese: 'nicaragua' },
  { emoji: '🇳🇪', paese: 'niger' },
  { emoji: '🇳🇬', paese: 'nigeria' },
  { emoji: '🇰🇵', paese: 'corea del nord' },
  { emoji: '🇲🇵', paese: 'isole mariana settentrionali' },
  { emoji: '🇳🇴', paese: 'norvegia' },
  { emoji: '🇴🇲', paese: 'oman' },
  { emoji: '🇵🇰', paese: 'pakistan' },
  { emoji: '🇵🇼', paese: 'palau' },
  { emoji: '🇵🇸', paese: 'palestina' },
  { emoji: '🇵🇦', paese: 'panama' },
  { emoji: '🇵🇬', paese: 'papua nuova guinea' },
  { emoji: '🇵🇾', paese: 'paraguay' },
  { emoji: '🇵🇪', paese: 'perù' },
  { emoji: '🇵🇭', paese: 'filippine' },
  { emoji: '🇵🇱', paese: 'polonia' },
  { emoji: '🇵🇹', paese: 'portogallo' },
  { emoji: '🇵🇷', paese: 'porto rico' },
  { emoji: '🇶🇦', paese: 'qatar' },
  { emoji: '🇷🇴', paese: 'romania' },
  { emoji: '🇷🇺', paese: 'russia' },
  { emoji: '🇷🇼', paese: 'ruanda' },
  { emoji: '🇼🇸', paese: 'samoa' },
  { emoji: '🇸🇲', paese: 'san marino' },
  { emoji: '🇸🇦', paese: 'arabia saudita' },
  { emoji: '🇸🇳', paese: 'senegal' },
  { emoji: '🇷🇸', paese: 'serbia' },
  { emoji: '🇸🇨', paese: 'seychelles' },
  { emoji: '🇸🇱', paese: 'sierra leone' },
  { emoji: '🇸🇬', paese: 'singapore' },
  { emoji: '🇸🇰', paese: 'slovacchia' },
  { emoji: '🇸🇮', paese: 'slovenia' },
  { emoji: '🇸🇧', paese: 'isole salomone' },
  { emoji: '🇸🇴', paese: 'somalia' },
  { emoji: '🇿🇦', paese: 'sudafrica' },
  { emoji: '🇰🇷', paese: 'corea del sud' },
  { emoji: '🇸🇸', paese: 'sudan del sud' },
  { emoji: '🇪🇸', paese: 'spagna' },
  { emoji: '🇱🇰', paese: 'sri lanka' },
  { emoji: '🇸🇩', paese: 'sudan' },
  { emoji: '🇸🇷', paese: 'suriname' },
  { emoji: '🇸🇪', paese: 'svezia' },
  { emoji: '🇨🇭', paese: 'svizzera' },
  { emoji: '🇸🇾', paese: 'siria' },
  { emoji: '🇹🇼', paese: 'taiwan' },
  { emoji: '🇹🇯', paese: 'tagikistan' },
  { emoji: '🇹🇿', paese: 'tanzania' },
  { emoji: '🇹🇭', paese: 'thailandia' },
  { emoji: '🇹🇱', paese: 'timor est' },
  { emoji: '🇹🇬', paese: 'togo' },
  { emoji: '🇹🇴', paese: 'tonga' },
  { emoji: '🇹🇹', paese: 'trinidad e tobago' },
  { emoji: '🇹🇳', paese: 'tunisia' },
  { emoji: '🇹🇷', paese: 'turchia' },
  { emoji: '🇹🇲', paese: 'turkmenistan' },
  { emoji: '🇺🇬', paese: 'uganda' },
  { emoji: '🇺🇦', paese: 'ucraina' },
  { emoji: '🇦🇪', paese: 'emirati arabi uniti' },
  { emoji: '🇬🇧', paese: 'regno unito' },
  { emoji: '🇺🇸', paese: 'stati uniti' },
  { emoji: '🇺🇾', paese: 'uruguay' },
  { emoji: '🇺🇿', paese: 'uzbekistan' },
  { emoji: '🇻🇺', paese: 'vanuatu' },
  { emoji: '🇻🇦', paese: 'città del vaticano' },
  { emoji: '🇻🇪', paese: 'venezuela' },
  { emoji: '🇻🇳', paese: 'vietnam' },
  { emoji: '🇾🇪', paese: 'yemen' },
  { emoji: '🇿🇲', paese: 'zambia' },
  { emoji: '🇿🇼', paese: 'zimbabwe' }
];

let handler = async (m, { conn }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
  if (!global.partiteBandiere) global.partiteBandiere = {};
  if (!global.cooldownBandiere) global.cooldownBandiere = {};

  const id = m.chat;

  if (global.partiteBandiere[id]?.attiva) {
    return conn.reply(m.chat, '⚠️ C\'è già una sfida attiva in questa chat!', m);
  }

  if (global.cooldownBandiere[id]) {
    const tempoRimasto = Math.ceil((global.cooldownBandiere[id] - Date.now()) / 1000);
    if (tempoRimasto > 0) return conn.reply(m.chat, `⏳ Attendi *${tempoRimasto} secondi* prima di iniziare una nuova sfida!`, m);
  }

  const scelta = bandiere[Math.floor(Math.random() * bandiere.length)];
  const primaLettera = scelta.paese[0].toUpperCase();

  const messaggio = await conn.reply(
    m.chat,
    `╭━━━━━━━━━━━━━━━━━━━╮\n┃🧠 Indovina il paese di questa ┃bandiera:\n┣━━━━━━━━━━━━━━━━━━━\n┃                        ${scelta.emoji}\n┣━━━━━━━━━━━━━━━━━━━\n┃💡 *Indizio iniziale:* la nazione ┃inizia con *${primaLettera}*\n╰━━━━━━━━━━━━━━━━━━━╯\n> Hai *30* secondi per rispondere a questo messaggio con il nome del paese.`,
    m
  );

  const timeoutId = setTimeout(() => {
    const partita = global.partiteBandiere[id];
    if (partita && partita.attiva) {
      const rispostaGiusta = partita.risposta.charAt(0).toUpperCase() + partita.risposta.slice(1);
      conn.reply(m.chat, `╭━━━━━━━━━━━━━━━━━━━╮\n┃⏰ *Tempo scaduto!* 😞\n┣━━━━━━━━━━━━━━━━━━━\n┃La risposta corretta era: *${rispostaGiusta}*\n╰━━━━━━━━━━━━━━━━━━━╯`, messaggio);
      delete global.partiteBandiere[id];

      global.cooldownBandiere[id] = Date.now() + 15000;
      setTimeout(() => delete global.cooldownBandiere[id], 15000);
    }
  }, 30000);

  global.partiteBandiere[id] = {
    risposta: scelta.paese.toLowerCase(),
    messaggioId: messaggio.key.id,
    user: m.sender,
    attiva: true,
    tentativi: 0,
    startTime: Date.now(),
    timeoutId
  };
};

handler.before = async function (m, { conn }) {
  const id = m.chat;
  const partita = global.partiteBandiere?.[id];
  if (!partita || !partita.attiva) return;

  const testo = m.text?.toLowerCase().trim();
  if (!testo) return;

  const isReply = m.quoted && m.quoted.id === partita.messaggioId;
  if (!isReply) return;

  const paesiValidi = bandiere.map(b => b.paese.toLowerCase());
  if (!paesiValidi.includes(testo)) return;

  partita.tentativi++;

  if (testo === partita.risposta) {
    const userId = m.sender;

    if (!global.db.data.users[userId]) global.db.data.users[userId] = {};
    if (!global.db.data.users[userId].vittorieBandiera) global.db.data.users[userId].vittorieBandiera = 0;
    global.db.data.users[userId].vittorieBandiera += 1;

    const reward = 100;
    global.db.data.users[userId].money = (global.db.data.users[userId].money || 0) + reward;

    const elapsed = Math.floor((Date.now() - partita.startTime) / 1000);
    const rispostaGiusta = partita.risposta.charAt(0).toUpperCase() + partita.risposta.slice(1);

    partita.attiva = false;
    clearTimeout(partita.timeoutId);

    await conn.sendMessage(m.chat, {
      text: `╭━━━━━━━━━━━━━━━━━━━╮\n┃✅ *@${userId.split('@')[0]} ha indovinato!*\n┣━━━━━━━━━━━━━━━━━━━\n┃📍 Nazione: *${rispostaGiusta}* ${bandiere.find(b => b.paese === partita.risposta).emoji}\n┣━━━━━━━━━━━━━━━━━━━\n┃⏱️ Tempo impiegato: *${elapsed} secondi*\n┣━━━━━━━━━━━━━━━━━━━\n┃💰 Guadagno: *${reward}* €\n╰━━━━━━━━━━━━━━━━━━━╯`,
      mentions: [userId]
    });

    global.cooldownBandiere[id] = Date.now() + 10000;
    setTimeout(() => delete global.cooldownBandiere[id], 10000);
    delete global.partiteBandiere[id];
  } else {
    if (partita.tentativi === 2) {
      const risposta = partita.risposta;
      const primeDueLettere = risposta.slice(0, 2).toUpperCase();
      const numeroLettere = risposta.length;

      await conn.reply(m.chat, `💡 *Indizio:*\nComposta da *${numeroLettere} lettere* e inizia con *${primeDueLettere}...*`, m);
    }
    await conn.reply(m.chat, `❌ *Risposta errata, riprova!*`, m);
  }

  return true;
};

handler.command = /^bandiera$/i;
export default handler;