//Plugin fatto da Riad
let handler = async (m, { conn }) => {
  try {
    let blocked = await conn.fetchBlocklist();

    if (!blocked || blocked.length === 0) {
      return m.reply('✅ Nessun utente è attualmente bloccato.');
    }

    for (let jid of blocked) {
      try {
        await conn.updateBlockStatus(jid, 'unblock');
        console.log(`Sbloccato: ${jid}`);
      } catch (err) {
        console.log(`Errore nello sbloccare ${jid}:`, err);
      }
    }

    return m.reply(`✅ Tutti gli utenti sono stati sbloccati con successo.`);
  } catch (err) {
    console.error(err);
    return m.reply('❌ Errore durante il recupero o lo sblocco della blocklist.');
  }
};

handler.help = ['unblockall'];
handler.tags = ['owner'];
handler.command = ['unblockall'];
handler.owner = true;

export default handler;