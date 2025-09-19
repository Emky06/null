const handler = async (m, { conn, args }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!mention) {
    return conn.sendMessage(m.chat, { text: `❌ Usa: .removecategoria @utente` }, { quoted: m });
  }

  if (!global.db.data.users[mention]) {
    global.db.data.users[mention] = {};
  }

  if (!global.db.data.users[mention].categoria) {
    return conn.sendMessage(m.chat, { text: `⚠️ L'utente non ha nessuna categoria impostata.` }, { quoted: m });
  }

  delete global.db.data.users[mention].categoria;

  await conn.sendMessage(m.chat, { text: `✅ Categoria di @${mention.split("@")[0]} rimossa con successo.`, mentions: [mention] }, { quoted: m });
};

handler.command = /^(eliminacategoria|delcategoria)$/i;
handler.owner = true;  // solo owner può usarlo
export default handler;