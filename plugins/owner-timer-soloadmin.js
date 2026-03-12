//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, args }) => {
  const chat = global.db.data.chats[m.chat];
  if (!chat) global.db.data.chats[m.chat] = {};

  if (command === 'timer' && !isOwner(m.sender)) {
    return conn.reply(m.chat, '⚠️ Solo il proprietario del bot può usare questo comando.', m);
  }

  if (command === 'timer') {
    if (!args[0]) {
      return conn.reply(m.chat, '⏱️ Usa il comando così: *.timer 8:30-12:15 14:00-18:45* oppure *.timer off*.', m);
    }

    if (args[0].toLowerCase() === 'off') {
      if (chat.timer) {
        delete chat.timer;
        return conn.reply(m.chat, '🛑 Timer disattivato per questo gruppo.', m);
      } else {
        return conn.reply(m.chat, '⚠️ Nessun timer era attivo per questo gruppo.', m);
      }
    }

    let intervals = args.map(arg => {
      if (!arg.includes('-')) return null;

      let [start, end] = arg.split('-');
      let [sh, sm = 0] = start.split(':').map(n => parseInt(n));
      let [eh, em = 0] = end.split(':').map(n => parseInt(n));

      if (
        [sh, sm, eh, em].some(n => isNaN(n)) ||
        sh < 0 || sh > 23 || eh < 0 || eh > 23 ||
        sm < 0 || sm > 59 || em < 0 || em > 59 ||
        (sh * 60 + sm) >= (eh * 60 + em)
      ) {
        return null;
      }

      return {
        start: sh * 60 + sm,
        end: eh * 60 + em,
        startText: `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`,
        endText: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
      };
    });

    if (intervals.includes(null)) {
      return conn.reply(m.chat, '❌ Uno o più orari non sono validi. Usa ad esempio: *.timer 8:30-12:15 14:00-18:45*', m);
    }

    intervals.sort((a, b) => a.start - b.start);

    const alreadySet = !!chat.timer;
    chat.timer = intervals;

    const timerText = intervals.map(i => `🕒 *${i.startText} - ${i.endText}*`).join('\n');
    return conn.reply(
      m.chat,
      alreadySet
        ? `🔄 Timer aggiornato:\n\n${timerText}`
        : `⏳ Timer impostato:\n\n${timerText}`,
      m
    );
  }

  if (command === 'viewtimer') {
    if (!chat.timer) return conn.reply(m.chat, '❌ Nessun timer attivo per questo gruppo.', m);

    const timerText = chat.timer
      .slice()
      .sort((a, b) => a.start - b.start)
      .map(i => `🕒 *${i.startText} - ${i.endText}*`)
      .join('\n');

    return await conn.sendMessage(m.chat, {
      text: `⏰ Timer attivo:\n\n${timerText}\n\nDurante questi intervalli *solostaff sarà disattivato automaticamente* e *riattivato fuori orario*.`,
      footer: '🔴 Solo il proprietario può disattivare il timer.',
      buttons: [
        { buttonId: '.timer off', buttonText: { displayText: '🔴 Disattiva Timer' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m });
  }
};

handler.command = ['timer', 'viewtimer'];
handler.tags = ['group'];
handler.group = true;
handler.owner = false;

export default handler;

function isOwner(sender) {
  const number = sender.split('@')[0];
  const botNumber = global.conn.user.id.split(':')[0]; // ottiene il numero del bot

  return number === botNumber || global.owner.some(owner => owner[0] === number);
}

setInterval(() => {
  let now = new Date();
  let currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let chatId in global.db.data.chats) {
    let chat = global.db.data.chats[chatId];
    if (!chat || !chat.timer) continue;

    let insideAnyInterval = chat.timer.some(({ start, end }) => currentMinutes >= start && currentMinutes < end);

    if (insideAnyInterval) {
      if (chat.solostaff !== false) {
        chat.solostaff = false;
        global.conn.sendMessage(chatId, {
          text: '🔴 *solostaff disattivato.* I membri ora possono usare i comandi. \n> Vietato spam di comandi🚫',
        });
      }
    } else {
      if (chat.solostaff !== true) {
        chat.solostaff = true;
        global.conn.sendMessage(chatId, {
          text: '🟢 *solostaff attivato.* Solo gli admin possono usare i comandi.',
        });
      }
    }
  }
}, 60 * 1000);