const handler = async (m, { conn, command, text, args }) => {
  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : m.quoted);
  const who = mention || m.sender;
  const users = global.db.data.users;
  const user = users[who];

  // Formatta numeri con separatore di migliaia
  const formatNumber = (n) => n.toLocaleString('it-IT');

  const contanti = user.money !== undefined ? `${formatNumber(user.money)} €` : 'Sei povero';
  const banca = user.bank !== undefined ? `${formatNumber(user.bank)} €` : 'Nessun conto bancario';
  const totale = formatNumber((user.money || 0) + (user.bank || 0));

  const prova = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        displayName: `𝐁𝕀𝐋𝚲𝐍𝐂𝕀Ꮻ`,
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${who.split`@`[0]}:${who.split`@`[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  const testo = `\n*𝐏𝐎𝐑𝐓𝐀𝐅𝐎𝐆𝐋𝐈𝐎 👛*\n═══════ ೋೋ═══════
💵 *Contanti:* ${contanti}
🏦 *Banca:* ${banca}
🧾 *Totale:* ${totale} €
═══════ ೋೋ═══════`;

  conn.reply(m.chat, testo, prova);

  global.db.write(); // Salva i dati aggiornati nel database
};

handler.command = /^portafoglio|budget|soldi|tasca|cash$/i;

export default handler;