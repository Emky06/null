let lastRemind = {};

setInterval(async () => {
  const users = global.db.data.users;
  const now = Date.now();

  for (const userId in users) {
    const user = users[userId];

    if (!user.animali || user.animali.length === 0) continue;

    for (const animale of user.animali) {
      const nomeVisuale = animale.nomeUtente || animale.nome;
      const scaduto = animale.prossimaPoppata <= now;
      const key = `${userId}-${nomeVisuale}`;

      if (scaduto && !lastRemind[key]) {
        lastRemind[key] = true;

        // trova gruppo dove inviare (puoi settare uno specifico chat ID se vuoi)
        const groupId = user.chatGroup || user.chat || null;
        if (!groupId) continue; // se non si sa dove inviare, salta

        await conn.sendMessage(groupId, {
          text: `🔔 *Promemoria per ${nomeVisuale}*\n@${userId.split('@')[0]} il tuo animale ha fame!\nDagli da mangiare con *.daicibo* 🥫`,
          mentions: [userId]
        });
      }

      if (!scaduto && lastRemind[key]) {
        delete lastRemind[key];
      }
    }
  }
}, 5 * 60 * 1000); // ogni 5 minuti

export {};