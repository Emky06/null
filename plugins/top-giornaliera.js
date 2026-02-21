//Plugin fatto da Axtral_WiZaRd
function dateKeyRome() {
  const nowRome = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const y = nowRome.getFullYear();
  const m = String(nowRome.getMonth() + 1).padStart(2, '0');
  const d = String(nowRome.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function ensureDailyReset() {
  if (!global.db?.data) return;
  const today = dateKeyRome();

  if (global.db.data.__dailyDate !== today) {
    for (const jid in global.db.data.chats) {
      if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {};
      global.db.data.chats[jid].messaggiGiornalieri = 0;
      global.db.data.chats[jid].utenti = {};
    }
    global.db.data.__dailyDate = today;
  }
}

const handler = async (m, { conn }) => {
  ensureDailyReset();

  const footer = '𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

  const chatData = global.db.data.chats[m.chat];
  if (!chatData || !chatData.utenti) {
    return conn.sendMessage(m.chat, {
      text: 'Nessun dato disponibile oggi!'
    });
  }

  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  const ranking = Object.entries(chatData.utenti)
    .filter(([jid]) => jid !== botId) // ← esclusione bot
    .map(([jid, data]) => ({
      jid,
      messages: data.messaggiGiornalieri || 0
    }))
    .filter(u => u.messages > 0)
    .sort((a, b) => b.messages - a.messages)
    .slice(0, 10);

  const text = ranking.length
    ? `🏆 *𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩* 🏆\n\n` +
      ranking
        .map((u, i) =>
          `*${i + 1}.* @${u.jid.split('@')[0]}\n📩 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: *${u.messages}*`
        )
        .join('\n\n')
    : 'Nessun messaggio inviato oggi in questo gruppo!';

  await conn.sendMessage(m.chat, {
    text,
    footer,
    mentions: ranking.map(u => u.jid)
  });
};

handler.command = ['dailytop'];
handler.group = true;

export default handler;