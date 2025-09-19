//Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, __dailyDate: null, excluded: { users: {}, chats: {} } } };
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.chats) global.db.data.chats = {};
}

const handler = async (m, { conn, args, command }) => {
  ensureDB();

  const isUserCmd = /^(addmsg|rmsg)$/i.test(command);
  const isGroupCmd = /^(addmsgp|rmsgp)$/i.test(command);

  let amount = parseInt(args[1] || args[0]);
  if (isNaN(amount) || amount <= 0) {
    return m.reply(`❌ Inserisci un numero valido di messaggi!`);
  }

  // UTENTI
  if (isUserCmd) {
    let target;
    if (m.mentionedJid?.length) {
      target = m.mentionedJid[0];
    } else if (args[0]?.endsWith('@s.whatsapp.net')) {
      target = args[0];
    } else {
      target = m.sender; 
    }

    if (!global.db.data.users[target]) global.db.data.users[target] = {};
    let user = global.db.data.users[target];

    if (/^addmsg$/i.test(command)) {
      user.messaggiGiornalieri = (user.messaggiGiornalieri || 0) + amount;
      return m.reply(`✅ Aggiunti *${amount}* messaggi a @${target.split('@')[0]}`, null, { mentions: [target] });
    } else if (/^rmsg$/i.test(command)) {
      user.messaggiGiornalieri = Math.max(0, (user.messaggiGiornalieri || 0) - amount);
      return m.reply(`✅ Rimossi *${amount}* messaggi da @${target.split('@')[0]}`, null, { mentions: [target] });
    }
  }

  // GRUPPI
  if (isGroupCmd) {
    if (!m.isGroup) return m.reply(`❌ Questo comando funziona solo nei gruppi!`);

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];

    if (/^addmsgp$/i.test(command)) {
      chat.messaggiGiornalieri = (chat.messaggiGiornalieri || 0) + amount;
      return m.reply(`✅ Aggiunti *${amount}* messaggi al gruppo.`);
    } else if (/^rmsgp$/i.test(command)) {
      chat.messaggiGiornalieri = Math.max(0, (chat.messaggiGiornalieri || 0) - amount);
      return m.reply(`✅ Rimossi *${amount}* messaggi dal gruppo.`);
    }
  }
};

handler.command = /^(addmsg|rmsg|addmsgp|rmsgp)$/i;
handler.group = true;
handler.owner = true; 

export default handler;