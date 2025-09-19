const handler = async (m, { conn, args, text, isOwner, isROwner }) => {
  // Verifica se è stato menzionato un utente o è una risposta a un messaggio
  let user = m.mentionedJid?.[0] || m.quoted?.sender;
  if (!user) {
    return m.reply("❌ Devi menzionare un utente o rispondere a un suo messaggio.");
  }

  // Estrai il numero di messaggi da aggiungere dal testo (usa solo il primo numero trovato)
  let numero = parseInt(text.match(/\d+/)?.[0] || 0);
  if (isNaN(numero) || numero <= 0) {
    return m.reply("❌ Inserisci un numero valido di messaggi da aggiungere!");
  }

  // Assicurati che l'oggetto utente esista nel database
  global.db.data.users[user] = global.db.data.users[user] || {};

  // Aggiungi i messaggi
  global.db.data.users[user].messaggi = (global.db.data.users[user].messaggi || 0) + numero;

  // Risposta di conferma
  conn.reply(
    m.chat,
    `✅ Ho aggiunto *${numero}* messaggi all'utente @${user.split('@')[0]}!`,
    m,
    {
      contextInfo: {
        mentionedJid: [user],
        quotedMessage: {
          extendedTextMessage: {
            text: "Messaggi aggiunti con successo!",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Unlimited\nORG:Unlimited\nEND:VCARD"
          }
        }
      }
    }
  );
};

// Comando trigger
handler.command = /^aggiungi$/i;
handler.owner = true;

export default handler;