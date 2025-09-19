//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, isOwner, text }) => {
  if (!isOwner) throw '❌ Questo comando è riservato agli owner del bot.';

  const mention = m.mentionedJid?.[0] || m.quoted?.sender;
  if (!mention) throw '❌ Devi menzionare o citare l\'utente di cui vuoi azzerare gli ex coniugi.';

  const user = global.db.data.users[mention];
  if (!user) throw '❌ Utente non trovato nel database.';

  user.ex = [];

  await conn.reply(m.chat, `✅ La lista degli ex coniugi di @${mention.split('@')[0]} è stata azzerata con successo.`, m, {
    mentions: [mention]
  });
};

handler.command = ['azzeraex'];
handler.rowner = true; // Solo real owner
export default handler;