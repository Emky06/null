//Plugin fatto da Axtral_WiZaRd
function dateKeyRome() {
  const nowRome = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const y = nowRome.getFullYear();
  const m = String(nowRome.getMonth() + 1).padStart(2, '0');
  const d = String(nowRome.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, __dailyDate: null, excluded: { users: {}, chats: {} } } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, __dailyDate: null, excluded: { users: {}, chats: {} } };
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.chats) global.db.data.chats = {};
  if (!('__dailyDate' in global.db.data)) global.db.data.__dailyDate = null;
  if (!global.db.data.excluded) global.db.data.excluded = { users: {}, chats: {} };
}

function ensureDailyReset() {
  ensureDB();
  const today = dateKeyRome();
  if (global.db.data.__dailyDate !== today) {
    for (const uid in global.db.data.users) {
      if (!global.db.data.users[uid]) global.db.data.users[uid] = {};
      global.db.data.users[uid].messaggiGiornalieri = 0;
    }
    for (const jid in global.db.data.chats) {
      if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {};
      global.db.data.chats[jid].messaggiGiornalieri = 0;
      global.db.data.chats[jid].utenti = {};
    }
    global.processedMessages = new Set();
    global.db.data.__dailyDate = today;
  }
}

async function all(m, { conn }) {
  if (!m?.chat) return;
  if (m.fromMe || (conn?.user && m.sender === conn.user?.jid)) return;

  ensureDailyReset();
  if (!global.processedMessages) global.processedMessages = new Set();
  if (global.processedMessages.has(m.key.id)) return;
  global.processedMessages.add(m.key.id);

  if (global.db.data.excluded?.users?.[m.sender]) return;
  if (global.db.data.excluded?.chats?.[m.chat]) return;

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
  const chat = global.db.data.chats[m.chat];
  chat.messaggiGiornalieri = (chat.messaggiGiornalieri || 0) + 1;

  if (!chat.utenti) chat.utenti = {};
  if (!chat.utenti[m.sender]) chat.utenti[m.sender] = { messaggiGiornalieri: 0 };
  chat.utenti[m.sender].messaggiGiornalieri++;

  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {};
  const user = global.db.data.users[m.sender];
  user.messaggiGiornalieri = (user.messaggiGiornalieri || 0) + 1;
}

const handler = async (m, { conn }) => {
  ensureDailyReset();

  const command = (m.text || '').trim().toLowerCase();

  const allGroups = Object.keys(conn.chats || {})
    .filter(jid => jid.endsWith('@g.us'))
    .filter(jid => !jid.includes('@c.us'));

  if (command === '.topgruppi') {
    let groupsStats = [];

    for (const jid of allGroups) {
      const meta = conn.chats[jid]?.metadata || (await conn.groupMetadata(jid)) || {};
      if (
        global.db.data.excluded?.chats?.[jid] ||
        meta?.isCommunity ||
        meta?.announce ||
        meta?.read_only
      ) continue;
      const chatData = global.db.data.chats[jid] || {};
      const messages = chatData.messaggiGiornalieri || 0;

      let name = 'Nome non disponibile';
      try { name = await conn.getName(jid); } catch {}

      let participants = 0;
      try {
        const meta = conn.chats[jid]?.metadata || (await conn.groupMetadata(jid)) || {};
        participants = (meta.participants || []).length;
      } catch {}

      groupsStats.push({ jid, name, messages, participants });
    }

    groupsStats.sort((a, b) => b.messages - a.messages);
    const top = groupsStats.slice(0, 10);

    const footer = '\n\n> 𝐓𝐨𝐩 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';
    const text = top.length
      ? `🏆 *𝐓𝐨𝐩 𝐠𝐫𝐮𝐩𝐩𝐢* 🏆\n\n` +
        top.map((g, i) => `*${i + 1}.* ${g.name}\n📩 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: *${g.messages}*\n👥 𝐌𝐞𝐦𝐛𝐫𝐢: *${g.participants}*`).join('\n\n') + footer
      : 'Nessun dato disponibile' + footer;

    const buttons = [
      { buttonId: '.toputenti', buttonText: { displayText: '𝐓𝐨𝐩 𝐔𝐭𝐞𝐧𝐭𝐢 🏅' }, type: 1 },
      { buttonId: '.rankuser', buttonText: { displayText: '𝐈𝐥 𝐦𝐢𝐨 𝐫𝐚𝐧𝐤 🙋' }, type: 1 },
      { buttonId: '.rankgruppo', buttonText: { displayText: '𝐑𝐚𝐧𝐤 𝐆𝐫𝐮𝐩𝐩𝐨 📊' }, type: 1 },
    ];

    await conn.sendMessage(m.chat, { text, buttons, headerType: 1 });
    return;
  }

  if (command === '.toputenti') {
    const aggregated = {};
    for (const uid in global.db.data.users) {
      if (global.db.data.excluded?.users?.[uid]) continue;
      const n = global.db.data.users[uid]?.messaggiGiornalieri || 0;
      if (n > 0) aggregated[uid] = n;
    }

    const topUsers = Object.entries(aggregated)
      .map(([jid, messages]) => ({ jid, messages }))
      .sort((a, b) => b.messages - a.messages)
      .slice(0, 10);

    const footer = '\n\n> 𝐓𝐨𝐩 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';
    const text = topUsers.length
      ? `🏅 *𝐓𝐨𝐩 𝐔𝐭𝐞𝐧𝐭𝐢* 🏅\n\n` +
        topUsers.map((u, i) => `*${i + 1}.* @${u.jid.split('@')[0]} ━ 𝐌𝐬𝐠: ${u.messages}`).join('\n') + footer
      : 'Nessun dato disponibile' + footer;

    const buttons = [
      { buttonId: '.topgruppi', buttonText: { displayText: '𝐓𝐨𝐩 𝐆𝐫𝐮𝐩𝐩𝐢 🏆' }, type: 1 },
      { buttonId: '.rankgruppo', buttonText: { displayText: '𝐑𝐚𝐧𝐤 𝐆𝐫𝐮𝐩𝐩𝐨 📊' }, type: 1 },
      { buttonId: '.rankuser', buttonText: { displayText: '𝐈𝐥 𝐦𝐢𝐨 𝐫𝐚𝐧𝐤 🙋' }, type: 1 },
    ];

    await conn.sendMessage(m.chat, {
      text,
      buttons,
      headerType: 1,
      mentions: topUsers.map(u => u.jid)
    });
    return;
  }

  if (command === '.rankgruppo') {
  ensureDailyReset();

  const footer = '\n\n> 𝐓𝐨𝐩 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';
  const allGroups = Object.keys(global.db.data.chats || {})
    .filter(jid => !global.db.data.excluded?.chats?.[jid]);

  const ranking = allGroups
    .map(jid => ({
      jid,
      messages: global.db.data.chats[jid]?.messaggiGiornalieri || 0,
    }))
    .sort((a, b) => b.messages - a.messages);

  const pos = ranking.findIndex(g => g.jid === m.chat) + 1;
  const myMessages = global.db.data.chats[m.chat]?.messaggiGiornalieri || 0;

  let text;
  if (pos) {
    text = `📊 *𝐑𝐚𝐧𝐤 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨* 🏆\n\n` +
           `👥 *${await conn.getName(m.chat)}*\n\n` +
           `𝐏𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: ${pos}° su ${ranking.length}\n` +
           `𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: ${myMessages}` + footer;
  } else {
    text = `📊 𝐐𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 𝐧𝐨𝐧 𝐡𝐚 𝐚𝐧𝐜𝐨𝐫𝐚 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐨𝐠𝐠𝐢!` + footer;
  }

  const buttons = [
    { buttonId: '.topgruppi', buttonText: { displayText: '𝐓𝐨𝐩 𝐆𝐫𝐮𝐩𝐩𝐢 🏆' }, type: 1 },
    { buttonId: '.toputenti', buttonText: { displayText: '𝐓𝐨𝐩 𝐔𝐭𝐞𝐧𝐭𝐢 🏅' }, type: 1 },
    { buttonId: '.rankuser', buttonText: { displayText: '𝐈𝐥 𝐦𝐢𝐨 𝐫𝐚𝐧𝐤 🙋' }, type: 1 },
  ];

  await conn.sendMessage(m.chat, { text, buttons, headerType: 1 });
  return;
}

  if (command === '.rankuser') {
    ensureDailyReset();
    const footer = '\n\n> 𝐓𝐨𝐩 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

    const aggregated = {};
    for (const uid in global.db.data.users) {
      if (global.db.data.excluded?.users?.[uid]) continue;
      const n = global.db.data.users[uid]?.messaggiGiornalieri || 0;
      aggregated[uid] = n;
    }

    const ranking = Object.entries(aggregated)
      .map(([jid, messages]) => ({ jid, messages }))
      .sort((a, b) => b.messages - a.messages);

    const pos = ranking.findIndex(u => u.jid === m.sender) + 1;
const myMessages = aggregated[m.sender] || 0;

let totalMembers = 0;
for (const jid of Object.keys(conn.chats || {}).filter(j => j.endsWith('@g.us'))) {
  try {
    const meta = conn.chats[jid]?.metadata || (await conn.groupMetadata(jid)) || {};
    if (
      global.db.data.excluded?.chats?.[jid] ||
      meta.isCommunity ||
      meta.announce ||
      meta.read_only
    ) continue;

    totalMembers += (meta.participants || []).length;
  } catch {}
}

const text = pos
  ? `🙋 *𝐈𝐥 𝐭𝐮𝐨 𝐫𝐚𝐧𝐤* 🏅\n\n👤 @${m.sender.split('@')[0]}\n\n𝐏𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: ${pos}° su ${totalMembers}\n𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: ${myMessages}` + footer
  : `🙋 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐜𝐨𝐫𝐚 𝐢𝐧𝐯𝐢𝐚𝐭𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐨𝐠𝐠𝐢!` + footer;

    const buttons = [
      { buttonId: '.topgruppi', buttonText: { displayText: '𝐓𝐨𝐩 𝐆𝐫𝐮𝐩𝐩𝐢 🏆' }, type: 1 },
      { buttonId: '.toputenti', buttonText: { displayText: '𝐓𝐨𝐩 𝐔𝐭𝐞𝐧𝐭𝐢 🏅' }, type: 1 },
      { buttonId: '.rankgruppo', buttonText: { displayText: '𝐑𝐚𝐧𝐤 𝐆𝐫𝐮𝐩𝐩𝐨 📊' }, type: 1 },
    ];

    await conn.sendMessage(m.chat, {
      text,
      buttons,
      headerType: 1,
      mentions: [m.sender]
    });
    return;
  }
};

handler.command = /^\.?(topgruppi|toputenti|rankuser)$/i;
handler.group = true;
handler.all = all;

export default handler;