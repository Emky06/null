const activeGames = new Map()

const characters = [
  // ANIME
  { name: "Goku", real: false, anime: true, movie: false, series: false, alive: false, male: true, powers: true, sport: false, singer: false },
  { name: "Naruto Uzumaki", real: false, anime: true, movie: false, series: false, alive: true, male: true, powers: true, sport: false, singer: false },
  { name: "Luffy", real: false, anime: true, movie: false, series: false, alive: true, male: true, powers: true, sport: false, singer: false },
  { name: "Ichigo Kurosaki", real: false, anime: true, movie: false, series: false, alive: true, male: true, powers: true, sport: false, singer: false },
  { name: "Eren Yeager", real: false, anime: true, movie: false, series: false, alive: false, male: true, powers: true, sport: false, singer: false },
  { name: "Light Yagami", real: false, anime: true, movie: false, series: false, alive: false, male: true, powers: true, sport: false, singer: false },

  // FILM / SERIE
  { name: "Batman", real: false, anime: false, movie: true, series: true, alive: true, male: true, powers: false, sport: false, singer: false },
  { name: "Spider-Man", real: false, anime: false, movie: true, series: true, alive: true, male: true, powers: true, sport: false, singer: false },
  { name: "Iron Man", real: false, anime: false, movie: true, series: false, alive: false, male: true, powers: true, sport: false, singer: false },
  { name: "Joker", real: false, anime: false, movie: true, series: true, alive: true, male: true, powers: false, sport: false, singer: false },
  { name: "Walter White", real: false, anime: false, movie: false, series: true, alive: false, male: true, powers: false, sport: false, singer: false },
  { name: "Darth Vader", real: false, anime: false, movie: true, series: true, alive: false, male: true, powers: true, sport: false, singer: false },

  // ATTORI
  { name: "Leonardo DiCaprio", real: true, anime: false, movie: true, series: false, alive: true, male: true, powers: false, sport: false, singer: false },
  { name: "Johnny Depp", real: true, anime: false, movie: true, series: false, alive: true, male: true, powers: false, sport: false, singer: false },
  { name: "Robert Downey Jr", real: true, anime: false, movie: true, series: false, alive: true, male: true, powers: false, sport: false, singer: false },
  { name: "Tom Holland", real: true, anime: false, movie: true, series: false, alive: true, male: true, powers: false, sport: false, singer: false },

  // CALCIATORI 
  { name: "Cristiano Ronaldo", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: true, singer: false },
  { name: "Lionel Messi", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: true, singer: false },
  { name: "Neymar Jr", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: true, singer: false },
  { name: "Zlatan Ibrahimović", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: true, singer: false },

  // ALTRI SPORT 
  { name: "Michael Jordan", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: true, singer: false },
  { name: "Kobe Bryant", real: true, anime: false, movie: false, series: false, alive: false, male: true, powers: false, sport: true, singer: false },

  // CANTANTI 
  { name: "Michael Jackson", real: true, anime: false, movie: false, series: false, alive: false, male: true, powers: false, sport: false, singer: true },
  { name: "Eminem", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: false, singer: true },
  { name: "Bad Bunny", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: false, singer: true },
  { name: "Drake", real: true, anime: false, movie: false, series: false, alive: true, male: true, powers: false, sport: false, singer: true },

  // PERSONAGGI STORICI
  { name: "Albert Einstein", real: true, anime: false, movie: false, series: false, alive: false, male: true, powers: false, sport: false, singer: false },
  { name: "Napoleone Bonaparte", real: true, anime: false, movie: false, series: false, alive: false, male: true, powers: false, sport: false, singer: false },
  { name: "Cleopatra", real: true, anime: false, movie: false, series: false, alive: false, male: false, powers: false, sport: false, singer: false }
]

// DOMANDE
const questions = [
  { key: "real", text: "È una persona reale?" },
  { key: "anime", text: "È un personaggio anime?" },
  { key: "movie", text: "È famoso per film?" },
  { key: "series", text: "È famoso per una serie TV?" },
  { key: "sport", text: "È uno sportivo?" },
  { key: "singer", text: "È un cantante?" },
  { key: "alive", text: "È vivo?" },
  { key: "male", text: "È maschio?" },
  { key: "powers", text: "Ha poteri o abilità sovrumane?" }
]


let handler = async (m, { conn }) => {
  let chatConfig = global.db.data.chats[m.chat] || {}
  if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎')
  }

  if (activeGames.has(m.chat)) {
    return m.reply('『 ⚠️ 』- C\'è già una partita di Akinator in corso!')
  }

  activeGames.set(m.chat, {
    candidates: [...characters],
    asked: [],
    current: null
  })

  m.reply(
`╭〔 *🧠 AKINATOR* 〕╮
┃ Pensa a un personaggio
┃ (anime, film, sport, musica…)
┃
┃ Scrivi *ok* quando sei pronto
╰━━━━━━━━━━━━━━╯`
  )
}

handler.before = async (m, { conn }) => {
  const game = activeGames.get(m.chat)
  if (!game) return

  const text = (m.text || '').toLowerCase()

  if (text === 'ok' && !game.current) {
    return askQuestion(m, conn, game)
  }

  if (!['si', 'no', 'non so', 'nonso'].includes(text)) return
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

function askQuestion(m, conn, game) {
  const q = questions.find(q => !game.asked.includes(q.key))
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
      text: "😵 Non riesco a indovinare… forse non era nel mio database."
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

handler.help = ['akinator']
handler.tags = ['giochi']
handler.command = ['akinator']
handler.register = false

export default handler