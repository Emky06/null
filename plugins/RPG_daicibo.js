//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;

  if (!users[who]) {
    users[who] = { animali: [], cibo: 0 };
    global.db.write();
  }

  const user = users[who];

  if (!user.animali) user.animali = [];
  if (typeof user.cibo !== 'number') user.cibo = 0;

  if (user.animali.length === 0) {
    return conn.sendMessage(m.chat, {
      text: '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐝𝐚 𝐧𝐮𝐭𝐫𝐢𝐫𝐞.',
      buttons: [{ buttonId: '.shopanimali', buttonText: { displayText: '𝐂𝐨𝐦𝐩𝐫𝐚 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 🐾' } }],
      headerType: 1
    }, { quoted: m });
  }

  const now = Date.now();
  const animaliAffamati = user.animali.filter(animale => !animale.prossimaPoppata || animale.prossimaPoppata <= now);

  if (animaliAffamati.length === 0) {
    return conn.sendMessage(m.chat, {
      text: '✅ 𝐈 𝐭𝐮𝐨𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐧𝐨𝐧 𝐡𝐚𝐧𝐧𝐨 𝐚𝐧𝐜𝐨𝐫𝐚 𝐟𝐚𝐦𝐞. ⏳',
      buttons: [{ buttonId: '.animali', buttonText: { displayText: '𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐚 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 🐶' } }],
      headerType: 1
    }, { quoted: m });
  }

  if (user.cibo < animaliAffamati.length) {
    return conn.sendMessage(m.chat, {
      text: `❌ 𝐇𝐚𝐢 𝐬𝐨𝐥𝐨 ${user.cibo} 🥫 𝐦𝐚 ${animaliAffamati.length} 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐡𝐚𝐧𝐧𝐨 𝐟𝐚𝐦𝐞.\n𝐂𝐨𝐦𝐩𝐫𝐚 𝐚𝐥𝐭𝐫𝐨 𝐜𝐢𝐛𝐨 𝐩𝐞𝐫 𝐧𝐮𝐭𝐫𝐢𝐫𝐥𝐢 𝐭𝐮𝐭𝐭𝐢.`,
      buttons: [{ buttonId: '.shopanimali', buttonText: { displayText: '𝐂𝐨𝐦𝐩𝐫𝐚 𝐜𝐢𝐛𝐨 🛒' } }],
      headerType: 1
    }, { quoted: m });
  }

 
  for (const animale of animaliAffamati) {
  animale.prossimaPoppata = now + 8 * 60 * 60 * 1000; 
  animale.lastReminder = false; 
}

  user.cibo -= animaliAffamati.length;
  global.db.write();

  return conn.sendMessage(m.chat, {
    text: `🥫 𝐇𝐚𝐢 𝐧𝐮𝐭𝐫𝐢𝐭𝐨 *${animaliAffamati.length}* animale/i!\n𝐂𝐢𝐛𝐨 𝐫𝐢𝐦𝐚𝐬𝐭𝐨: *${user.cibo}*`,
    buttons: [
      { buttonId: '.animali', buttonText: { displayText: '𝐕𝐞𝐝𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 🐾' } },
      { buttonId: '.shopanimali', buttonText: { displayText: '𝐂𝐨𝐦𝐩𝐫𝐚 𝐚𝐥𝐭𝐫𝐨 𝐜𝐢𝐛𝐨 🛒' } }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = /^daicibo$/i;
handler.group = true

export default handler;