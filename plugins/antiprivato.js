export async function before(m, { conn, isOwner, isROwner }) {
    if (m.isBaileys && m.fromMe) return true;
    if (m.isGroup) return false;
    if (!m.message) return true;

    const settings = global.db.data.settings[conn.user.jid] || {};

    if (settings.antiprivato && !(isOwner || isROwner)) {
        try {
            // usa sender sempre, non chat
            const jid = m.sender;

            // controllo strict jid WhatsApp
            if (!jid || typeof jid !== 'string') return;

            if (!jid.endsWith('@s.whatsapp.net')) return;

            // realvare-safe block call
            await conn.updateBlockStatus(jid, 'block');

        } catch (err) {
            console.log('❌ antiprivato error:', err);
        }
    }

    return false;
}