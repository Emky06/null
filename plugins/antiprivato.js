export async function before(m, { conn, isOwner, isROwner }) {
  // Ignora messaggi del bot stesso
  if (m.isBaileys && m.fromMe) return true;

  // Ignora i gruppi
  if (m.isGroup) return false;

  // Ignora se il messaggio è vuoto
  if (!m.message) return true;

  // Recupera impostazioni del bot
  const settings = global.db.data.settings[conn.user.jid] || {};

  // Se antiprivato è attivo e l'utente non è owner o real owner
  if (settings.antiprivato && !isOwner && !isROwner) {
 
    // Blocca l'utente
    await conn.updateBlockStatus(m.sender, 'block');
  }

  return false;
}