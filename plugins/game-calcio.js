let handler = async (m, { conn, text, command, usedPrefix, args }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
  let users = global.db.data.users[m.sender];
  let cooldown = 30 * 1000; // 30 secondi in millisecondi
  let now = Date.now();

  if (!users.lastCalcio) users.lastCalcio = 0;

  let timeSinceLastPlay = now - users.lastCalcio;

  if (timeSinceLastPlay < cooldown) {
    let timeLeft = ((cooldown - timeSinceLastPlay) / 1000).toFixed(1);
    return await conn.reply(
      m.chat,
      `⏳ *Devi aspettare ${timeLeft} secondi* prima di poter giocare di nuovo a calcio!`,
      m
    );
  }

  if (args.length < 2) {
    return await conn.reply(
      m.chat,
      `⚽ *Scommesse sul Calcio* ⚽\n\n` +
      `📌 *Uso corretto:*\n${usedPrefix}calcio Squadra1-Squadra2 <scommessa>\n` +
      `✅ *Esempio:*\n${usedPrefix}calcio Juventus-Milan 150\n\n` +
      `💡 *Scommetti sulla tua squadra e prova a vincere!*`,
      m
    );
  }

  let teams = args[0].split("-");
  let bet = parseInt(args[1]);

  if (teams.length !== 2) {
    return await conn.reply(
      m.chat,
      `❌ *Errore! Devi separare le squadre con un trattino "-" senza spazi.*\n` +
      `Esempio: ${usedPrefix}calcio Juventus-Milan 150`,
      m
    );
  }

  let team1 = teams[0];
  let team2 = teams[1];

  if (bet > 2000) {
  return await conn.reply(
    m.chat,
    `🚫 *Importo troppo alto!*\n` +
    `💸 Puoi scommettere al massimo *2.000 €* per partita.`,
    m
  );
}

  if (bet > users.money) {
    return await conn.reply(
      m.chat,
      `❌ *Non hai abbastanza denaro!*\n` +
      `Ti mancano *${(bet - users.money).toLocaleString('it-IT')} €*.`,
      m
    );
  }

  // imposta il nuovo timestamp
  users.lastCalcio = now;

  let score1 = Math.floor(Math.random() * 4);
  let score2 = Math.floor(Math.random() * 4);

  let resultMessage = `🏆 *RISULTATO FINALE* 🏆\n\n` +
                      `⚽ ${team1} *${score1} - ${score2}* ${team2} ⚽\n\n`;

  if (score1 === score2) {
    resultMessage += `🤝 *È un pareggio!* Nessuna scommessa viene aggiornata.`;
  } else if (score1 > score2) {
    let winAmount = bet * 2;
    users.money += winAmount;
    resultMessage += `🎉 *Hai vinto!* La tua squadra *${team1}* ha trionfato! 🎊\n` +
                     `💰 Guadagni *${winAmount.toLocaleString('it-IT')} €*!\n` +
                     `💳 Saldo attuale: *${users.money.toLocaleString('it-IT')} €*`;
  } else {
    users.money -= bet;
    resultMessage += `😢 *Hai perso...* La tua squadra *${team1}* ha subito la sconfitta. 💔\n` +
                     `💸 Perdi *${bet.toLocaleString('it-IT')} €*.\n` +
                     `💳 Saldo attuale: *${users.money.toLocaleString('it-IT')} €*`;
  }

  return m.reply(resultMessage);
};

handler.command = /^(calcio)$/i;
export default handler;