function cleanJid(jid) {
  if (!jid) return null;
  jid = jid.split(':')[0];

  if (!jid.includes('@')) {
    jid = jid.replace(/\D/g, '') + '@s.whatsapp.net';
  }

  return jid;
}

export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const settings = global.db.data.settings[conn.user.jid] || {};

  if (settings.antiprivato && !isOwner && !isROwner) {
    try {
      let jid = cleanJid(m.key.remoteJid);

      if (!jid || jid === 'status@broadcast') return;
      if (!jid.endsWith('@s.whatsapp.net')) return;

      console.log('BLOCK DEBUG:', jid);

      await conn.reportAndBlockUser(jid);

      console.log('UTENTE BLOCCATO (REPORT)');

    } catch (e) {
      console.error('Errore block:', e?.output?.statusCode, e?.message);
    }
  }

  return false;
}