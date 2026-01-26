let handler = async (m, { conn }) => {
  if (!m.isGroup) return; // Funziona solo nei gruppi

  // Ottieni i membri del gruppo
  let groupMetadata = await conn.groupMetadata(m.chat);
  let participants = groupMetadata.participants;

  // Accedi al database degli utenti
  let users = global.db.data.users;

  // Assicurati che ogni partecipante abbia un record nel DB
  participants.forEach(p => {
    if (!users[p.id]) users[p.id] = { blasphemy: 0 };
    if (typeof users[p.id].blasphemy !== 'number') users[p.id].blasphemy = 0;
  });

  // Filtra e ordina i membri con bestemmie
  let groupUsers = participants
    .map(p => ({
      id: p.id,
      bestemmie: users[p.id]?.blasphemy || 0
    }))
    .filter(u => u.bestemmie > 0)
    .sort((a, b) => b.bestemmie - a.bestemmie)
    .slice(0, 10); // Top 10

  // Debug: stampiamo chi viene considerato
  console.log('Top bestemmie:', groupUsers);

  // Genera il messaggio della classifica
  let text;
  if (groupUsers.length === 0) {
    text = "😇 Nessuno ha bestemmiato in questo gruppo!";
  } else {
    text = `🏆 *Top 10 Bestemmiatori del Gruppo* 🏆\n\n`;
    groupUsers.forEach((user, index) => {
      text += `${index + 1}. @${user.id.split('@')[0]} - ${user.bestemmie} bestemmie\n`;
    });
  }

  // Invia il messaggio con menzioni
  await conn.sendMessage(
    m.chat,
    { 
      text, 
      mentions: groupUsers.map(u => u.id) 
    },
    { quoted: m }
  );
};

// Registrazione del comando
handler.command = ['topbestemmie', 'bestemmietop']; // Comandi accettati
handler.group = true; // Solo nei gruppi
export default handler;