export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const settings = global.db.data.settings[conn.user.jid] || {};

  if (settings.antiprivato && !isOwner && !isROwner) {
    try {
      // ✅ evita roba non valida
      if (!m.sender || !m.sender.endsWith('@s.whatsapp.net')) return;

      // ✅ controlla se esiste davvero
      const [user] = await conn.onWhatsApp(m.sender);
      if (!user?.exists) return;

      await conn.updateBlockStatus(m.sender, 'block');

    } catch (e) {
      console.error('Errore block:', e?.output?.statusCode, e);
    }
  }

  return false;
}