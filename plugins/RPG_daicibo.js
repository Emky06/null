// Plugin fatto da Axtral_WiZaRd
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
    return conn.reply(m.chat, '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐝𝐚 𝐧𝐮𝐭𝐫𝐢𝐫𝐞.', m);
  }

  const now = Date.now();
  const animaliAffamati = user.animali.filter(a =>
    !a.prossimaPoppata || a.prossimaPoppata <= now
  );

  if (animaliAffamati.length === 0) {
    return conn.reply(m.chat, '✅ 𝐈 𝐭𝐮𝐨𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐧𝐨𝐧 𝐡𝐚𝐧𝐧𝐨 𝐟𝐚𝐦𝐞.', m);
  }

  if (user.cibo < 1) {
    return conn.reply(m.chat, '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐜𝐢𝐛𝐨 🥫.', m);
  }

  const args = (m.text || '').trim().split(/\s+/);

  if (args.length === 1) {
    let text = '*🥫 𝐀 𝐜𝐡𝐢 𝐯𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐝𝐚 𝐦𝐚𝐧𝐠𝐢𝐚𝐫𝐞?*\n\n';
    const buttons = [];

    animaliAffamati.forEach(a => {
      const index = user.animali.indexOf(a);
      const [emoji] = a.nome.split(' ');
      const nomePers = a.nomeUtente || a.nome.split(' ').slice(1).join(' ');
      const nomeCompleto = `${emoji} ${nomePers}`;

      text += `• ${nomeCompleto}\n`;
      buttons.push({
        buttonId: `.daicibo ${index + 1}`,
        buttonText: { displayText: `🥫 ${nomeCompleto}` },
        type: 1
      });
    });

    if (user.cibo >= animaliAffamati.length) {
      buttons.push({
        buttonId: `.daicibo all`,
        buttonText: { displayText: '🍽️ 𝐃𝐚𝐢 𝐜𝐢𝐛𝐨 𝐚 𝐭𝐮𝐭𝐭𝐢' },
        type: 1
      });
    }

    return conn.sendMessage(m.chat, {
      text,
      buttons,
      headerType: 1
    }, { quoted: m });
  }

  if (args[1] === 'all') {
    if (user.cibo < animaliAffamati.length) {
      return conn.reply(m.chat, '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐜𝐢𝐛𝐨.', m);
    }

    animaliAffamati.forEach(a => {
      a.prossimaPoppata = now + 8 * 60 * 60 * 1000;
      a.lastReminder = false;
    });

    user.cibo -= animaliAffamati.length;
    global.db.write();

    return conn.reply(
      m.chat,
      `🍽️ 𝐇𝐚𝐢 𝐧𝐮𝐭𝐫𝐢𝐭𝐨 *${animaliAffamati.length}* 𝐚𝐧𝐢𝐦𝐚𝐥𝐢!\n🥫 𝐂𝐢𝐛𝐨 𝐫𝐢𝐦𝐚𝐬𝐭𝐨: *${user.cibo}*`,
      m
    );
  }

  const index = parseInt(args[1]) - 1;
  if (isNaN(index) || index < 0 || index >= user.animali.length) {
    return conn.reply(m.chat, '❌ 𝐀𝐧𝐢𝐦𝐚𝐥𝐞 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨.', m);
  }

  const animale = user.animali[index];
  if (animale.prossimaPoppata && animale.prossimaPoppata > now) {
    return conn.reply(m.chat, '⏳ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐟𝐚𝐦𝐞.', m);
  }

  animale.prossimaPoppata = now + 8 * 60 * 60 * 1000;
  animale.lastReminder = false;
  user.cibo -= 1;

  global.db.write();

  const nome = animale.nomeUtente || animale.nome;

  return conn.reply(
    m.chat,
    `🥫 𝐇𝐚𝐢 𝐝𝐚𝐭𝐨 𝐝𝐚 𝐦𝐚𝐧𝐠𝐢𝐚𝐫𝐞 𝐚 *${nome}*.\n🥫 𝐂𝐢𝐛𝐨 𝐫𝐢𝐦𝐚𝐬𝐭𝐨: *${user.cibo}*`,
    m
  );
};

handler.command = /^daicibo$/i;
handler.group = true;

export default handler;