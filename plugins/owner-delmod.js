// Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, prems: {}, groups: {} } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, prems: {}, groups: {} };
  if (!global.db.data.groups) global.db.data.groups = {};
  if (!global.prems) global.prems = [];
}

let handler = async (m, { conn, text, usedPrefix, command, isOwner, isROwner, isAdmin, isBotAdmin, groupMetadata, participants }) => {
  ensureDB();

  // Verifica i privilegi dell'utente che esegue il comando
  if (!isOwner && !isROwner) {
    return conn.sendMessage(m.chat, { 
      text: '❌ Solo il proprietario del bot può utilizzare questo comando'
    }, { quoted: m });
  }

  let who;

  // 1. Prima prova: tag o quote
  if (m.isGroup) {
    who = m.mentionedJid?.[0] || m.quoted?.sender || '';
  } else {
    who = m.quoted?.sender || '';
  }

  // 2. Se non c'è tag/quote, prova a leggere dal testo (numero o jid)
  if (!who && text) {
    let txt = text.trim();

    // Se è già un JID completo
    if (txt.endsWith('@s.whatsapp.net') || txt.endsWith('@c.us')) {
      who = txt;
    } else {
      // Togli tutto tranne le cifre
      let number = txt.replace(/[^0-9]/g, '');
      // Controllo lunghezza numero 
      if (number.length >= 8 && number.length <= 15) {

        if (!number.startsWith('39')) {
          number = '39' + number;
        }
        who = number + '@s.whatsapp.net';
      }
    }
  }

  // 3. Se ancora niente e siamo in privato, usa la chat stessa
  if (!who && !m.isGroup) {
    who = m.chat;
  }

  if (!who) {
    return m.reply(`❌ Devi specificare un utente. Esempio: ${usedPrefix + command} @utente o ${usedPrefix + command} +39 350 014 8400`);
  }

  // Normalizza il JID
  const decoded = conn.decodeJid ? conn.decodeJid(who) : who;
  const userId = decoded.split('@')[0];
  const fullUserId = userId + '@s.whatsapp.net';

  // Controlla se l'utente è mod (nel gruppo o globalmente)
  let isPremium = m.isGroup
    ? global.db.data.groups[m.chat]?.prems?.includes(userId)
    : global.prems.includes(userId);

  if (!isPremium) {
    const responseText = m.isGroup
      ? `@${userId} 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐝𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`
      : `@${userId} 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞.`;
    
    return m.reply(responseText, null, { mentions: [fullUserId] });
  }

  // Rimuovi da global.prems solo se non siamo in un gruppo
  if (!m.isGroup) {
    const index = global.prems.indexOf(userId);
    if (index !== -1) global.prems.splice(index, 1);
  }

  // Rimuovi dal database per gruppo
  if (m.isGroup && global.db.data.groups[m.chat]?.prems) {
    const groupIndex = global.db.data.groups[m.chat].prems.indexOf(userId);
    if (groupIndex !== -1) global.db.data.groups[m.chat].prems.splice(groupIndex, 1);
  }

  // Aggiorna anche l'utente nel database
  if (global.db.data.users[fullUserId]) {
    global.db.data.users[fullUserId].premium = false;
  }

  let textdelprem = m.isGroup
    ? `@${userId} 𝐧𝐨𝐧 𝐞̀ 𝐩𝐢𝐮̀ 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`
    : `@${userId} 𝐧𝐨𝐧 𝐞̀ 𝐩𝐢𝐮̀ 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞.`;

  m.reply(textdelprem, null, { mentions: [fullUserId] });
};

handler.help = ['delmod <@user|numero>'];
handler.tags = ['owner'];
handler.command = /^(remove|del|rimuovi)mod$/i;
handler.group = true;
handler.rowner = true;

export default handler;