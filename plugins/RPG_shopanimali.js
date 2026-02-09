//Plugin fatto da Axtral_WiZaRd
import { animaliShop } from './animali.js';

const confirmationAcquistoAnimale = {};

const handler = async (m, { conn }) => {
  const who = m.sender;
  const users = global.db.data.users;
  if (!users[who]) users[who] = { animali: [], cibo: 0, animaliMorti: 0 };
  const user = users[who];

  const animali = animaliShop;

  const text = (m.text || '').trim();
  const args = text.split(/\s+/);

  if (args.length === 1) {
    let reply = '*🐾 𝐏𝐄𝐓 𝐒𝐇𝐎𝐏 🐾*\n\n𝐒𝐜𝐞𝐠𝐥𝐢 𝐜𝐨𝐬𝐚 𝐯𝐮𝐨𝐢 𝐚𝐜𝐪𝐮𝐢𝐬𝐭𝐚𝐫𝐞:\n\n';
    animali.forEach((a, i) => {
      reply += `${i + 1}. ${a.nome} – *${a.prezzo.toLocaleString('it-IT')} €*\n`;
    });

    const buttons = animali.map((a, i) => ({
      buttonId: `.petshop ${i + 1}`,
      buttonText: { displayText: `𝐂𝐨𝐦𝐩𝐫𝐚 ${a.nome}` }
    }));

    await conn.sendMessage(m.chat, {
      text: reply,
      buttons,
      headerType: 1
    }, { quoted: m });

    confirmationAcquistoAnimale[who] = setTimeout(() => {
      delete confirmationAcquistoAnimale[who];
    }, 60000);

    return;
  }

  if (!(who in confirmationAcquistoAnimale)) {
    return conn.reply(m.chat, '❌ 𝐃𝐞𝐯𝐢 𝐩𝐫𝐢𝐦𝐚 𝐚𝐩𝐫𝐢𝐫𝐞 𝐢𝐥 𝐦𝐞𝐧𝐮 𝐜𝐨𝐧 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 .petshop', m);
  }

  const scelta = parseInt(args[1]);
  if (!scelta || scelta < 1 || scelta > animali.length) {
    return conn.reply(m.chat, '❌ 𝐒𝐜𝐞𝐥𝐭𝐚 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚. 𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐯𝐚𝐥𝐢𝐝𝐨.', m);
  }

  const selezionato = animali[scelta - 1];
  const totaleSoldi = (user.money || 0) + (user.bank || 0);

  if (totaleSoldi < selezionato.prezzo) {
    return conn.reply(
      m.chat,
      `❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐚𝐛𝐛𝐚𝐬𝐭𝐚𝐧𝐳𝐚 𝐬𝐨𝐥𝐝𝐢 𝐩𝐞𝐫 𝐜𝐨𝐦𝐩𝐫𝐚𝐫𝐞 ${selezionato.nome}.\n𝐏𝐫𝐞𝐳𝐳𝐨: *${selezionato.prezzo.toLocaleString('it-IT')} €*\n𝐒𝐚𝐥𝐝𝐨 𝐭𝐨𝐭𝐚𝐥𝐞: *${totaleSoldi.toLocaleString('it-IT')} €*`,
      m
    );
  }

  if (user.money >= selezionato.prezzo) {
    user.money -= selezionato.prezzo;
  } else {
    const diff = selezionato.prezzo - user.money;
    user.money = 0;
    user.bank -= diff;
  }

  if (!user.animali) user.animali = [];
  if (typeof user.cibo !== 'number') user.cibo = 0;

  if (selezionato.tipo === 'cibo') {
  const qta = selezionato.quantita || 1;
  user.cibo += qta;

  global.db.write();

  return conn.reply(
    m.chat,
    `🥫 𝐇𝐚𝐢 𝐜𝐨𝐦𝐩𝐫𝐚𝐭𝐨 *${qta}* 𝐮𝐧𝐢𝐭𝐚̀ 𝐝𝐢 𝐜𝐢𝐛𝐨 𝐩𝐞𝐫 *${selezionato.prezzo.toLocaleString('it-IT')} €*.`,
    m
  );
}

 
  user.animali.push({
    nome: selezionato.nome,
    adottato: Date.now(),
    prossimaPoppata: Date.now() + 8 * 60 * 60 * 1000,
    chatId: m.chat
  });

  global.db.write();

  return conn.reply(
    m.chat,
    `✅ 𝐇𝐚𝐢 𝐚𝐜𝐪𝐮𝐢𝐬𝐭𝐚𝐭𝐨 ${selezionato.nome} 𝐩𝐞𝐫 *${selezionato.prezzo.toLocaleString('it-IT')} €*!\n𝐑𝐢𝐜𝐨𝐫𝐝𝐚 𝐝𝐢 𝐝𝐚𝐫𝐠𝐥𝐢 𝐝𝐚 𝐦𝐚𝐧𝐠𝐢𝐚𝐫𝐞 𝐜𝐨𝐧 *.daicibo* 𝐨𝐠𝐧𝐢 𝟖 𝐨𝐫𝐞.`,
    m
  );
};

handler.command = /^petshop$/i;
handler.group = true

export default handler;