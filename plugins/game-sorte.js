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
❌ *Simbolo non valido!*
Esempio: *${usedPrefix}sorte testa 150*
Scegli tra: *${cavalli.join(', ')}*
══════•⊰✦⊱•══════`, m);
  }

  const scommessa = parseInt(args[1]);
  if (isNaN(scommessa) || scommessa <= 0) {
    return await conn.reply(m.chat, `❌ *Inserisci un importo valido da scommettere!*
Esempio: *${usedPrefix}sorte testa 150*`, m);
  }
  
  if (scommessa > 2000) {
  return await conn.reply(m.chat, `🚫 *Limite massimo superato!*
Puoi scommettere al massimo *2.000 €* per giocata.`, m);
}

  if (scommessa > users.money) {
    return await conn.reply(m.chat, `❌ *Sei troppo povero per i giochi d'azzardo!*
Ti mancano *${(scommessa - users.money).toLocaleString()} €*.`, m);
  }

  // Cooldown 30 secondi
  users.lastSorte = users.lastSorte || 0;
  const now = Date.now();
  const cooldown = 10 * 1000; // 30 secondi

  if (now - users.lastSorte < cooldown) {
    const timeLeft = ((cooldown - (now - users.lastSorte)) / 1000).toFixed(1);
    return await conn.reply(m.chat, `⏳ *Aspetta ancora ${timeLeft}s prima di riprovare!*`, m);
  }

  users.lastSorte = now;

  const risultatoCorsa = cavalli[Math.floor(Math.random() * cavalli.length)];

  if (partecipante === risultatoCorsa) {
    const vincita = scommessa * 2;
    users.money += vincita;
    return m.reply(`✨ È uscito *${risultatoCorsa.toUpperCase()}*!  
Hai *VINTO* *${vincita.toLocaleString()} €*!  
Saldo attuale: *${users.money.toLocaleString()} €*`);
  } else {
    users.money -= scommessa;
    return m.reply(`☠️ È uscito *${risultatoCorsa.toUpperCase()}*!  
Hai *PERSO* *${scommessa.toLocaleString()} €*...  
Saldo attuale: *${users.money.toLocaleString()} €*`);
  }
};

handler.command = /^(sorte)$/i;
export default handler;