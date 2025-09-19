const adoptions = {};

const handler = async (m, { conn, command, usedPrefix, args }) => {
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!Array.isArray(user.figli)) user.figli = [];

  if (command === 'adotta') {
    const mention = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!mention) throw `Tagga la persona da adottare!\nEsempio: ${usedPrefix}adotta @utente`;
    if (mention === m.sender) throw 'Non puoi adottare te stesso!';

    const target = users[mention];
    if (!target) throw 'Utente non trovato nel database.';
    if (!Array.isArray(target.genitori)) target.genitori = [];

    if (target.genitori.length > 0) {
      return m.reply(`@${mention.split('@')[0]} è già stato adottato/a.`, null, {
        mentions: [mention]
      });
    }

    if (adoptions[m.sender] || adoptions[mention]) {
      return m.reply('C\'è già una proposta di adozione in corso.');
    }

    adoptions[mention] = { from: m.sender, timeout: null };
    adoptions[m.sender] = { to: mention, timeout: null };

    const testo = `👶🏾 𝐑𝐈𝐂𝐇𝐈𝐄𝐒𝐓𝐀 𝐃𝐈 𝐀𝐃𝐎𝐙𝐈𝐎𝐍𝐄:
@${mention.split('@')[0]}, vuoi essere adottato/a da @${m.sender.split('@')[0]}?

Hai 60 secondi per rispondere.`;

    const buttons = [
      {
        buttonId: 'adopt_yes',
        buttonText: { displayText: '✅ Si' },
        type: 1
      },
      {
        buttonId: 'adopt_no',
        buttonText: { displayText: '❌ No' },
        type: 1
      }
    ];

    await conn.sendMessage(m.chat, {
      text: testo,
      mentions: [mention, m.sender],
      buttons,
      headerType: 1
    }, { quoted: m });

    const timeout = setTimeout(() => {
      conn.sendMessage(m.chat, {
        text: `⏱️ Proposta di adozione scaduta.`,
        mentions: [mention, m.sender]
      });
      delete adoptions[mention];
      delete adoptions[m.sender];
    }, 60000);

    adoptions[mention].timeout = timeout;
    adoptions[m.sender].timeout = timeout;
  }

  if (command === 'abbandona') {
    if (!Array.isArray(user.figli) || user.figli.length === 0) {
      return m.reply('Non hai figli da abbandonare.');
    }

    if (args[0]?.toLowerCase() === 'tutti') {
      const figliMen = user.figli.map(jid => "@" + jid.split("@")[0]).join('\n');
      m.reply(`Hai abbandonato tutti i tuoi figli:\n${figliMen}`, null, {
        mentions: user.figli
      });

      for (const jid of user.figli) {
        const figlio = users[jid];
        if (!figlio) continue;

        if (!Array.isArray(figlio.genitori)) figlio.genitori = [];

        // Rimuovi genitore e coniuge dai genitori del figlio
        figlio.genitori = figlio.genitori.filter(g => g !== m.sender && g !== user.coniuge);

        // Rimuovi il figlio anche dal coniuge
        if (user.sposato && user.coniuge) {
          const coniuge = users[user.coniuge];
          if (Array.isArray(coniuge?.figli)) {
            coniuge.figli = coniuge.figli.filter(j => j !== jid);
          }
        }
      }

      user.figli = [];
      return;
    }

    const mention = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!mention) return m.reply(`Tagga il figlio che vuoi abbandonare o usa *${usedPrefix}abbandona tutti*.`);

    if (!user.figli.includes(mention)) {
      return m.reply('Quella persona non è tuo figlio!');
    }

    user.figli = user.figli.filter(jid => jid !== mention);

    const figlio = users[mention];
    if (figlio) {
      if (!Array.isArray(figlio.genitori)) figlio.genitori = [];
      figlio.genitori = figlio.genitori.filter(g => g !== m.sender && g !== user.coniuge);
    }

    if (user.sposato && user.coniuge) {
      const coniuge = users[user.coniuge];
      if (Array.isArray(coniuge?.figli)) {
        coniuge.figli = coniuge.figli.filter(jid => jid !== mention);
      }
    }

    return m.reply(`Hai abbandonato @${mention.split('@')[0]}.`, null, {
      mentions: [mention]
    });
  }
};

handler.before = async (m, { conn }) => {
  if (!m.message || !m.message.buttonsResponseMessage) return;

  const response = m.message.buttonsResponseMessage.selectedButtonId;
  const user = global.db.data.users[m.sender];

  if (!adoptions[m.sender]) return;

  const from = adoptions[m.sender].from;
  const adopter = global.db.data.users[from];
  const adoptee = user;

  clearTimeout(adoptions[m.sender]?.timeout);
  clearTimeout(adoptions[from]?.timeout);

  if (response === 'adopt_no') {
    delete adoptions[m.sender];
    delete adoptions[from];
    return conn.sendMessage(m.chat, {
      text: '❌ Proposta di adozione rifiutata.',
      mentions: [m.sender, from]
    });
  }

  if (response === 'adopt_yes') {
    if (!Array.isArray(adopter.figli)) adopter.figli = [];
    if (!adopter.figli.includes(m.sender)) adopter.figli.push(m.sender);

    if (!Array.isArray(adoptee.genitori)) adoptee.genitori = [];
    if (!adoptee.genitori.includes(from)) adoptee.genitori.push(from);

    // Se chi adotta è sposato, anche il coniuge eredita il figlio
    if (adopter.sposato && adopter.coniuge && adopter.coniuge !== m.sender) {
      const coniuge = global.db.data.users[adopter.coniuge];
      if (!Array.isArray(coniuge.figli)) coniuge.figli = [];
      if (!coniuge.figli.includes(m.sender)) {
        coniuge.figli.push(m.sender);
      }

      // Anche il coniuge diventa genitore
      if (!adoptee.genitori.includes(adopter.coniuge)) {
        adoptee.genitori.push(adopter.coniuge);
      }
    }

    delete adoptions[m.sender];
    delete adoptions[from];

    return conn.sendMessage(m.chat, {
      text: `✅ Adozione completata!\n@${m.sender.split('@')[0]} è stato adottato da @${from.split('@')[0]}.`,
      mentions: [m.sender, from]
    });
  }
};

handler.command = ['adotta', 'abbandona'];
handler.group = true;

export default handler;