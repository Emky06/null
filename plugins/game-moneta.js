//Plugin fatto da Axtral_WiZaRd
const gameSessions = {};
const cooldowns = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨.');
  }

  const sceltePossibili = ["testa", "croce"];
  const maxBet = 100;
  const cooldownTime = 10 * 1000; // 10 

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎲 *𝐌𝐨𝐧𝐞𝐭𝐚 𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫*\n\n𝐒𝐜𝐫𝐢𝐯𝐢 𝐥𝐚 𝐭𝐮𝐚 𝐬𝐜𝐞𝐥𝐭𝐚 𝐞 𝐩𝐮𝐧𝐭𝐚𝐭𝐚:\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix}moneta testa 100\n\n𝐒𝐜𝐞𝐠𝐥𝐢 𝐭𝐫𝐚: ${sceltePossibili.join(", ")}\n𝐌𝐚𝐱 𝐩𝐮𝐧𝐭𝐚𝐭𝐚: ${maxBet} €`,
      footer: '𝐏𝐚𝐫𝐭𝐞𝐜𝐢𝐩𝐚 𝐬𝐮𝐛𝐢𝐭𝐨!',
      headerType: 1
    }, { quoted: m });
  }

  let [choice, betStr] = text.trim().toLowerCase().split(/\s+/);
  if (!sceltePossibili.includes(choice)) {
    return m.reply(`❌ 𝐒𝐜𝐞𝐥𝐭𝐚 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚! 𝐒𝐜𝐞𝐠𝐥𝐢 𝐭𝐫𝐚: ${sceltePossibili.join(", ")}`);
  }
  let bet = parseInt(betStr);
  if (isNaN(bet) || bet <= 0) {
    return m.reply(`❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐚 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞!`);
  }
  if (bet > maxBet) {
    return m.reply(`🚫 𝐏𝐮𝐧𝐭𝐚𝐭𝐚 𝐦𝐚𝐬𝐬𝐢𝐦𝐚 𝐜𝐨𝐧𝐬𝐞𝐧𝐭𝐢𝐭𝐚: ${maxBet} €`);
  }

  const user = global.db.data.users[m.sender];
  if (!user.money || user.money < bet) {
    return m.reply(`💸 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢! 𝐈𝐥 𝐭𝐮𝐨 𝐬𝐚𝐥𝐝𝐨: ${user.money || 0} €`);
  }


  if (cooldowns[m.sender] && (Date.now() - cooldowns[m.sender] < cooldownTime)) {
    const remain = ((cooldownTime - (Date.now() - cooldowns[m.sender])) / 1000).toFixed(1);
    return m.reply(`⏳ 𝐃𝐞𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐫𝐞 ancora ${remain}s 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨.`);
  }

  let session = gameSessions[m.chat];

  if (!session) {

    gameSessions[m.chat] = {
      player1: m.sender,
      choice1: choice,
      bet1: bet,
      player2: null,
      choice2: null,
      bet2: 0,
      status: 'waiting'
    };
    return conn.sendMessage(m.chat, {
      text: `🎲 *𝐌𝐨𝐧𝐞𝐭𝐚 𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫*\n\n@${m.sender.split('@')[0]} 𝐡𝐚 𝐬𝐜𝐞𝐥𝐭𝐨 *${choice}* 𝐜𝐨𝐧 𝐩𝐮𝐧𝐭𝐚𝐭𝐚 *${bet} €*.\n𝐈𝐧 𝐚𝐭𝐭𝐞𝐬𝐚 𝐝𝐢 𝐮𝐧 𝐚𝐥𝐭𝐫𝐨 𝐠𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞 𝐜𝐡𝐞 𝐬𝐜𝐞𝐥𝐠𝐚 𝐥'𝐚𝐥𝐭𝐫𝐚 𝐟𝐚𝐜𝐜𝐢𝐚...`,
      mentions: [m.sender],
      footer: '𝐏𝐚𝐫𝐭𝐞𝐜𝐢𝐩𝐚 𝐬𝐮𝐛𝐢𝐭𝐨!',
      headerType: 1
    }, { quoted: m });
  }

  if (session.status === 'waiting') {
    if (m.sender === session.player1) {
      return m.reply(`𝐇𝐚𝐢 𝐠𝐢𝐚̀ 𝐟𝐚𝐭𝐭𝐨 𝐥𝐚 𝐭𝐮𝐚 𝐬𝐜𝐞𝐥𝐭𝐚 𝐞 𝐬𝐭𝐚𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐧𝐝𝐨 𝐮𝐧 𝐚𝐯𝐯𝐞𝐫𝐬𝐚𝐫𝐢𝐨.`);
    }


    if (choice === session.choice1) {
      return m.reply(`❌ 𝐋𝐚 𝐬𝐜𝐞𝐥𝐭𝐚 𝐞̀ 𝐠𝐢𝐚̀ 𝐬𝐭𝐚𝐭𝐚 𝐩𝐫𝐞𝐬𝐚 𝐝𝐚𝐥 𝐩𝐫𝐢𝐦𝐨 𝐠𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞. 𝐃𝐞𝐯𝐢 𝐬𝐜𝐞𝐠𝐥𝐢𝐞𝐫𝐞 𝐥'𝐚𝐥𝐭𝐫𝐚 𝐟𝐚𝐜𝐜𝐢𝐚!`);
    }

    let user2 = global.db.data.users[m.sender];
    if (!user2.money || user2.money < bet) {
      return m.reply(`💸 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢! 𝐈𝐥 𝐭𝐮𝐨 𝐬𝐚𝐥𝐝𝐨: ${user2.money || 0} €`);
    }

    session.player2 = m.sender;
    session.choice2 = choice;
    session.bet2 = bet;
    session.status = 'ready';


    const risultato = sceltePossibili[Math.floor(Math.random() * sceltePossibili.length)];

    let user1 = global.db.data.users[session.player1];
    let user2b = global.db.data.users[session.player2];

    let messaggio = `🪙 *𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎: ${risultato.toUpperCase()}*\n\n`;

    if (session.choice1 === risultato) {

      user1.money += session.bet2;
      user2b.money -= session.bet2;
      messaggio += `✅ @${session.player1.split('@')[0]} 𝐡𝐚 𝐯𝐢𝐧𝐭𝐨 ${session.bet1 + session.bet2} €\n❌ @${session.player2.split('@')[0]} 𝐡𝐚 𝐩𝐞𝐫𝐬𝐨 ${session.bet2} €\n`;
    } else if (session.choice2 === risultato) {

      user2b.money += session.bet1;
      user1.money -= session.bet1;
      messaggio += `✅ @${session.player2.split('@')[0]} 𝐡𝐚 𝐯𝐢𝐧𝐭𝐨 ${session.bet1 + session.bet2} €\n❌ @${session.player1.split('@')[0]} 𝐡𝐚 𝐩𝐞𝐫𝐬𝐨 ${session.bet1} €\n`;
    }

    messaggio += `\n💰 𝐒𝐚𝐥𝐝𝐨 @${session.player1.split('@')[0]}: ${user1.money} €\n💰 𝐒𝐚𝐥𝐝𝐨 @${session.player2.split('@')[0]}: ${user2b.money} €`;

    await conn.sendMessage(m.chat, {
      text: messaggio + `\n\n 𝐏𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐬𝐜𝐫𝐢𝐯𝐢 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 ${usedPrefix + command}`,
      mentions: [session.player1, session.player2],
      footer: '𝐆𝐢𝐨𝐜𝐚 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨',
      headerType: 1
    }, { quoted: m });

    cooldowns[session.player1] = Date.now();
    cooldowns[session.player2] = Date.now();

    delete gameSessions[m.chat];
    return;
  }

  return m.reply(`❌ 𝐏𝐚𝐫𝐭𝐢𝐭𝐚 𝐠𝐢𝐚̀ 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨, 𝐚𝐬𝐩𝐞𝐭𝐭𝐚 𝐜𝐡𝐞 𝐟𝐢𝐧𝐢𝐬𝐜𝐚 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐢𝐧𝐢𝐳𝐢𝐚𝐫𝐞 𝐮𝐧𝐚 𝐧𝐮𝐨𝐯𝐚.`);
};

handler.command = /^(moneta)$/i;
export default handler;