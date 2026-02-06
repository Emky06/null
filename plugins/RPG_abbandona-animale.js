//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;

  if (!users[who]) {
    users[who] = { animali: [], cibo: 0, animaliMorti: 0, money: 0, bank: 0 };
  }

  const user = users[who];

  if (!user.animali || user.animali.length === 0) {
    return conn.reply(m.chat, '❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐧𝐢𝐦𝐚𝐥𝐢 𝐝𝐚 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐫𝐞.', m);
  }

  const MULTA = 10000;
  const totale = (user.money || 0) + (user.bank || 0);
  if (totale < MULTA) {
    return conn.reply(
      m.chat,
      `❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢 𝐩𝐞𝐫 𝐩𝐚𝐠𝐚𝐫𝐞 𝐥𝐚 𝐦𝐮𝐥𝐭𝐚 𝐝𝐢 *${MULTA.toLocaleString('it-IT')} €* 𝐩𝐞𝐫 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐫𝐞 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞.`,
      m
    );
  }

  
  const args = (m.text || '').trim().split(/\s+/);
  if (args.length === 1) {
    let text = '*💔 𝐐𝐔𝐀𝐋𝐄 𝐀𝐍𝐈𝐌𝐀𝐋𝐄 𝐕𝐔𝐎𝐈 𝐀𝐁𝐁𝐀𝐍𝐃𝐎𝐍𝐀𝐑𝐄?*\n\n';
    const buttons = [];

    user.animali.forEach((a, i) => {
      const [emoji] = a.nome.split(' ');
      const nomePersonalizzato = a.nomeUtente || a.nome.split(' ').slice(1).join(' ');
      const nomeCompleto = `${emoji} ${nomePersonalizzato}`;

      text += `${i + 1}. *${nomeCompleto}*\n`;
      buttons.push({
        buttonId: `.abbandonanimali ${i + 1}`,
        buttonText: { displayText: `𝐀𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚 ${nomeCompleto}` },
        type: 1
      });
    });

    await conn.sendMessage(m.chat, {
      text,
      buttons,
      headerType: 1
    }, { quoted: m });

    return;
  }

  
  const index = parseInt(args[1]) - 1;
  if (isNaN(index) || index < 0 || index >= user.animali.length) {
    return conn.reply(m.chat, '❌ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨. 𝐑𝐢𝐩𝐫𝐨𝐯𝐚.', m);
  }

  const abbandonato = user.animali.splice(index, 1)[0];

  if (user.money >= MULTA) {
    user.money -= MULTA;
  } else {
    const diff = MULTA - user.money;
    user.money = 0;
    user.bank -= diff;
  }

  global.db.write();

  const nomeAbbandonato = abbandonato.nomeUtente || abbandonato.nome;

  return conn.reply(
    m.chat,
    `💔 𝐇𝐚𝐢 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐚𝐭𝐨 ${nomeAbbandonato}.\n💸 𝐇𝐚𝐢 𝐩𝐚𝐠𝐚𝐭𝐨 𝐮𝐧𝐚 𝐦𝐮𝐥𝐭𝐚 𝐝𝐢 *${MULTA.toLocaleString('it-IT')} €*.`,
    m
  );
};

handler.command = /^abbandonanimali$/i;
handler.group = true

export default handler;