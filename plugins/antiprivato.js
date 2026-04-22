export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const settings = global.db.data.settings[conn.user.jid] || {};

  if (settings.antiprivato && !isOwner && !isROwner) {
    try {
      let jid = cleanJid(m.sender);

      // ❌ evita robe strane
      if (!jid || jid === 'status@broadcast') return;
      if (!jid.endsWith('@s.whatsapp.net')) return;

      // ⚠️ IMPORTANTISSIMO: evita crash onWhatsApp
      let user;
      try {
        [user] = await conn.onWhatsApp(jid);
      } catch {
        return; // skip se fallisce
      }

      if (!user?.exists) return;

      await conn.updateBlockStatus(jid, 'block');

    } catch (e) {
      console.error('Errore block:', e?.output?.statusCode, e?.message);
    }
  }

  return false;
}