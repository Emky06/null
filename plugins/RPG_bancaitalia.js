const handler = async (m, { conn, participants }) => {
  const users = global.db.data.users;
  
  let lista_utenti = participants.map(u => {
    let user = users[u.id] || { money: 0, bank: 0, truffe: 0 };
    return {
      id: u.id,
      money: user.money || 0,
      bank: user.bank || 0,
      truffe: user.truffe || 0
    };
  });

  // Ordina per somma totale di soldi (contanti + banca)
  lista_utenti.sort((a, b) => (b.money + b.bank) - (a.money + a.bank));

  let testo = "\n𝐒𝐀𝐋𝐃𝐈 𝐆𝐑𝐔𝐏𝐏𝐎 💰\n════════ ೋೋ════════\n";
  let menzioni = [];

  lista_utenti.forEach(user => {
    let numero = user.id.split("@")[0];
    let totale = user.money + user.bank;
    testo += `👤 @${numero}\n💵 Contanti: ${user.money.toLocaleString('it-IT')} €\n🏦 Banca: ${user.bank.toLocaleString('it-IT')} €\n📊 Totale: ${totale.toLocaleString('it-IT')} €\n════════ ೋೋ════════\n`;
    menzioni.push(user.id);
  });

  let messaggio = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        displayName: `𝐁𝕀𝐋𝚲𝐍𝐂𝕀Ꮻ 𝐆𝐑𝐔𝐏𝐏𝕆`,
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  conn.reply(m.chat, testo, messaggio, { mentions: menzioni });
};

handler.command = /^soldigruppo|bilancio/i;

export default handler;