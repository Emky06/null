export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const settings = global.db.data.settings[conn.user.jid] || {};

  if (!m.isGroup && settings.antiprivato && !isOwner && !isROwner) {
    return false;
  }

  return true;
}