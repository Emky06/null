// Plugin fatto da Axtral_WiZaRd
let confirmation = {};

async function formatNumber(n) {
  return n.toLocaleString('it-IT');
}

let handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender];
  const errore = `❌ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐫𝐫𝐚𝐭𝐨.\n📘 𝐄𝐬𝐞𝐦𝐩𝐢𝐨:\n.bonifico 50 @user\n— oppure —\n.bonifico tutto @user\n— oppure —\n.bonifico 50 (rispondendo a un messaggio)`;

  if (!args[0]) return m.reply(errore);


  let mentionedJid = m.mentionedJid?.[0] || m.quoted?.sender;
  if (!mentionedJid) return m.reply('❌ 𝐃𝐞𝐯𝐞 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐚 𝐜𝐮𝐢 𝐯𝐮𝐨𝐥𝐞 𝐢𝐧𝐯𝐢𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨.');
  if (mentionedJid === m.sender) return m.reply('❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐟𝐚𝐫𝐞 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐚 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.');

  let count;
  if (args[0].toLowerCase() === 'tutto') {
    if (user.money <= 0) return m.reply('❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐬𝐨𝐥𝐝𝐢 𝐝𝐚 𝐢𝐧𝐯𝐢𝐚𝐫𝐞.');
    count = user.money;
  } else {
    count = parseInt(args[0]);
    if (isNaN(count) || count <= 0) return m.reply('❌ 𝐈𝐦𝐩𝐨𝐫𝐭𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.');
    if (user.money < count) return m.reply('❌ 𝐍𝐨𝐧 𝐩𝐨𝐬𝐬𝐢𝐞𝐝𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢 𝐩𝐞𝐫 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨.');
  }

  let confirmText = `🏦 𝐁𝐚𝐧𝐜𝐚: 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚 𝐢𝐥 𝐭𝐫𝐚𝐬𝐟𝐞𝐫𝐢𝐦𝐞𝐧𝐭𝐨 𝐝𝐢 ${await formatNumber(count)} € 𝐚 @${mentionedJid.split('@')[0]} ?`;

  await conn.sendMessage(m.chat, {
    text: confirmText,
    mentions: [mentionedJid, m.sender],
    footer: '💳 𝐂𝐨𝐧𝐟𝐞𝐫𝐦𝐚 𝐢𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐮𝐬𝐚𝐧𝐝𝐨 𝐢 𝐩𝐮𝐥𝐬𝐚𝐧𝐭𝐢:',
    buttons: [
      { buttonId: 'bonifico_si', buttonText: { displayText: '✅ Si' }, type: 1 },
      { buttonId: 'bonifico_no', buttonText: { displayText: '❌ No' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m });

  confirmation[m.sender] = {
    count,
    to: mentionedJid,
    timeout: setTimeout(() => {
      delete confirmation[m.sender];
      conn.sendMessage(m.chat, { text: '⌛ 𝐁𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐨: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚 𝐫𝐢𝐬𝐩𝐨𝐬𝐭𝐚 𝐝𝐚𝐥 𝐭𝐫𝐚𝐬𝐟𝐞𝐫𝐞𝐧𝐭𝐞.' }, { quoted: m });
    }, 60000),
    message: m
  };
};

handler.command = ['bonifico'];
handler.rowner = false;
handler.limit = true;


handler.before = async (m, { conn }) => {
  if (m.isBaileys) return;
  if (!(m.sender in confirmation)) return;

  const text = m.text || m.buttonId;
  if (!text) return;

  let { count, to, timeout, message } = confirmation[m.sender];
  let user = global.db.data.users[m.sender];
  let _user = global.db.data.users[to];

  if (m.id === message.id) return;

  if (text === 'bonifico_no' || /^No|no$/i.test(text)) {
    clearTimeout(timeout);
    delete confirmation[m.sender];
    await conn.sendMessage(m.chat, { text: '❌ 𝐁𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.', mentions: [m.sender] }, { quoted: m });
    return true;
  }

  if (text === 'bonifico_si' || /^Si|si$/i.test(text)) {
    if (user.money < count) {
      clearTimeout(timeout);
      delete confirmation[m.sender];
      await conn.sendMessage(m.chat, { text: '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢 𝐩𝐞𝐫 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨.', mentions: [m.sender] }, { quoted: m });
      return true;
    }

    user.money -= count;
    _user.money += count;

    clearTimeout(timeout);
    delete confirmation[m.sender];

    await conn.sendMessage(m.chat, {
      text: `✔️ 𝐇𝐚𝐢 𝐞𝐟𝐟𝐞𝐭𝐭𝐮𝐚𝐭𝐨 𝐮𝐧 𝐛𝐨𝐧𝐢𝐟𝐢𝐜𝐨 𝐝𝐢 ${await formatNumber(count)} € 𝐚 @${to.split('@')[0]} 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.`,
      mentions: [to, m.sender]
    }, { quoted: m });

    return true;
  }
};

export default handler;
