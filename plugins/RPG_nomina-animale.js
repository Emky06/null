//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { args, conn }) => {
  const who = m.sender;
  const users = global.db.data.users;
  const user = users[who];

  if (!user || !Array.isArray(user.animali) || user.animali.length === 0) {
    return conn.reply(m.chat, '🐾 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐝𝐚 𝐫𝐢𝐧𝐨𝐦𝐢𝐧𝐚𝐫𝐞.', m);
  }

  const index = parseInt(args[0]) - 1;
  const nuovoNome = args.slice(1).join(' ');

  if (isNaN(index) || index < 0 || index >= user.animali.length) {
    return conn.reply(m.chat, '❌ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐝𝐞𝐥𝐥\'𝐚𝐧𝐢𝐦𝐚𝐥𝐞 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.', m);
  }

  if (!nuovoNome || nuovoNome.length < 2 || nuovoNome.length > 20) {
    return conn.reply(m.chat, '❌ 𝐒𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚 𝐮𝐧 𝐧𝐨𝐦𝐞 𝐯𝐚𝐥𝐢𝐝𝐨 (𝟐-𝟐𝟎 𝐜𝐚𝐫𝐚𝐭𝐭𝐞𝐫𝐢).', m);
  }

  const animale = user.animali[index];
  animale.nomeUtente = nuovoNome;
  global.db.write();

  return conn.reply(
    m.chat,
    `✅ 𝐇𝐚𝐢 𝐫𝐢𝐧𝐨𝐦𝐢𝐧𝐚𝐭𝐨 ${animale.nome} 𝐢𝐧 *${nuovoNome}*!`,
    m
  );
};

handler.help = ['nomina <numero> <nome>'];
handler.tags = ['animali'];
handler.command = /^nomina$/i;
handler.group = true

export default handler;