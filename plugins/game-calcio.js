//Plugin fatto da Axtral_WiZaRd
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
      `⏳ *𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 ${timeLeft} 𝐬𝐞𝐜𝐨𝐧𝐝𝐢* 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐩𝐨𝐭𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐚 𝐜𝐚𝐥𝐜𝐢𝐨!`,
      m
    );
  }

  if (args.length < 2) {
    return await conn.reply(
      m.chat,
      `⚽ *𝐒𝐜𝐨𝐦𝐦𝐞𝐬𝐬𝐞 𝐬𝐮𝐥 𝐂𝐚𝐥𝐜𝐢𝐨* ⚽\n\n` +
      `📌 *𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:*\n${usedPrefix}calcio Squadra1-Squadra2 <scommessa>\n` +
      `✅ *𝐄𝐬𝐞𝐦𝐩𝐢𝐨:*\n${usedPrefix}calcio Juventus-Milan 100\n\n` +
      `💡 *𝐒𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐢 𝐬𝐮𝐥𝐥𝐚 𝐭𝐮𝐚 𝐬𝐪𝐮𝐚𝐝𝐫𝐚 𝐞 𝐩𝐫𝐨𝐯𝐚 𝐚 𝐯𝐢𝐧𝐜𝐞𝐫𝐞!*`,
      m
    );
  }

  let teams = args[0].split("-");
  let bet = parseInt(args[1]);

  if (teams.length !== 2) {
    return await conn.reply(
      m.chat,
      `❌ *𝐄𝐫𝐫𝐨𝐫𝐞! 𝐃𝐞𝐯𝐢 𝐬𝐞𝐩𝐚𝐫𝐚𝐫𝐞 𝐥𝐞 𝐬𝐪𝐮𝐚𝐝𝐫𝐞 𝐜𝐨𝐧 𝐮𝐧 𝐭𝐫𝐚𝐭𝐭𝐢𝐧𝐨 "-" 𝐬𝐞𝐧𝐳𝐚 𝐬𝐩𝐚𝐳𝐢.*\n` +
      `𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix}calcio Juventus-Milan 100`,
      m
    );
  }

  let team1 = teams[0];
  let team2 = teams[1];

  if (bet > 100) {
  return await conn.reply(
    m.chat,
    `🚫 *𝐈𝐦𝐩𝐨𝐫𝐭𝐨 𝐭𝐫𝐨𝐩𝐩𝐨 𝐚𝐥𝐭𝐨!*\n` +
    `💸 𝐏𝐮𝐨𝐢 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 *𝟏𝟎𝟎 €* 𝐩𝐞𝐫 𝐩𝐚𝐫𝐭𝐢𝐭𝐚.`,
    m
  );
}

  if (bet > users.money) {
    return await conn.reply(
      m.chat,
      `❌ *𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐝𝐞𝐧𝐚𝐫𝐨!*\n` +
      `𝐓𝐢 𝐦𝐚𝐧𝐜𝐚𝐧𝐨 *${(bet - users.money).toLocaleString('it-IT')} €*.`,
      m
    );
  }

  users.lastCalcio = now;

  let score1 = Math.floor(Math.random() * 4);
  let score2 = Math.floor(Math.random() * 4);

  let resultMessage = `🏆 *𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎 𝐅𝐈𝐍𝐀𝐋𝐄* 🏆\n\n` +
                      `⚽ ${team1} *${score1} - ${score2}* ${team2} ⚽\n\n`;

  if (score1 === score2) {
    resultMessage += `🤝 *𝐄̀ 𝐮𝐧 𝐩𝐚𝐫𝐞𝐠𝐠𝐢𝐨!* 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐬𝐜𝐨𝐦𝐦𝐞𝐬𝐬𝐚 𝐯𝐢𝐞𝐧𝐞 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐚.`;
  } else if (score1 > score2) {
    let winAmount = bet * 2;
    users.money += winAmount;
    resultMessage += `🎉 *𝐇𝐚𝐢 𝐯𝐢𝐧𝐭𝐨!* 𝐋𝐚 𝐭𝐮𝐚 𝐬𝐪𝐮𝐚𝐝𝐫𝐚 *${team1}* 𝐡𝐚 𝐭𝐫𝐢𝐨𝐧𝐟𝐚𝐭𝐨! 🎊\n` +
                     `💰 𝐆𝐮𝐚𝐝𝐚𝐠𝐧𝐢 *${winAmount.toLocaleString('it-IT')} €*!\n` +
                     `💳 𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞: *${users.money.toLocaleString('it-IT')} €*`;
  } else {
    users.money -= bet;
    resultMessage += `😢 *𝐇𝐚𝐢 𝐩𝐞𝐫𝐬𝐨...* 𝐋𝐚 𝐭𝐮𝐚 𝐬𝐪𝐮𝐚𝐝𝐫𝐚 *${team1}* 𝐡𝐚 𝐬𝐮𝐛𝐢𝐭𝐨 la 𝐬𝐜𝐨𝐧𝐟𝐢𝐭𝐭𝐚. 💔\n` +
                     `💸 𝐏𝐞𝐫𝐝𝐢 *${bet.toLocaleString('it-IT')} €*.\n` +
                     `💳 𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞: *${users.money.toLocaleString('it-IT')} €*`;
  }

  return m.reply(resultMessage);
};

handler.command = /^(calcio)$/i;
export default handler;