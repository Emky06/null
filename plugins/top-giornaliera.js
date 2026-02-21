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

function getTimeUntilReset() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}h ${minutes}m`;
}

const handler = async (m, { conn }) => {
  ensureDailyReset();

  const footer = '𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

  const chatData = global.db.data.chats[m.chat];
  if (!chatData || !chatData.utenti) {
    return conn.sendMessage(m.chat, { text: 'Nessun dato disponibile oggi!' });
  }

  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  const ranking = Object.entries(chatData.utenti)
    .filter(([jid]) => jid !== botId)
    .map(([jid, data]) => ({ jid, messages: data.messaggiGiornalieri || 0 }))
    .filter(u => u.messages > 0)
    .sort((a, b) => b.messages - a.messages)
    .slice(0, 10);

  const intro = "📊 *𝐓𝐨𝐩 𝐠𝐢𝐨𝐫𝐧𝐚𝐥𝐢𝐞𝐫𝐚 𝐝𝐞𝐠𝐥𝐢 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢* 📊\n\n";

  const text = ranking.length
    ? `🏆 *𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩* 🏆\n\n${intro}` +
      ranking
        .map((u, i) =>
          `*${i + 1}.* @${u.jid.split('@')[0]}\n📩 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: *${u.messages}*`
        )
        .join('\n\n') +
      `\n\n⏰ 𝐑𝐞𝐬𝐞𝐭 𝐭𝐫𝐚: ${getTimeUntilReset()}`
    : '𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐨𝐠𝐠𝐢 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨!';

  await conn.sendMessage(m.chat, {
    text,
    footer,
    mentions: ranking.map(u => u.jid)
  });
};

handler.command = ['dailytop'];
handler.group = true;

export default handler;