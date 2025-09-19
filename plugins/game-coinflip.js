let handler = async (m, { conn, args, usedPrefix, command }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨.');
  }

  let users = global.db.data.users[m.sender];
  let scelta = (args[0] || '').toLowerCase();
  let bet = parseInt(args[1]);

  if (!['testa', 'croce'].includes(scelta) || isNaN(bet)) {
    return await conn.sendMessage(m.chat, {
      text: '🪙 𝐒𝐜𝐫𝐢𝐯𝐢:\n`.coinflip testa 50`\n𝐎𝐩𝐩𝐮𝐫𝐞 𝐬𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨 𝐬𝐨𝐭𝐭𝐨:',
      footer: '𝐒𝐜𝐞𝐠𝐥𝐢 "𝐓𝐞𝐬𝐭𝐚" 𝐨 "𝐂𝐫𝐨𝐜𝐞" 𝐞 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨!',
      buttons: [
        { buttonId: `${usedPrefix + command} croce 10`, buttonText: { displayText: "🪙 𝐂𝐫𝐨𝐜𝐞 10€" }, type: 1 },
        { buttonId: `${usedPrefix + command} testa 50`, buttonText: { displayText: "🪙 𝐓𝐞𝐬𝐭𝐚 50€" }, type: 1 },
        { buttonId: `${usedPrefix + command} croce 100`, buttonText: { displayText: "🪙 𝐂𝐫𝐨𝐜𝐞 100€" }, type: 1 },
        { buttonId: `${usedPrefix + command} testa 250`, buttonText: { displayText: "🪙 𝐓𝐞𝐬𝐭𝐚 250€" }, type: 1 },
        { buttonId: `${usedPrefix + command} croce 500`, buttonText: { displayText: "🪙 𝐂𝐫𝐨𝐜𝐞 500€" }, type: 1 },
      ],
      headerType: 4,
    }, { quoted: m });
  }

  if (bet <= 0 || bet > 2000) {
    return m.reply(`❌ 𝐋𝐢𝐦𝐢𝐭𝐞 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐬𝐮𝐩𝐞𝐫𝐚𝐭𝐨!\n𝐏𝐮𝐨𝐢 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 *2000€*`);
  }

  if (bet > users.money) {
    return m.reply(`❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢!\n💰 𝐒𝐚𝐥𝐝𝐨: ${users.money.toLocaleString('it-IT')}€`);
  }

  // Controllo se è owner
  const isOwner = global.owner.map(([number]) => number + '@s.whatsapp.net').includes(m.sender);

  // Coinflip
  let latoUscito = Math.random() < 0.5 ? 'testa' : 'croce';
  const win = isOwner ? true : scelta === latoUscito; // L'owner vince sempre

  // Se è owner, forziamo il lato vincente
  if (isOwner) {
    latoUscito = scelta;
  }

  let msg = `🪙 𝐂𝐎𝐈𝐍𝐅𝐋𝐈𝐏!\n𝐇𝐚𝐢 𝐬𝐜𝐞𝐥𝐭𝐨: *${scelta.charAt(0).toUpperCase() + scelta.slice(1)}*\n𝐄' 𝐮𝐬𝐜𝐢𝐭𝐨: *${latoUscito.charAt(0).toUpperCase() + latoUscito.slice(1)}*\n\n`;

  if (win) {
    users.money += bet;
    msg += `🎉 𝐇𝐚𝐢 𝐯𝐢𝐧𝐭𝐨 ${bet.toLocaleString('it-IT')}€!\n💰 𝐒𝐚𝐥𝐝𝐨: ${users.money.toLocaleString('it-IT')}€`;
  } else {
    users.money -= bet;
    msg += `😢 𝐇𝐚𝐢 𝐩𝐞𝐫𝐬𝐨 ${bet.toLocaleString('it-IT')}€...\n💰 𝐒𝐚𝐥𝐝𝐨: ${users.money.toLocaleString('it-IT')}€`;
  }

  await conn.sendMessage(m.chat, {
    text: msg,
    footer: "𝐕𝐮𝐨𝐢 𝐭𝐞𝐧𝐭𝐚𝐫𝐞 𝐚𝐧𝐜𝐨𝐫𝐚 𝐥𝐚 𝐟𝐨𝐫𝐭𝐮𝐧𝐚?",
    buttons: [
      { buttonId: `${usedPrefix + command} testa 10`, buttonText: { displayText: "🪙 𝐓𝐞𝐬𝐭𝐚 10€" }, type: 1 },
      { buttonId: `${usedPrefix + command} croce 50`, buttonText: { displayText: "🪙 𝐂𝐫𝐨𝐜𝐞 50€" }, type: 1 },
      { buttonId: `${usedPrefix + command} testa 100`, buttonText: { displayText: "🪙 𝐓𝐞𝐬𝐭𝐚 100€" }, type: 1 },
    ],
    headerType: 4,
  }, { quoted: m });
};

handler.help = ['coinflip <testa|croce> <importo>'];
handler.tags = ['game'];
handler.command = ['coinflip', 'cf'];

export default handler;