export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const settings = global.db.data.settings[conn.user.jid] || {};

  if (settings.antiprivato && !isOwner && !isROwner) {

    const user = m.sender?.split(':')[0];

    if (user && user.endsWith('@s.whatsapp.net')) {
      await conn.updateBlockStatus(user, 'block');
    }
  }

  return false;
}