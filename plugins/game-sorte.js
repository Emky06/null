let handler = async (m, { conn, text, command, usedPrefix, args }) => {
  let chatConfig = global.db.data.chats[m.chat] || {};
    if (chatConfig.antigiochi) {
    return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛\n𝐈 𝐠𝐢𝐨𝐜𝐡𝐢 𝐬𝐨𝐧𝐨 𝐢𝐧 𝐩𝐚𝐮𝐬𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐦𝐨𝐦𝐞𝐧𝐭𝐨. ');
    }  // Se antigiochi è attivo, non rispondere e interrompi l'esecuzione
  const users = global.db.data.users[m.sender];
  const cavalli = ["testa", "croce"];
  const partecipante = args[0]?.toLowerCase();

  if (!partecipante || !cavalli.includes(partecipante)) {
    return await conn.reply(m.chat, `══════•⊰✦⊱•══════
❌ *𝐒𝐢𝐦𝐛𝐨𝐥𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨!*
𝐄𝐬𝐞𝐦𝐩𝐢𝐨: *${usedPrefix}sorte testa 100*
𝐒𝐜𝐞𝐠𝐥𝐢 𝐭𝐫𝐚: *${cavalli.join(', ')}*
══════•⊰✦⊱•══════`, m);
  }

  const scommessa = parseInt(args[1]);
  if (isNaN(scommessa) || scommessa <= 0) {
    return await conn.reply(m.chat, `❌ *𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐢𝐦𝐩𝐨𝐫𝐭𝐨 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐚 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞!*
𝐄𝐬𝐞𝐦𝐩𝐢𝐨: *${usedPrefix}sorte testa 100*`, m);
  }
  
  if (scommessa > 100) {
  return await conn.reply(m.chat, `🚫 *𝐋𝐢𝐦𝐢𝐭𝐞 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 𝐬𝐮𝐩𝐞𝐫𝐚𝐭𝐨!*
𝐏𝐮𝐨𝐢 𝐬𝐜𝐨𝐦𝐦𝐞𝐭𝐭𝐞𝐫𝐞 𝐚𝐥 𝐦𝐚𝐬𝐬𝐢𝐦𝐨 *𝟏𝟎𝟎 €* 𝐩𝐞𝐫 𝐠𝐢𝐨𝐜𝐚𝐭𝐚.`, m);
}

  if (scommessa > users.money) {
    return await conn.reply(m.chat, `❌ *𝐒𝐞𝐢 𝐭𝐫𝐨𝐩𝐩𝐨 𝐩𝐨𝐯𝐞𝐫𝐨 𝐩𝐞𝐫 𝐢 𝐠𝐢𝐨𝐜𝐡𝐢 𝐝'𝐚𝐳𝐳𝐚𝐫𝐝𝐨!*
𝐓𝐢 𝐦𝐚𝐧𝐜𝐚𝐧𝐨 *${(scommessa - users.money).toLocaleString()} €*.`, m);
  }

  // Cooldown 30 secondi
  users.lastSorte = users.lastSorte || 0;
  const now = Date.now();
  const cooldown = 10 * 1000; // 30 secondi

  if (now - users.lastSorte < cooldown) {
    const timeLeft = ((cooldown - (now - users.lastSorte)) / 1000).toFixed(1);
    return await conn.reply(m.chat, `⏳ *𝐀𝐬𝐩𝐞𝐭𝐭𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 ${timeLeft}s 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐫𝐢𝐩𝐫𝐨𝐯𝐚𝐫𝐞!*`, m);
  }

  users.lastSorte = now;

  const risultatoCorsa = cavalli[Math.floor(Math.random() * cavalli.length)];

  if (partecipante === risultatoCorsa) {
    const vincita = scommessa * 2;
    users.money += vincita;
    return m.reply(`✨ 𝐄̀ 𝐮𝐬𝐜𝐢𝐭𝐨 *${risultatoCorsa.toUpperCase()}*!  
𝐇𝐚𝐢 *𝐕𝐈𝐍𝐓𝐎* *${vincita.toLocaleString()} €*!  
𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞: *${users.money.toLocaleString()} €*`);
  } else {
    users.money -= scommessa;
    return m.reply(`☠️ 𝐄̀ 𝐮𝐬𝐜𝐢𝐭𝐨 *${risultatoCorsa.toUpperCase()}*!  
𝐇𝐚𝐢 *𝐏𝐄𝐑𝐒𝐎* *${scommessa.toLocaleString()} €*...  
𝐒𝐚𝐥𝐝𝐨 𝐚𝐭𝐭𝐮𝐚𝐥𝐞: *${users.money.toLocaleString()} €*`);
  }
};

handler.command = /^(sorte)$/i;
export default handler;