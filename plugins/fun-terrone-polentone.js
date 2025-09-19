//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text }) => {
  // Prendo la persona da taggare: menzionata o autore del messaggio a cui si risponde
  let user = m.mentionedJid && m.mentionedJid.length > 0 
    ? m.mentionedJid[0] 
    : m.quoted && m.quoted.sender 
      ? m.quoted.sender 
      : null;

  if (!user && !text) return m.reply("????? ? ???????? ? ????????!");

  let nameOrTag = user ? '@' + user.split('@')[0] : text;

  let percentuale = Math.floor(Math.random() * 100);
  let genere = command.toLowerCase().endsWith('a') ? '𝐀' : '𝐄';

  let message = '';
  if (command.toLowerCase().startsWith('terr')) {
    message = `${nameOrTag} è 𝐓𝐄𝐑𝐑𝐎𝐍${genere} al ${percentuale}%`;
  } else {
    message = `${nameOrTag} è 𝐏𝐎𝐋𝐄𝐍𝐓𝐎𝐍${genere} al ${percentuale}%`;
  }

  await conn.reply(m.chat, message, m, { mentions: user ? [user] : [] });
};

handler.help = ['terrone @tag | nome', 'terr*na @tag | nome', 'polentone @tag | nome', 'polentona @tag | nome'];
handler.tags = ['calculator'];
handler.command = /^terron[ea]|polenton[ea]/i;

export default handler;