const activeGames = new Map()

/* =======================
   DATABASE ANIME (MEGA)
======================= */
const animeCharacters = [
  { name:"Goku", anime:true, real:false, series:true, movie:false, male:true, alive:false, powers:true, villain:false, protagonist:true },
  { name:"Vegeta", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:false },
  { name:"Naruto Uzumaki", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:true },
  { name:"Sasuke Uchiha", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:false },
  { name:"Luffy", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:true },
  { name:"Zoro Roronoa", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:false },
  { name:"Eren Yeager", anime:true, real:false, series:true, movie:false, male:true, alive:false, powers:true, villain:true, protagonist:true },
  { name:"Levi Ackerman", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:false },
  { name:"Light Yagami", anime:true, real:false, series:true, movie:false, male:true, alive:false, powers:true, villain:true, protagonist:true },
  { name:"L", anime:true, real:false, series:true, movie:false, male:true, alive:false, powers:false, villain:false, protagonist:false },
  { name:"Ichigo Kurosaki", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:true },
  { name:"Tanjiro Kamado", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:true },
  { name:"Nezuko Kamado", anime:true, real:false, series:true, movie:false, male:false, alive:true, powers:true, villain:false, protagonist:false },
  { name:"Gojo Satoru", anime:true, real:false, series:true, movie:false, male:true, alive:false, powers:true, villain:false, protagonist:false },
  { name:"Yuji Itadori", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:true },
  { name:"Gon Freecss", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:true },
  { name:"Killua Zoldyck", anime:true, real:false, series:true, movie:false, male:true, alive:true, powers:true, villain:false, protagonist:false }
]

/* =======================
   DATABASE GENERALE
======================= */
const generalCharacters = [
  { name:"Batman", anime:false, real:false, series:true, movie:true, male:true, alive:true, powers:false },
  { name:"Spider-Man", anime:false, real:false, series:true, movie:true, male:true, alive:true, powers:true },
  { name:"Iron Man", anime:false, real:false, series:false, movie:true, male:true, alive:false, powers:true },
  { name:"Walter White", anime:false, real:false, series:true, movie:false, male:true, alive:false, powers:false },

  { name:"Leonardo DiCaprio", anime:false, real:true, series:false, movie:true, male:true, alive:true, powers:false },
  { name:"Johnny Depp", anime:false, real:true, series:false, movie:true, male:true, alive:true, powers:false },

  { name:"Cristiano Ronaldo", anime:false, real:true, series:false, movie:false, male:true, alive:true, powers:false },
  { name:"Lionel Messi", anime:false, real:true, series:false, movie:false, male:true, alive:true, powers:false },
  { name:"Michael Jordan", anime:false, real:true, series:false, movie:false, male:true, alive:true, powers:false },

  { name:"Elon Musk", anime:false, real:true, series:false, movie:false, male:true, alive:true, powers:false },
  { name:"Albert Einstein", anime:false, real:true, series:false, movie:false, male:true, alive:false, powers:false }
]

/* =======================
   DOMANDE
======================= */
const questions = [
  { key:"anime", text:"È un personaggio anime?" },
  { key:"real", text:"È una persona reale?" },
  { key:"series", text:"Appare in una serie?" },
  { key:"movie", text:"È famoso per film?" },
  { key:"protagonist", text:"È il protagonista?" },
  { key:"villain", text:"È un antagonista?" },
  { key:"powers", text:"Ha poteri o abilità speciali?" },
  { key:"male", text:"È maschio?" },
  { key:"alive", text:"È vivo?" }
]

/* =======================
   HANDLER
======================= */
let handler = async (m, { conn }) => {
  let chatConfig = global.db.data.chats[m.chat] || {}
  if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎')
  }

  if (activeGames.has(m.chat)) {
    return m.reply('『 ⚠️ 』- C\'è già una partita in corso!')
  }

  await conn.sendMessage(m.chat, {
    text: "🧠 *AKINATOR*\nScegli la modalità:",
    buttons: [
      { buttonId: '.akinator anime', buttonText: { displayText: '🎌 Anime' }, type: 1 },
      { buttonId: '.akinator generale', buttonText: { displayText: '🌍 Generale' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.before = async (m, { conn }) => {
  const game = activeGames.get(m.chat)
  if (!game) return

  // SOLO CHI HA AVVIATO
  if (m.sender !== game.player) return

  const text = (m.text || '').toLowerCase()

  if (text === 'ok' && !game.current) {
    return askQuestion(m, conn, game)
  }

  if (!['si','no','non so','nonso'].includes(text)) return
  if (!game.current) return

  if (!text.startsWith('non')) {
    const value = text === 'si'
    game.candidates = game.candidates.filter(c => c[game.current.key] === value)
  }

  if (game.candidates.length <= 1) {
    finishGame(m, conn, game)
  } else {
    askQuestion(m, conn, game)
  }
}

/* =======================
   COMANDI
======================= */
handler.command = ['akinator']

handler.tags = ['giochi']
handler.help = ['akinator']
handler.register = false

export default handler

/* =======================
   FUNZIONI
======================= */
function askQuestion(m, conn, game) {
  const q = questions.find(q => !game.asked.includes(q.key) && game.candidates.some(c => q.key in c))
  if (!q) return finishGame(m, conn, game)

  game.current = q
  game.asked.push(q.key)

  conn.sendMessage(m.chat, {
    text: `❓ *${q.text}*\n\nRispondi: si / no / non so`
  }, { quoted: m })
}

function finishGame(m, conn, game) {
  activeGames.delete(m.chat)

  if (!game.candidates.length) {
    return conn.sendMessage(m.chat, {
      text: "😵 Non riesco a indovinare…"
    }, { quoted: m })
  }

  conn.sendMessage(m.chat, {
    text: `🧠 Sto pensando a *${game.candidates[0].name}*… giusto? 😏`,
    buttons: [
      { buttonId: '.akinator', buttonText: { displayText: '🔁 Rigioca' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

/* =======================
   AVVIO MODALITÀ
======================= */
handler.all = async (m, { conn, args }) => {
  if (!m.text) return
  if (!m.text.startsWith('.akinator')) return

  if (activeGames.has(m.chat)) return

  if (m.text.includes('anime')) {
    startGame(m, conn, animeCharacters)
  } else if (m.text.includes('generale')) {
    startGame(m, conn, generalCharacters)
  }
}

function startGame(m, conn, list) {
  activeGames.set(m.chat, {
    player: m.sender,
    candidates: [...list],
    asked: [],
    current: null
  })

  conn.sendMessage(m.chat, {
    text:
`╭〔 *🧠 AKINATOR* 〕╮
┃ Modalità: *${list === animeCharacters ? 'ANIME 🎌' : 'GENERALE 🌍'}*
┃
┃ Solo chi ha avviato può rispondere
┃ Scrivi *ok* quando sei pronto
╰━━━━━━━━━━━━━━╯`
  }, { quoted: m })
}