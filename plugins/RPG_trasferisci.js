const confirmation = {};

function formatNumber(n) {
  return n.toLocaleString('it-IT');
}

async function handler(m, { conn, args, usedPrefix, command }) {
  if (confirmation[m.sender])
    return conn.sendMessage(
      m.chat,
      {
        text: '❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐫𝐞 𝐮𝐧 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐦𝐞𝐧𝐭𝐫𝐞 𝐧𝐞 𝐡𝐚𝐢 𝐮𝐧 𝐚𝐥𝐭𝐫𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨.',
        mentions: [m.sender],
      },
      { quoted: m }
    );

  const user = global.db.data.users[m.sender];
  const lol = `❌ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐫𝐫𝐚𝐭𝐨. 𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix + command} 50 @${m.sender
    .split('@')[0]
    .trim()}`;

  // Se args[0 è "tutto", allora trasferiamo tutti i soldi, altrimenti numero specificato
  const count =
    args[0] && args[0].toLowerCase() === 'tutto'
      ? user.money * 1
      : Math.min(
          Number.MAX_SAFE_INTEGER,
          Math.max(1, isNumber(args[0]) ? parseInt(args[0]) : 1)
        );

  if (count <= 0)
    return conn.sendMessage(
      m.chat,
      { text: lol, mentions: [m.sender] },
      { quoted: m }
    );

  const who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : args[1]
      ? args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net'
      : '';

  if (!who)
    return conn.sendMessage(
      m.chat,
      {
        text: '❌ 𝐃𝐞𝐯𝐞 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐚𝐥𝐥𝐚 𝐪𝐮𝐚𝐥𝐞 𝐯𝐮𝐨𝐥𝐞 𝐢𝐧𝐯𝐢𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨.',
        mentions: [m.sender],
      },
      { quoted: m }
    );
  if (!(who in global.db.data.users))
    return conn.sendMessage(
      m.chat,
      {
        text: `❌ 𝐋'𝐮𝐭𝐞𝐧𝐭𝐞 ${who} 𝐧𝐨𝐧 𝐞' 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.`,
        mentions: [m.sender],
      },
      { quoted: m }
    );
  if (who === m.sender)
    return conn.sendMessage(
      m.chat,
      {
        text: '❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐟𝐚𝐫𝐞 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐚 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.',
        mentions: [m.sender],
      },
      { quoted: m }
    );
  if (user.money * 1 < count)
    return conn.sendMessage(
      m.chat,
      {
        text:
          '❌ 𝐍𝐨𝐧 𝐩𝐨𝐬𝐬𝐢𝐞𝐝𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢 𝐩𝐞𝐫 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨.',
        mentions: [m.sender],
      },
      { quoted: m }
    );
  if (count === 0)
    return conn.sendMessage(
      m.chat,
      {
        text: '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐬𝐨𝐥𝐝𝐢 𝐝𝐚 𝐭𝐫𝐚𝐬𝐟𝐞𝐫𝐢𝐫𝐞.',
        mentions: [m.sender],
      },
      { quoted: m }
    );

  const confirm = `𝐒𝐚𝐥𝐯𝐞 𝐪𝐮𝐢 è 𝐥𝐚 𝐛𝐚𝐧𝐜𝐚, 𝐥𝐞 𝐜𝐡𝐢𝐞𝐝𝐢𝐚𝐦𝐨 𝐥𝐚 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚 𝐩𝐞𝐫 𝐢𝐥 𝐭𝐫𝐚𝐬𝐟𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐨 𝐝𝐢 ${formatNumber(
    count
  )} € 𝐚 @${(who || '').replace(/@s\.whatsapp\.net/g, '')}

𝐇𝐚 𝟔𝟎 𝐬𝐞𝐜𝐨𝐧𝐝𝐢 𝐩𝐞𝐫 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚𝐫𝐞 𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐫𝐞 𝐢𝐥 𝐭𝐫𝐚𝐬𝐟𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐨 𝐮𝐬𝐚𝐧𝐝𝐨 𝐪𝐮𝐞𝐬𝐭𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢:

𝐬𝐢 (𝐩𝐞𝐫 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚𝐫𝐞)
𝐧𝐨 (𝐩𝐞𝐫 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐫𝐞)`.trim();

  await conn.sendMessage(m.chat, { text: confirm, mentions: [who] }, { quoted: m });

  confirmation[m.sender] = {
    sender: m.sender,
    to: who,
    message: m,
    count,
    timeout: setTimeout(() => {
      conn.sendMessage(
        m.chat,
        {
          text:
            '❌ 𝐀𝐧𝐧𝐮𝐥𝐥𝐚𝐦𝐞𝐧𝐭𝐨 𝐚𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐨 𝐝𝐞𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐩𝐞𝐫 𝐥𝐚 𝐦𝐚𝐧𝐜𝐚𝐭𝐚 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚.',
          mentions: [m.sender],
        },
        { quoted: m }
      );
      delete confirmation[m.sender];
    }, 60 * 1000),
  };
}

handler.before = async (m) => {
  if (m.isBaileys) return;
  if (!(m.sender in confirmation)) return;
  if (!m.text) return;

  const { timeout, sender, message, to, count } = confirmation[m.sender];
  if (m.id === message.id) return;

  const user = global.db.data.users[sender];
  const _user = global.db.data.users[to];

  if (/^No|no$/i.test(m.text)) {
    clearTimeout(timeout);
    delete confirmation[sender];
    return conn.sendMessage(
      m.chat,
      {
        text: '❌ 𝐁𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.',
        mentions: [m.sender],
      },
      { quoted: m }
    );
  }

  if (/^Si|si$/i.test(m.text)) {
    const previous = user.money * 1;
    const _previous = _user.money * 1;

    user.money -= count * 1;
    _user.money += count * 1;

    if (previous > user.money * 1 && _previous < _user.money * 1) {
      conn.sendMessage(
        m.chat,
        {
          text: `✔️ 𝐇𝐚𝐢 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐭𝐨 𝐮𝐧 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐝𝐢 *${formatNumber(
            count
          )}* € 𝐚 @${(to || '').replace(/@s\.whatsapp\.net/g, '')} 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.`,
          mentions: [to],
        },
        { quoted: m }
      );
    } else {
      user.money = previous;
      _user.money = _previous;
      conn.sendMessage(
        m.chat,
        {
          text: `❌ 𝐍𝐨𝐧 è 𝐬𝐭𝐚𝐭𝐨 𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐫𝐞 𝐮𝐧 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐚 @${(to || '').replace(
            /@s\.whatsapp\.net/g,
            ''
          )} 𝐫𝐢𝐩𝐫𝐨𝐯𝐚.`,
          mentions: [to],
        },
        { quoted: m }
      );
    }

    clearTimeout(timeout);
    delete confirmation[sender];
  }
};

handler.command = ['bonific'];
handler.disable = false;
export default handler;

function isNumber(x) {
  return !isNaN(x);
}