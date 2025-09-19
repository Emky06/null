// Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { 
    data: { 
      users: {}, 
      chats: {}, 
      __dailyDate: null, 
      excluded: { users: {}, chats: {} } 
    } 
  };
  if (!global.db.data) global.db.data = { 
    users: {}, 
    chats: {}, 
    __dailyDate: null, 
    excluded: { users: {}, chats: {} } 
  };
  if (!global.db.data.excluded) global.db.data.excluded = { users: {}, chats: {} };
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.chats) global.db.data.chats = {};
}

const handler = async (m, { conn }) => {
  ensureDB();

  const text = (m.text || '').trim();
  const args = text.split(/\s+/).slice(1);
  const command = text.split(' ')[0].toLowerCase();

  // UTENTI
  if (command === '.escludi') {
    let jid;
    if (m.mentionedJid && m.mentionedJid.length) {
      jid = m.mentionedJid[0];
    } else if (args.length) {
      jid = args[0].includes('@') ? args[0] : args[0] + '@s.whatsapp.net';
    } else {
      return await conn.sendMessage(m.chat, { text: 'Specifica un utente da escludere!' });
    }

    global.db.data.excluded.users[jid] = true;
    await conn.sendMessage(m.chat, { 
      text: `✅ Utente @${jid.split('@')[0]} escluso dalle classifiche!`, 
      mentions: [jid] 
    });
  }

  if (command === '.riammetti') {
    let jid;
    if (m.mentionedJid && m.mentionedJid.length) {
      jid = m.mentionedJid[0];
    } else if (args.length) {
      jid = args[0].includes('@') ? args[0] : args[0] + '@s.whatsapp.net';
    } else {
      return await conn.sendMessage(m.chat, { text: 'Specifica un utente da riammmettere!' });
    }

    delete global.db.data.excluded.users[jid];
    await conn.sendMessage(m.chat, { 
      text: `✅ Utente @${jid.split('@')[0]} riammesso nelle classifiche!`, 
      mentions: [jid] 
    });
  }

  // GRUPPI
  if (command === '.escludigruppo') {
    const jid = m.chat; 
    global.db.data.excluded.chats[jid] = true;
    if (global.db.data.chats[jid]) global.db.data.chats[jid].messaggiGiornalieri = 0;
    await conn.sendMessage(m.chat, { text: `✅ Questo gruppo è stato escluso dalle classifiche!` });
  }

  if (command === '.riammettigruppo') {
    const jid = m.chat;
    delete global.db.data.excluded.chats[jid];
    await conn.sendMessage(m.chat, { text: `✅ Questo gruppo è stato riammesso nelle classifiche!` });
  }
};

handler.command = /^\.?(escludi|riammetti|escludigruppo|riammettigruppo)$/i;
handler.group = true;
handler.owner = true;

export default handler;