// Plugin fatto da Axtral_WiZaRd
const prefissi = [
  { prefisso: '+93', paese: 'afghanistan', bandiera: '🇦🇫' },
  { prefisso: '+358', paese: 'isole åland', bandiera: '🇦🇽' },
  { prefisso: '+355', paese: 'albania', bandiera: '🇦🇱' },
  { prefisso: '+213', paese: 'algeria', bandiera: '🇩🇿' },
  { prefisso: '+1-684', paese: 'samoa americane', bandiera: '🇦🇸' },
  { prefisso: '+376', paese: 'andorra', bandiera: '🇦🇩' },
  { prefisso: '+244', paese: 'angola', bandiera: '🇦🇴' },
  { prefisso: '+1-264', paese: 'anguilla', bandiera: '🇦🇮' },
  { prefisso: '+1-268', paese: 'antigua e barbuda', bandiera: '🇦🇬' },
  { prefisso: '+54', paese: 'argentina', bandiera: '🇦🇷' },
  { prefisso: '+374', paese: 'armenia', bandiera: '🇦🇲' },
  { prefisso: '+297', paese: 'aruba', bandiera: '🇦🇼' },
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
  { prefisso: '+1-284', paese: 'isole vergini britanniche', bandiera: '🇻🇬' },
  { prefisso: '+673', paese: 'brunei', bandiera: '🇧🇳' },
  { prefisso: '+359', paese: 'bulgaria', bandiera: '🇧🇬' },
  { prefisso: '+226', paese: 'burkina faso', bandiera: '🇧🇫' },
  { prefisso: '+257', paese: 'burundi', bandiera: '🇧🇮' },
  { prefisso: '+855', paese: 'cambogia', bandiera: '🇰🇭' },
  { prefisso: '+237', paese: 'camerun', bandiera: '🇨🇲' },
  { prefisso: '+1', paese: 'canada', bandiera: '🇨🇦' },
  { prefisso: '+238', paese: 'capo verde', bandiera: '🇨🇻' },
  { prefisso: '+1-345', paese: 'isole cayman', bandiera: '🇰🇾' },
  { prefisso: '+236', paese: 'repubblica centrafricana', bandiera: '🇨🇫' },
  { prefisso: '+235', paese: 'ciad', bandiera: '🇹🇩' },
  { prefisso: '+56', paese: 'cilena', bandiera: '🇨🇱' },
  { prefisso: '+86', paese: 'cina', bandiera: '🇨🇳' },
  { prefisso: '+57', paese: 'colombia', bandiera: '🇨🇴' },
  { prefisso: '+269', paese: 'comore', bandiera: '🇰🇲' },
  { prefisso: '+242', paese: 'congo', bandiera: '🇨🇬' },
  { prefisso: '+243', paese: 'repubblica democratica del congo', bandiera: '🇨🇩' },
  { prefisso: '+506', paese: 'costa rica', bandiera: '🇨🇷' },
  { prefisso: '+385', paese: 'croazia', bandiera: '🇭🇷' },
  { prefisso: '+53', paese: 'cuba', bandiera: '🇨🇺' },
  { prefisso: '+599', paese: 'curaçao', bandiera: '🇨🇼' },
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
  { prefisso: '+251', paese: 'etiopia', bandiera: '🇪🇹' },
  { prefisso: '+298', paese: 'isole faroe', bandiera: '🇫🇴' },
  { prefisso: '+679', paese: 'fiji', bandiera: '🇫🇯' },
  { prefisso: '+358', paese: 'finlandia', bandiera: '🇫🇮' },
  { prefisso: '+33', paese: 'francia', bandiera: '🇫🇷' },
  { prefisso: '+241', paese: 'gabon', bandiera: '🇬🇦' },
  { prefisso: '+220', paese: 'gambia', bandiera: '🇬🇲' },
  { prefisso: '+995', paese: 'georgia', bandiera: '🇬🇪' },
  { prefisso: '+49', paese: 'germania', bandiera: '🇩🇪' },
  { prefisso: '+233', paese: 'ghana', bandiera: '🇬🇭' },
  { prefisso: '+350', paese: 'gibilterra', bandiera: '🇬🇮' },
  { prefisso: '+30', paese: 'grecia', bandiera: '🇬🇷' },
  { prefisso: '+299', paese: 'groenlandia', bandiera: '🇬🇱' },
  { prefisso: '+1-473', paese: 'grenada', bandiera: '🇬🇩' },
  { prefisso: '+590', paese: 'guadalupa', bandiera: '🇬🇵' },
  { prefisso: '+1-671', paese: 'guam', bandiera: '🇬🇺' },
  { prefisso: '+502', paese: 'guatemala', bandiera: '🇬🇹' },
  { prefisso: '+44-1481', paese: 'guernsey', bandiera: '🇬🇬' },
  { prefisso: '+592', paese: 'guyana', bandiera: '🇬🇾' },
  { prefisso: '+509', paese: 'haiti', bandiera: '🇭🇹' },
  { prefisso: '+504', paese: 'honduras', bandiera: '🇭🇳' },
  { prefisso: '+36', paese: 'ungheria', bandiera: '🇭🇺' },
  { prefisso: '+354', paese: 'islanda', bandiera: '🇮🇸' },
  { prefisso: '+91', paese: 'india', bandiera: '🇮🇳' },
  { prefisso: '+62', paese: 'indonesia', bandiera: '🇮🇩' },
  { prefisso: '+98', paese: 'iran', bandiera: '🇮🇷' },
  { prefisso: '+964', paese: 'iraq', bandiera: '🇮🇶' },
  { prefisso: '+353', paese: 'irlanda', bandiera: '🇮🇪' },
  { prefisso: '+44-1624', paese: 'isola di man', bandiera: '🇮🇲' },
  { prefisso: '+972', paese: 'israele', bandiera: '🇮🇱' },
  { prefisso: '+39', paese: 'italia', bandiera: '🇮🇹' },
  { prefisso: '+1876', paese: 'jamaica', bandiera: '🇯🇲' },
  { prefisso: '+81', paese: 'giappone', bandiera: '🇯🇵' },
  { prefisso: '+44-1534', paese: 'jersey', bandiera: '🇯🇪' },
  { prefisso: '+962', paese: 'giordania', bandiera: '🇯🇴' },
  { prefisso: '+7', paese: 'kazakistan', bandiera: '🇰🇿' },
  { prefisso: '+254', paese: 'kenya', bandiera: '🇰🇪' },
  { prefisso: '+686', paese: 'kiribati', bandiera: '🇰🇮' },
  { prefisso: '+965', paese: 'kuwait', bandiera: '🇰🇼' },
  { prefisso: '+996', paese: 'kirghizistan', bandiera: '🇰🇬' },
  { prefisso: '+856', paese: 'laos', bandiera: '🇱🇦' },
  { prefisso: '+371', paese: 'lettonia', bandiera: '🇱🇻' },
  { prefisso: '+423', paese: 'liechtenstein', bandiera: '🇱🇮' },
  { prefisso: '+370', paese: 'lituania', bandiera: '🇱🇹' },
  { prefisso: '+352', paese: 'lussemburgo', bandiera: '🇱🇺' },
  { prefisso: '+261', paese: 'madagascar', bandiera: '🇲🇬' },
  { prefisso: '+265', paese: 'malawi', bandiera: '🇲🇼' },
  { prefisso: '+60', paese: 'malesia', bandiera: '🇲🇾' },
  { prefisso: '+960', paese: 'maldive', bandiera: '🇲🇻' },
  { prefisso: '+223', paese: 'mali', bandiera: '🇲🇱' },
  { prefisso: '+356', paese: 'malta', bandiera: '🇲🇹' },
  { prefisso: '+692', paese: 'isole marshall', bandiera: '🇲🇭' },
  { prefisso: '+596', paese: 'martinica', bandiera: '🇲🇶' },
  { prefisso: '+222', paese: 'mauritania', bandiera: '🇲🇷' },
  { prefisso: '+230', paese: 'mauritius', bandiera: '🇲🇺' },
  { prefisso: '+52', paese: 'messico', bandiera: '🇲🇽' },
  { prefisso: '+691', paese: 'micronesia', bandiera: '🇫🇲' },
  { prefisso: '+373', paese: 'moldavia', bandiera: '🇲🇩' },
  { prefisso: '+377', paese: 'monaco', bandiera: '🇲🇨' },
  { prefisso: '+976', paese: 'mongolia', bandiera: '🇲🇳' },
  { prefisso: '+382', paese: 'montenegro', bandiera: '🇲🇪' },
  { prefisso: '+1-664', paese: 'montserrat', bandiera: '🇲🇸' },
  { prefisso: '+212', paese: 'marocco', bandiera: '🇲🇦' },
  { prefisso: '+258', paese: 'mozambico', bandiera: '🇲🇿' },
  { prefisso: '+95', paese: 'myanmar', bandiera: '🇲🇲' },
  { prefisso: '+264', paese: 'namibia', bandiera: '🇳🇦' },
  { prefisso: '+674', paese: 'nauru', bandiera: '🇳🇷' },
  { prefisso: '+977', paese: 'nepal', bandiera: '🇳🇵' },
  { prefisso: '+31', paese: 'paesi bassi', bandiera: '🇳🇱' },
  { prefisso: '+599', paese: 'antille olandesi', bandiera: '🇳🇱' },
  { prefisso: '+687', paese: 'nuova caledonia', bandiera: '🇳🇨' },
  { prefisso: '+64', paese: 'nuova zelanda', bandiera: '🇳🇿' },
  { prefisso: '+505', paese: 'nicaragua', bandiera: '🇳🇮' },
  { prefisso: '+227', paese: 'niger', bandiera: '🇳🇪' },
  { prefisso: '+234', paese: 'nigeria', bandiera: '🇳🇬' },
  { prefisso: '+47', paese: 'norvegia', bandiera: '🇳🇴' },
  { prefisso: '+968', paese: 'oman', bandiera: '🇴🇲' },
  { prefisso: '+92', paese: 'pakistan', bandiera: '🇵🇰' },
  { prefisso: '+680', paese: 'palau', bandiera: '🇵🇼' },
  { prefisso: '+970', paese: 'palestina', bandiera: '🇵🇸' },
  { prefisso: '+507', paese: 'panama', bandiera: '🇵🇦' },
  { prefisso: '+675', paese: 'papua nuova guinea', bandiera: '🇵🇬' },
  { prefisso: '+595', paese: 'paraguay', bandiera: '🇵🇾' },
  { prefisso: '+51', paese: 'perù', bandiera: '🇵🇪' },
  { prefisso: '+63', paese: 'filippine', bandiera: '🇵🇭' },
  { prefisso: '+48', paese: 'polonia', bandiera: '🇵🇱' },
  { prefisso: '+351', paese: 'portogallo', bandiera: '🇵🇹' },
  { prefisso: '+1-787', paese: 'porto rico', bandiera: '🇵🇷' },
  { prefisso: '+974', paese: 'qatar', bandiera: '🇶🇦' },
  { prefisso: '+262', paese: 'réunion', bandiera: '🇷🇪' },
  { prefisso: '+40', paese: 'romania', bandiera: '🇷🇴' },
  { prefisso: '+7', paese: 'russia', bandiera: '🇷🇺' },
  { prefisso: '+250', paese: 'ruanda', bandiera: '🇷🇼' },
  { prefisso: '+685', paese: 'samoa', bandiera: '🇼🇸' },
  { prefisso: '+378', paese: 'san marino', bandiera: '🇸🇲' },
  { prefisso: '+239', paese: 'sao tome e principe', bandiera: '🇸🇹' },
  { prefisso: '+966', paese: 'arabia saudita', bandiera: '🇸🇦' },
  { prefisso: '+221', paese: 'senegal', bandiera: '🇸🇳' },
  { prefisso: '+381', paese: 'serbia', bandiera: '🇷🇸' },
  { prefisso: '+248', paese: 'seychelles', bandiera: '🇸🇨' },
  { prefisso: '+232', paese: 'sierra leone', bandiera: '🇸🇱' },
  { prefisso: '+65', paese: 'singapore', bandiera: '🇸🇬' },
  { prefisso: '+421', paese: 'slovacchia', bandiera: '🇸🇰' },
  { prefisso: '+386', paese: 'slovenia', bandiera: '🇸🇮' },
  { prefisso: '+677', paese: 'isole salomone', bandiera: '🇸🇧' },
  { prefisso: '+252', paese: 'somalia', bandiera: '🇸🇴' },
  { prefisso: '+27', paese: 'sudafrica', bandiera: '🇿🇦' },
  { prefisso: '+211', paese: 'sud sudan', bandiera: '🇸🇸' },
  { prefisso: '+34', paese: 'spagna', bandiera: '🇪🇸' },
  { prefisso: '+94', paese: 'sri lanka', bandiera: '🇱🇰' },
  { prefisso: '+597', paese: 'suriname', bandiera: '🇸🇷' },
  { prefisso: '+268', paese: 'swaziland', bandiera: '🇸🇿' },
  { prefisso: '+46', paese: 'svezia', bandiera: '🇸🇪' },
  { prefisso: '+41', paese: 'svizzera', bandiera: '🇨🇭' },
  { prefisso: '+886', paese: 'taiwan', bandiera: '🇹🇼' },
  { prefisso: '+992', paese: 'tagikistan', bandiera: '🇹🇯' },
  { prefisso: '+255', paese: 'tanzania', bandiera: '🇹🇿' },
  { prefisso: '+66', paese: 'thailandia', bandiera: '🇹🇭' },
  { prefisso: '+670', paese: 'timor est', bandiera: '🇹🇱' },
  { prefisso: '+228', paese: 'togo', bandiera: '🇹🇬' },
  { prefisso: '+690', paese: 'tokelau', bandiera: '🇹🇰' },
  { prefisso: '+676', paese: 'tonga', bandiera: '🇹🇴' },
  { prefisso: '+1‑868', paese: 'trinidad e tobago', bandiera: '🇹🇹' },
  { prefisso: '+216', paese: 'tunisia', bandiera: '🇹🇳' },
  { prefisso: '+90', paese: 'turchia', bandiera: '🇹🇷' },
  { prefisso: '+993', paese: 'turkmenistan', bandiera: '🇹🇲' },
  { prefisso: '+1‑649', paese: 'isole turks e caicos', bandiera: '🇹🇨' },
  { prefisso: '+688', paese: 'tuvalu', bandiera: '🇹🇻' },
  { prefisso: '+256', paese: 'uganda', bandiera: '🇺🇬' },
  { prefisso: '+380', paese: 'ucraina', bandiera: '🇺🇦' },
  { prefisso: '+44', paese: 'regno unito', bandiera: '🇬🇧' },
  { prefisso: '+1', paese: 'stati uniti', bandiera: '🇺🇸' },
  { prefisso: '+598', paese: 'uruguay', bandiera: '🇺🇾' },
  { prefisso: '+998', paese: 'uzbekistan', bandiera: '🇺🇿' },
  { prefisso: '+678', paese: 'vanuatu', bandiera: '🇻🇺' },
  { prefisso: '+58', paese: 'venezuela', bandiera: '🇻🇪' },
  { prefisso: '+84', paese: 'vietnam', bandiera: '🇻🇳' },
  { prefisso: '+1‑787', paese: 'isole vergini (us)', bandiera: '🇻🇮' },
  { prefisso: '+685', paese: 'wallis e futuna', bandiera: '🇼🇫' },
  { prefisso: '+967', paese: 'yemen', bandiera: '🇾🇪' },
  { prefisso: '+260', paese: 'zambia', bandiera: '🇿🇲' },
  { prefisso: '+263', paese: 'zimbabwe', bandiera: '🇿🇼' }
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