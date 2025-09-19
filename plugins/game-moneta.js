//Plugin fatto da Axtral_WiZaRd
const gameSessions = {};
const cooldowns = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨.');
  }

  const sceltePossibili = ["testa", "croce"];
  const maxBet = 2000;
  const cooldownTime = 10 * 1000; // 10 

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎲 *Moneta Multiplayer*\n\nScrivi la tua scelta e puntata:\nEsempio: ${usedPrefix}moneta testa 150\n\nScegli tra: ${sceltePossibili.join(", ")}\nMax puntata: ${maxBet} €`,
      footer: 'Partecipa subito!',
      headerType: 1
    }, { quoted: m });
  }

  let [choice, betStr] = text.trim().toLowerCase().split(/\s+/);
  if (!sceltePossibili.includes(choice)) {
    return m.reply(`❌ Scelta non valida! Scegli tra: ${sceltePossibili.join(", ")}`);
  }
  let bet = parseInt(betStr);
  if (isNaN(bet) || bet <= 0) {
    return m.reply(`❌ Inserisci un importo valido da scommettere!`);
  }
  if (bet > maxBet) {
    return m.reply(`🚫 Puntata massima consentita: ${maxBet} €`);
  }

  const user = global.db.data.users[m.sender];
  if (!user.money || user.money < bet) {
    return m.reply(`💸 Non hai abbastanza soldi! Il tuo saldo: ${user.money || 0} €`);
  }


  if (cooldowns[m.sender] && (Date.now() - cooldowns[m.sender] < cooldownTime)) {
    const remain = ((cooldownTime - (Date.now() - cooldowns[m.sender])) / 1000).toFixed(1);
    return m.reply(`⏳ Devi aspettare ancora ${remain}s prima di giocare di nuovo.`);
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
      text: `🎲 *Moneta Multiplayer*\n\n@${m.sender.split('@')[0]} ha scelto *${choice}* con puntata *${bet} €*.\nIn attesa di un altro giocatore che scelga l'altra faccia...`,
      mentions: [m.sender],
      footer: 'Partecipa subito!',
      headerType: 1
    }, { quoted: m });
  }

  if (session.status === 'waiting') {
    if (m.sender === session.player1) {
      return m.reply(`Hai già fatto la tua scelta e stai aspettando un avversario.`);
    }


    if (choice === session.choice1) {
      return m.reply(`❌ La scelta è già stata presa dal primo giocatore. Devi scegliere l'altra faccia!`);
    }

    let user2 = global.db.data.users[m.sender];
    if (!user2.money || user2.money < bet) {
      return m.reply(`💸 Non hai abbastanza soldi! Il tuo saldo: ${user2.money || 0} €`);
    }

    session.player2 = m.sender;
    session.choice2 = choice;
    session.bet2 = bet;
    session.status = 'ready';


    const risultato = sceltePossibili[Math.floor(Math.random() * sceltePossibili.length)];

    let user1 = global.db.data.users[session.player1];
    let user2b = global.db.data.users[session.player2];

    let messaggio = `🪙 *RISULTATO: ${risultato.toUpperCase()}*\n\n`;

    if (session.choice1 === risultato) {

      user1.money += session.bet2;
      user2b.money -= session.bet2;
      messaggio += `✅ @${session.player1.split('@')[0]} ha vinto ${session.bet1 + session.bet2} €\n❌ @${session.player2.split('@')[0]} ha perso ${session.bet2} €\n`;
    } else if (session.choice2 === risultato) {

      user2b.money += session.bet1;
      user1.money -= session.bet1;
      messaggio += `✅ @${session.player2.split('@')[0]} ha vinto ${session.bet1 + session.bet2} €\n❌ @${session.player1.split('@')[0]} ha perso ${session.bet1} €\n`;
    }

    messaggio += `\n💰 Saldo @${session.player1.split('@')[0]}: ${user1.money} €\n💰 Saldo @${session.player2.split('@')[0]}: ${user2b.money} €`;

    await conn.sendMessage(m.chat, {
      text: messaggio + `\n\nPer giocare di nuovo scrivi il comando ${usedPrefix + command}`,
      mentions: [session.player1, session.player2],
      footer: 'Gioca di nuovo',
      headerType: 1
    }, { quoted: m });

    cooldowns[session.player1] = Date.now();
    cooldowns[session.player2] = Date.now();

    delete gameSessions[m.chat];
    return;
  }

  return m.reply(`❌ Partita già in corso, aspetta che finisca prima di iniziare una nuova.`);
};

handler.command = /^(moneta)$/i;
export default handler;