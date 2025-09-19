const handler = async (m, { args, conn }) => {
  const who = m.sender;
  const users = global.db.data.users;
  const user = users[who];

  if (!user || !Array.isArray(user.animali) || user.animali.length === 0) {
    return conn.reply(m.chat, '🐾 Non hai animali da rinominare.', m);
  }

  const index = parseInt(args[0]) - 1;
  const nuovoNome = args.slice(1).join(' ');

  if (isNaN(index) || index < 0 || index >= user.animali.length) {
    return conn.reply(m.chat, '❌ Numero dell\'animale non valido.', m);
  }

  if (!nuovoNome || nuovoNome.length < 2 || nuovoNome.length > 20) {
    return conn.reply(m.chat, '❌ Specifica un nome valido (2-20 caratteri).', m);
  }

  const animale = user.animali[index];
  animale.nomeUtente = nuovoNome;
  global.db.write();

  return conn.reply(
    m.chat,
    `✅ Hai rinominato ${animale.nome} in *${nuovoNome}*!`,
    m
  );
};

handler.help = ['nomina <numero> <nome>'];
handler.tags = ['animali'];
handler.command = /^nomina$/i;
handler.exp = 5;

export default handler;