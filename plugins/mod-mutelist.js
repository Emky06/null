let handler = async (m, { conn, isAdmin, isPrems }) => {
  if (!isAdmin && !isPrems) 
    return m.reply('⚠️ Questo comando può essere eseguito solo da admin o utenti premium.');

  // Recupera i membri del gruppo
  let groupMetadata = await conn.groupMetadata(m.chat);
  let groupMembers = groupMetadata.participants.map(u => u.jid);

  // Filtra gli utenti mutati presenti nel gruppo
  let usersMuted = Object.entries(global.db.data.users)
    .filter(([jid, user]) => user.muto && groupMembers.includes(jid));

  if (!usersMuted.length) 
    return m.reply('⚠️ Nessun utente mutato in questo gruppo.');

  // Costruisci il messaggio con menzioni
  let caption = `🔇 𝐋𝐈𝐒𝐓𝐀 𝐔𝐓𝐄𝐍𝐓𝐈 𝐌𝐔𝐓𝐀𝐓𝐈 🔇\n╭•━━━━━━━━━━━━━━•\n┃ Totale: ${usersMuted.length} utente${usersMuted.length > 1 ? 'i' : ''}`;

  for (let i = 0; i < usersMuted.length; i++) {
    let [jid, user] = usersMuted[i];
    let tag = `@${jid.split('@')[0]}`;
    let motivo = user.muteReason || 'Nessun motivo specificato';

    caption += `\n┃\n┃ ${i + 1}. ${tag}\n┃ Motivo: ${motivo}\n┣━━━━━━━━━━━━━━•`;
  }

  caption += `\n╰•━━━━━━━━━━━━━━•`;

  // Manda il messaggio con menzioni
  m.reply(caption, null, { mentions: usersMuted.map(([jid]) => jid) });
}

handler.command = /^mutati$/i;
handler.group = true;
handler.premium = true;

export default handler;