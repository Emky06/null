// Lista lavori con range di guadagno personalizzato
global.work = [
  { description: '🔮 Sei un maestro alchimista, distilli pozioni misteriose alla ricerca di segreti perduti.', minReward: 50, maxReward: 150 },
  { description: '🎥 Reciti in un film di successo e diventi una star del cinema!', minReward: 150, maxReward: 250 },
  { description: '🏆 Partecipi a una gara di cucina e vinci con la tua ricetta segreta!', minReward: 250, maxReward: 350 },
  { description: '💰 Scopri un antico tesoro nascosto nelle profondità di una caverna misteriosa.', minReward: 350, maxReward: 450 },
  { description: '🚀 Esplori lo spazio e fai una scoperta rivoluzionaria per l’umanità!', minReward: 450, maxReward: 550 },
  { description: '🐉 Addestri un drago raro e lo vendi a un collezionista per una fortuna.', minReward: 550, maxReward: 650 },
  { description: '🎩 Diventi un illusionista famoso, lasciando tutti a bocca aperta con i tuoi trucchi.', minReward: 100, maxReward: 200 },
  { description: '🕵️‍♂️ Risolvi un caso misterioso come il miglior detective della città!', minReward: 200, maxReward: 350 },
  { description: '⚒️ Forgi una spada leggendaria che verrà ricordata nei secoli.', minReward: 350, maxReward: 450 },
  { description: '📚 Scrivi un libro che diventa un best seller in tutto il mondo.', minReward: 200, maxReward: 350 },
  { description: '🎼 Componi una canzone che diventa la hit dell’anno!', minReward: 400, maxReward: 500 },
  { description: '👨‍🚀 Vieni scelto per una missione spaziale storica e diventi un eroe.', minReward: 500, maxReward: 700 },
  { description: '🎮 Vinci un torneo di e-sports e diventi un campione internazionale!', minReward: 350, maxReward: 500 },
  { description: '🏹 Cacci un raro animale mitologico e ottieni una ricompensa straordinaria.', minReward: 350, maxReward: 500 },
  { description: '🧪 Crei una nuova invenzione che rivoluziona il mondo della scienza.', minReward: 450, maxReward: 650 },
  { description: '💼 Avvii una startup innovativa e diventi un imprenditore di successo!', minReward: 500, maxReward: 700 },
  { description: '⚔️ Guidi un esercito in battaglia e vieni celebrato come un grande stratega.', minReward: 500, maxReward: 700 },
  { description: '🌊 Scopri una città sommersa e sveli antichi segreti della civiltà perduta.', minReward: 400, maxReward: 600 },
  { description: '🔫 Lavori come spia internazionale e smascheri un complotto segreto.', minReward: 600, maxReward: 1000 },
  { description: '🏗️ Costruisci un grattacielo futuristico che diventa un simbolo della città.', minReward: 500, maxReward: 700 },
  { description: '🛠️ Ripari una macchina del tempo e viaggi nel passato per riscrivere la storia!', minReward: 50p, maxReward: 800 },
  { description: '🦸‍♂️ Diventi un supereroe e salvi la città da una minaccia pericolosa!', minReward: 400, maxReward: 700 },
  { description: '🎭 Reciti in un’opera teatrale e ricevi una standing ovation!', minReward: 300, maxReward: 500 },
  { description: '🛳️ Parti per un’avventura in mare aperto e scopri un’isola sconosciuta.', minReward: 400, maxReward: 700 },
  { description: '🏰 Diventi consigliere reale e prendi decisioni cruciali per il regno.', minReward: 500, maxReward: 800 },
  { description: '🐾 Addomestichi un animale leggendario che diventa il tuo compagno di viaggio.', minReward: 300, maxReward: 500 },
  { description: '🌍 Esplori terre inesplorate e trovi un’antica civiltà perduta.', minReward: 500, maxReward: 800 },
  { description: '🔍 Scopri una cospirazione mondiale e vieni acclamato come eroe della verità.', minReward: 700, maxReward: 1000 },
];

// Funzione per generare un numero casuale tra min e max (inclusi)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const handler = async (m, { conn, isPrems }) => {
  const user = global.db.data.users[m.sender];
  const cooldown = 10 * 60 * 60 * 1000; // 10 ore
const timeRemaining = user.lastwork + cooldown - Date.now();

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