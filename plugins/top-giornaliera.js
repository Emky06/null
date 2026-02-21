//Plugin fatto da Axtral_WiZaRd
function dateKeyRome() {
  const nowRome = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const y = nowRome.getFullYear();
  const m = String(nowRome.getMonth() + 1).padStart(2, '0');
  const d = String(nowRome.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function ensureGroupDailyReset(chatId) {
  if (!global.dailytop) global.dailytop = {};
  const today = dateKeyRome();
  if (!global.dailytop[chatId] || global.dailytop[chatId].__date !== today) {
    global.dailytop[chatId] = { __date: today, utenti: {} };
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

function trackMessage(chatId, senderJid, botJid) {
  ensureGroupDailyReset(chatId);
  if (senderJid === botJid) return;
  const utenti = global.dailytop[chatId].utenti;
  if (!utenti[senderJid]) utenti[senderJid] = 0;
  utenti[senderJid]++;
}

const handler = async (m, { conn, participants }) => {
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  ensureGroupDailyReset(m.chat);
  const utenti = global.dailytop[m.chat].utenti;
  const participantJids = participants.map(p => p.jid).filter(jid => jid && jid !== botId);
  let usersData = participantJids
    .map(jid => ({ jid, messaggi: utenti[jid] || 0 }))
    .filter(u => u.messaggi > 0)
    .sort((a, b) => b.messaggi - a.messaggi)
    .slice(0, 10);
  if (usersData.length === 0) return conn.reply(m.chat, "⚠︎ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐡𝐚 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐨𝐠𝐠𝐢!", m);

  let message = `🏆 *𝐃𝐚𝐢𝐥𝐲 𝐓𝐨𝐩* 🏆\n\n📊 *𝐓𝐨𝐩 𝐠𝐢𝐨𝐫𝐧𝐚𝐥𝐢𝐞𝐫𝐚 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢* 📊\n\n`;
  let mentions = [];
  let userPosition = null;

  usersData.forEach((user, i) => {
    let medal = "🏅";
    if (i === 0) medal = "🥇";
    else if (i === 1) medal = "🥈";
    else if (i === 2) medal = "🥉";
    message += `${medal} *${i + 1}.* @${user.jid.split('@')[0]} ➠ ${user.messaggi} 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢\n`;
    mentions.push(user.jid);
    if (user.jid === m.sender) userPosition = i + 1;
  });

  const totalPlayers = participantJids.length;
  const timeLeft = getTimeUntilReset();
  let userMessage = userPosition
    ? `\n\n𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
    : `\n\n𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;
  message += `\n⏰ Reset tra: ${timeLeft}`;

  await conn.sendMessage(m.chat, { text: message + userMessage, mentions });
};

handler.command = ['dailytop'];
handler.group = true;

export { trackMessage };
export default handler;