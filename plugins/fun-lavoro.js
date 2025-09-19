// Lista lavori con range di guadagno personalizzato
global.work = [
  { description: '🔮 Sei un maestro alchimista, distilli pozioni misteriose alla ricerca di segreti perduti.', minReward: 800, maxReward: 1500 },
  { description: '🎥 Reciti in un film di successo e diventi una star del cinema!', minReward: 1400, maxReward: 2500 },
  { description: '🏆 Partecipi a una gara di cucina e vinci con la tua ricetta segreta!', minReward: 600, maxReward: 1300 },
  { description: '💰 Scopri un antico tesoro nascosto nelle profondità di una caverna misteriosa.', minReward: 1500, maxReward: 2500 },
  { description: '🚀 Esplori lo spazio e fai una scoperta rivoluzionaria per l’umanità!', minReward: 1800, maxReward: 3000 },
  { description: '🐉 Addestri un drago raro e lo vendi a un collezionista per una fortuna.', minReward: 2000, maxReward: 3500 },
  { description: '🎩 Diventi un illusionista famoso, lasciando tutti a bocca aperta con i tuoi trucchi.', minReward: 700, maxReward: 1400 },
  { description: '🕵️‍♂️ Risolvi un caso misterioso come il miglior detective della città!', minReward: 1100, maxReward: 2200 },
  { description: '⚒️ Forgi una spada leggendaria che verrà ricordata nei secoli.', minReward: 1600, maxReward: 2800 },
  { description: '📚 Scrivi un libro che diventa un best seller in tutto il mondo.', minReward: 900, maxReward: 1800 },
  { description: '🎼 Componi una canzone che diventa la hit dell’anno!', minReward: 800, maxReward: 1700 },
  { description: '👨‍🚀 Vieni scelto per una missione spaziale storica e diventi un eroe.', minReward: 2000, maxReward: 3200 },
  { description: '🎮 Vinci un torneo di e-sports e diventi un campione internazionale!', minReward: 1300, maxReward: 2300 },
  { description: '🏹 Cacci un raro animale mitologico e ottieni una ricompensa straordinaria.', minReward: 1700, maxReward: 2900 },
  { description: '🧪 Crei una nuova invenzione che rivoluziona il mondo della scienza.', minReward: 1400, maxReward: 2600 },
  { description: '💼 Avvii una startup innovativa e diventi un imprenditore di successo!', minReward: 1500, maxReward: 2700 },
  { description: '⚔️ Guidi un esercito in battaglia e vieni celebrato come un grande stratega.', minReward: 1800, maxReward: 3100 },
  { description: '🌊 Scopri una città sommersa e sveli antichi segreti della civiltà perduta.', minReward: 1600, maxReward: 2800 },
  { description: '🔫 Lavori come spia internazionale e smascheri un complotto segreto.', minReward: 1900, maxReward: 3300 },
  { description: '🏗️ Costruisci un grattacielo futuristico che diventa un simbolo della città.', minReward: 1500, maxReward: 2700 },
  { description: '🛠️ Ripari una macchina del tempo e viaggi nel passato per riscrivere la storia!', minReward: 2000, maxReward: 3500 },
  { description: '🦸‍♂️ Diventi un supereroe e salvi la città da una minaccia pericolosa!', minReward: 1700, maxReward: 3000 },
  { description: '🎭 Reciti in un’opera teatrale e ricevi una standing ovation!', minReward: 700, maxReward: 1300 },
  { description: '🛳️ Parti per un’avventura in mare aperto e scopri un’isola sconosciuta.', minReward: 900, maxReward: 1600 },
  { description: '🏰 Diventi consigliere reale e prendi decisioni cruciali per il regno.', minReward: 1400, maxReward: 2600 },
  { description: '🐾 Addomestichi un animale leggendario che diventa il tuo compagno di viaggio.', minReward: 1300, maxReward: 2400 },
  { description: '🌍 Esplori terre inesplorate e trovi un’antica civiltà perduta.', minReward: 1800, maxReward: 3100 },
  { description: '🔍 Scopri una cospirazione mondiale e vieni acclamato come eroe della verità.', minReward: 2000, maxReward: 3500 },
];

// Funzione per generare un numero casuale tra min e max (inclusi)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const handler = async (m, { conn, isPrems }) => {
  const user = global.db.data.users[m.sender];
  const timeRemaining = user.lastwork + 7200000 - Date.now();

  if (timeRemaining > 0) {
    throw `⚔️ *𝐀𝐬𝐩𝐞𝐭𝐭𝐀 𝐮𝐧 𝐦𝐨𝐦𝐞𝐧𝐭𝐨, 𝐥𝐚𝐯𝐨𝐫𝐚𝐭𝐨𝐫𝐞!*\n\n` +
          `*—◉ 𝐏𝐨𝐭𝐫𝐚𝐢 𝐫𝐢𝐩𝐫𝐞𝐧𝐝𝐞𝐫𝐞 𝐚 𝐥𝐚𝐯𝐨𝐫𝐚𝐫𝐞 𝐭𝐫𝐚:* ${msToTime(timeRemaining)} ⏳`;
  }

  // Scegli il lavoro casualmente (oggetto)
  const job = pickRandom(global.work);

  // Genera guadagno random tra minReward e maxReward
  const money = randomInt(job.minReward, job.maxReward);

  conn.sendMessage(m.chat, {
    text: `≿━━━━━━━༺❀༻━━━━━━━≾
*🏞️ 𝐋𝐀𝐕𝐎𝐑𝐎* 🛠️

📜 *Mestiere:* ${job.description}
💰 *Guadagno:* ${money} €

🎉 *𝐁𝐞𝐥 𝐥𝐚𝐯𝐨𝐫𝐨! 𝐈𝐥 𝐭𝐮𝐨 𝐜𝐨𝐧𝐭𝐨 è 𝐬𝐭𝐚𝐭𝐨 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐨.*

≿━━━━━━━༺❀༻━━━━━━━≾`,
  }, { quoted: m });

  user.bank += money;
  user.lastwork = Date.now();
  global.db.write();
};

handler.help = ['work'];
handler.tags = ['money'];
handler.command = /^(lavoro)$/i;
handler.fail = null;

export default handler;

function pickRandom(list) {
  if (!list || list.length === 0) throw new Error("La lista dei mestieri è vuota o non definita.");
  return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
  let hours = Math.floor(duration / (1000 * 60 * 60));
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let seconds = Math.floor((duration / 1000) % 60);
  return `${hours}h ${minutes}min ${seconds}sec`;
}