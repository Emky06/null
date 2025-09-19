//Plugin fatto da Axtral_WiZaRd + Elixir
const games = new Map(); // { chatId: gameData }

function createGame(chatId, starter) {
    games.set(chatId, {
        players: [starter],
        turn: 0,
        scores: [0, 0],
        balls: 8,
        started: false
    });
}

function getGame(chatId) {
    return games.get(chatId);
}

function updateGame(chatId, data) {
    games.set(chatId, data);
}

function endGame(chatId) {
    games.delete(chatId);
}

// Classifica globale
function getLeaderboard(db) {
  const users = Object.entries(db || {}).map(([jid, user]) => ({ jid, wins: user.wins || 0, money: user.money || 0 }));
  return users.sort((a, b) => b.wins - a.wins || b.money - a.money).slice(0, 10);
}

const shotOutcomes = [
  { chance: 0.12, text: '💨 colpisce la palla ma la manca completamente!', balls: 0 },
  { chance: 0.12, text: '🔄 la palla rimbalza sul bordo e non entra!', balls: 0 },
  { chance: 0.12, text: '🌀 la palla sfiora la buca ma resta fuori!', balls: 0 },
  { chance: 0.12, text: '🎯 colpo perfetto! La palla entra nella buca!', balls: 1 },
  { chance: 0.12, text: '😱 imbuca la pallina dell’avversario!', balls: 1, opponent: true },
  { chance: 0.12, text: '⚫️ imbuca la palla nera per sbaglio!', balls: 0, black: true },
  { chance: 0.08, text: '💥 colpo spettacolare! Due palle imbucate!', balls: 2 },
  { chance: 0.06, text: '🔥 colpo incredibile! Tre palle imbucate!', balls: 3 },
  { chance: 0.04, text: '🌪️ colpo da campione! Quattro palle imbucate!', balls: 4 }
];

function getShotResult() {
  let rand = Math.random();
  let acc = 0;
  for (const outcome of shotOutcomes) {
    acc += outcome.chance;
    if (rand < acc) return outcome;
  }
  return shotOutcomes[shotOutcomes.length - 1];
}

function getPrize() {
  // 90%: 2000, 8%: 5000, 1.5%: 10000, 0.4%: 30000
  const rand = Math.random();
  if (rand < 0.9) return 2000;
  if (rand < 0.98) return 5000;
  if (rand < 0.995) return 10000;
  return 30000;
}

const handler = async (m, { conn, args }) => {
  const subcmd = (args[0] || '').toLowerCase();
  const chatId = m.chat;
  const sender = m.sender;
  const game = getGame(chatId);
  const db = global.db?.data?.users;

  // Comando classifica
  if (subcmd === "stats") {
    const leaderboard = getLeaderboard(db);
    let text = '🏆 *Classifica 8BallPool* 🏆\n\n';
    leaderboard.forEach((u, i) => {
      text += `${i + 1}. @${u.jid.split('@')[0]} | Vittorie: ${u.wins} | Sconfitte: ${u.losses || 0} | Partite: ${u.totalGames || 0} | Monete: ${u.money || 0}\n`;
    });
    return await conn.sendMessage(chatId, { text, mentions: leaderboard.map(u => u.jid) }, { quoted: m });
  }

  if (subcmd === "start") {
    if (game) return await conn.sendMessage(chatId, { text: "❌ *Partita già in corso!*", mentions: [sender] }, { quoted: m });
    createGame(chatId, sender);
    const newGame = getGame(chatId);
    newGame.balls = 16;
    updateGame(chatId, newGame);
    return await conn.sendMessage(chatId, { text: `🎱 *@${sender.split('@')[0]} ha creato una partita!*\nUsa *.8bl join* per entrare!`, mentions: [sender] }, { quoted: m });
  }

  if (subcmd === "join") {
    if (!game) return await conn.sendMessage(chatId, { text: "❌ *Nessuna partita attiva, usa .8bl start.*", mentions: [sender] }, { quoted: m });
    if (game.players.length >= 2) return await conn.sendMessage(chatId, { text: "⚠️ *La partita è già piena!*", mentions: [sender] }, { quoted: m });
    game.players.push(sender);
    game.started = true;
    updateGame(chatId, game);
    return await conn.sendMessage(chatId, { text: `✅ *@${sender.split('@')[0]} si è unito!*\n🎱 *La partita inizia!*\n👉 *Turno di* @${game.players[0].split('@')[0]}`, mentions: [sender, game.players[0]] }, { quoted: m });
  }

  if (subcmd === "hit") {
    if (!game || !game.started) return await conn.sendMessage(chatId, { text: "❌ *Nessuna partita attiva!*", mentions: [sender] }, { quoted: m });
    if (sender !== game.players[game.turn]) {
      return await conn.sendMessage(chatId, { text: `⏳ *Non è il tuo turno!*\nTocca a *@${game.players[game.turn].split('@')[0]}*`, mentions: [game.players[game.turn]] }, { quoted: m });
    }
    const outcome = getShotResult();
    let msg = `🎱 *@${sender.split('@')[0]} tira...*\n${outcome.text}`;
    let mentions = [sender];
    let opponent = game.players[(game.turn + 1) % 2];
    let win = false;
    let balls = outcome.balls || 0;
    // Power-up/sfortuna
    if (outcome.opponent) {
      msg += `\n😬 *Regala un punto a @${opponent.split('@')[0]}!*`;
      game.scores[(game.turn + 1) % 2] += balls;
      game.balls -= balls;
      mentions.push(opponent);
      game.turn = (game.turn + 1) % 2;
    } else if (outcome.black) {
      msg += `\n⚫️ *Partita finita! Vince @${opponent.split('@')[0]}!*`;
      mentions.push(opponent);
      win = opponent;
      const prize = getPrize();
      if (db && db[win]) {
        db[win].money = (db[win].money || 0) + prize;
        db[win].wins = (db[win].wins || 0) + 1;
      }
      if (db && db[sender]) {
        db[sender].losses = (db[sender].losses || 0) + 1;
      }
      endGame(chatId);
      return await conn.sendMessage(chatId, { text: msg + `\n💰 *@${opponent.split('@')[0]} vince ${prize.toLocaleString()} monete!*`, mentions }, { quoted: m });
    } else if (balls > 0) {
      game.scores[game.turn] += balls;
      game.balls -= balls;
      msg += balls > 1 ? `\n🔥 *Imbuca ${balls} palline!*` : '';
      // Rimane il turno
    } else {
      game.turn = (game.turn + 1) % 2;
    }
    // Fine partita
    if (game.balls <= 0) {
      const [p1, p2] = game.scores;
      let winner;
      if (p1 > p2) winner = game.players[0];
      else if (p2 > p1) winner = game.players[1];
      else winner = "Pareggio!";
      msg += `\n🏁 *Fine partita!*\n@${game.players[0].split('@')[0]}: ${p1}\n@${game.players[1].split('@')[0]}: ${p2}\n🥇 *Vincitore:* ${typeof winner === 'string' ? winner : '@' + winner.split('@')[0]}`;
      mentions = [game.players[0], game.players[1]];
      if (winner && typeof winner !== 'string') {
        mentions.push(winner);
        const prize = getPrize();
        if (db && db[winner]) {
          db[winner].money = (db[winner].money || 0) + prize;
          db[winner].wins = (db[winner].wins || 0) + 1;
        }
        if (db && db[game.players[0]] && db && db[game.players[1]]) {
          const loser = winner === game.players[0] ? game.players[1] : game.players[0];
          db[loser].losses = (db[loser].losses || 0) + 1;
        }
        msg += `\n💰 *@${winner.split('@')[0]} vince ${prize.toLocaleString()} monete!*`;
      }
      endGame(chatId);
      return await conn.sendMessage(chatId, { text: msg, mentions }, { quoted: m });
    }
    updateGame(chatId, game);
    await conn.sendMessage(chatId, { text: msg + `\n⚪ *Palle rimaste:* ${game.balls}\n👉 *Ora tocca a* @${game.players[game.turn].split('@')[0]}`, mentions: [...mentions, game.players[game.turn]] }, { quoted: m });
  }

  if (subcmd === "end") {
    if (!game) return await conn.sendMessage(chatId, { text: "❌ *Nessuna partita attiva!*", mentions: [sender] }, { quoted: m });
    if (game.players[0] !== sender && game.players[1] !== sender) {
      return await conn.sendMessage(chatId, { text: "❌ *Solo i giocatori nella partita possono terminarla!*", mentions: [sender] }, { quoted: m });
    }
    let msg = `🏁 *Partita terminata da @${sender.split('@')[0]}!*\n`;
    const [p1, p2] = game.scores;
    msg += `@${game.players[0].split('@')[0]}: ${p1}\n@${game.players[1].split('@')[0]}: ${p2}\n`;
    let winner;
    if (p1 > p2) {
      winner = game.players[0];
      msg += `🥇 *Vince @${winner.split('@')[0]}!*`;
    } else if (p2 > p1) {
      winner = game.players[1];
      msg += `🥇 *Vince @${winner.split('@')[0]}!*`;
    } else {
      msg += `🤝 *È un pareggio!*`;
    }
    if (winner && db && db[winner]) {
      db[winner].money = (db[winner].money || 0) + 100;
      db[winner].wins = (db[winner].wins || 0) + 1;
      msg += `\n💰 *@${winner.split('@')[0]} riceve 100 elisir!*`;
    }
    endGame(chatId);
    return await conn.sendMessage(chatId, { text: msg, mentions: [sender, game.players[0], game.players[1]] }, { quoted: m });
  }

  // Comando per resettare le stats
  if (subcmd === "resetstats") {
    let resetCount = 0;
    for (const [jid, user] of Object.entries(db || {})) {
      if (user.wins || user.money) {
        user.wins = 0;
        user.money = 0;
        user.losses = 0;
        user.totalGames = 0;
        resetCount++;
      }
    }
    return await conn.sendMessage(chatId, { text: `🔄 *Stats di 8BallPool resettate per ${resetCount} giocatori!*` }, { quoted: m });
  }

  // Sostituisco l'help generico con un controllo: solo se nessun subcmd valido
  if (!['start','join','hit','end','stats','resetstats'].includes(subcmd)) {
    return await conn.sendMessage(chatId, { text: `🎱 *Comandi disponibili:*
.8bl start | join | hit | end | stats | resetstats`, mentions: [sender] }, { quoted: m });
  }
};

handler.help = ['8bl start', '8bl join', '8bl hit', '8bl end', '8bl stats'];
handler.tags = ['game'];
handler.command = /^8bl$/i;
handler.group = true;
handler.desc = "Gioca a biliardo con gli amici! Classifica, power-up, colpi multipli, premi, stats.";
export default handler;