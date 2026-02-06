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
      text: '❌ Non hai animali da nutrire.',
      buttons: [{ buttonId: '.shopanimali', buttonText: { displayText: 'Compra un animale 🐾' } }],
      headerType: 1
    }, { quoted: m });
  }

  const now = Date.now();
  const animaliAffamati = user.animali.filter(animale => !animale.prossimaPoppata || animale.prossimaPoppata <= now);

  if (animaliAffamati.length === 0) {
    return conn.sendMessage(m.chat, {
      text: '✅ I tuoi animali non hanno ancora fame. ⏳',
      buttons: [{ buttonId: '.animali', buttonText: { displayText: 'Controlla animali 🐶' } }],
      headerType: 1
    }, { quoted: m });
  }

  if (user.cibo < animaliAffamati.length) {
    return conn.sendMessage(m.chat, {
      text: `❌ Hai solo ${user.cibo} 🥫 ma ${animaliAffamati.length} animali hanno fame.\nCompra altro cibo per nutrirli tutti.`,
      buttons: [{ buttonId: '.shopanimali', buttonText: { displayText: 'Compra cibo 🛒' } }],
      headerType: 1
    }, { quoted: m });
  }

 
  for (const animale of animaliAffamati) {
  animale.prossimaPoppata = now + 5 * 60 * 60 * 1000; 
  animale.lastReminder = false; 
}

  user.cibo -= animaliAffamati.length;
  global.db.write();

  return conn.sendMessage(m.chat, {
    text: `🥫 Hai nutrito *${animaliAffamati.length}* animale/i!\nCibo rimasto: *${user.cibo}*`,
    buttons: [
      { buttonId: '.animali', buttonText: { displayText: 'Vedi animali 🐾' } },
      { buttonId: '.shopanimali', buttonText: { displayText: 'Compra altro cibo 🛒' } }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = /^daicibo$/i;
handler.exp = 0;
export default handler;