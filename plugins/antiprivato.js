function cleanJid(jid) {
  if (!jid) return null;

  // rimuove eventuali ":xxx"
  jid = jid.split(':')[0];

  // se è solo numero → trasformalo in jid whatsapp
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
      let jid = cleanJid(m.sender);

      if (!jid || jid === 'status@broadcast') return;
      if (!jid.endsWith('@s.whatsapp.net')) return;

      await conn.updateBlockStatus(jid, 'block').catch(() => {});

    } catch (e) {
      console.error('Errore block:', e?.message);
    }
  }

  return false;
}