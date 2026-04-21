export async function before(m, { conn, isOwner, isROwner }) {
    // Ignora messaggi del bot stesso
    if (m.isBaileys && m.fromMe) return true;

    // Ignora gruppi
    if (m.isGroup) return false;

    // Ignora messaggi vuoti
    if (!m.message) return true;

    // Recupera impostazioni del bot dal database
    const settings = global.db.data.settings[conn.user.jid] || {};

    // Antiprivato attivo + utente non autorizzato
    if (settings.antiprivato && !(isOwner || isROwner)) {
        try {
            // Controllo extra per evitare errore 400 (bad-request)
            if (typeof m.chat === 'string' && m.chat.includes('@s.whatsapp.net')) {
                await conn.updateBlockStatus(m.chat, 'block');
            }
        } catch (err) {
            console.log('Errore antiprivato (block):', err);
        }
    }

    return false;
}