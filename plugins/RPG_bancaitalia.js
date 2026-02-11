const handler = async (m, { conn, participants }) => {
  if (!m.isGroup) return;

  const users = global.db.data.users || {};

  let lista_utenti = participants.map(p => {
    let jid = p.jid;
    let user = users[jid] || { money: 0, bank: 0, truffe: 0 };

    return {
      id: jid,
      money: user.money || 0,
      bank: user.bank || 0,
      truffe: user.truffe || 0
    };
  });

  lista_utenti.sort((a, b) => (b.money + b.bank) - (a.money + a.bank));

  let testo = "\n𝐒𝐀𝐋𝐃𝐈 𝐆𝐑𝐔𝐏𝐏𝐎 💰\n════════ ೋೋ════════\n";
  let menzioni = [];

  lista_utenti.forEach(user => {
    let numero = user.id.split("@")[0];
    let totale = user.money + user.bank;

    testo += `👤 @${numero}
💵 Contanti: ${user.money.toLocaleString('it-IT')} €
🏦 Banca: ${user.bank.toLocaleString('it-IT')} €
📊 Totale: ${totale.toLocaleString('it-IT')} €
════════ ೋೋ════════
`;

    menzioni.push(user.id);
  });

  let messaggio = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        displayName: `𝐁𝕀𝐋𝚲𝐍𝐂𝕀Ꮻ 𝐆𝐑𝐔𝐏𝐏𝕆`,
        vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  await conn.reply(m.chat, testo, messaggio, { mentions: menzioni });
};

handler.command = /^soldigruppo|bilancio/i;
handler.group = true;

export default handler;