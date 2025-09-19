let handler = async (m, { conn, command }) => {
  let target = m.sender;

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    target = m.mentionedJid[0];
  } else if (m.quoted && m.quoted.participant) {
    target = m.quoted.participant;
  } else if (m.quoted && m.quoted.sender) {
    target = m.quoted.sender;
  }

  let percentuale = Math.floor(Math.random() * 100);
  let id = target.replace(/[^0-9]/g, '');
  let genere = command.toLowerCase().endsWith('a') ? '𝐀' : '𝐎';

  await conn.reply(
    m.chat,
    `@${id} è 𝐁𝐄𝐋𝐋${genere} al ${percentuale}%`,
    m,
    { mentions: [target] }
  );
};

handler.help = ['bello @tag | nome', 'bella @tag | nome'];
handler.tags = ['fun'];
handler.command = /^bell[oa]/i;

export default handler;