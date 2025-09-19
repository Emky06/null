const handler = async (m, { conn }) => {
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!Array.isArray(user.genitori) || user.genitori.length === 0) {
    return m.reply('Non hai genitori da cui auto-abbandonarti.');
  }

  const genitori = user.genitori;
  const nomiGenitori = [];

  for (const jid of genitori) {
    const g = users[jid];
    if (g && Array.isArray(g.figli)) {
      g.figli = g.figli.filter(f => f !== m.sender);
    }

    try {
      const nome = await conn.getName(jid);
      nomiGenitori.push(`@${jid.split('@')[0]}`);
    } catch {
      nomiGenitori.push(`@${jid.split('@')[0]}`);
    }
  }

  user.genitori = [];

  return conn.sendMessage(m.chat, {
    text: `👋 Hai deciso di auto-abbandonarti.\nHai rimosso i seguenti genitori:\n${nomiGenitori.join('\n')}`,
    mentions: genitori
  }, { quoted: m });
};

handler.command = ['autoabbandono', 'lasciagenitori'];
handler.group = true;

export default handler;