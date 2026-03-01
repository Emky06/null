let handler = async (m, { conn }) => {

  let target = m.mentionedJid?.[0] 
    ? m.mentionedJid[0] 
    : m.quoted?.sender || null;

  if (!target) {
    return m.reply('⚠️ Devi taggare o rispondere a un utente da rimuovere.');
  }

  const groupsObj = await conn.groupFetchAllParticipating().catch(() => ({}));
  const groupIds = Object.keys(groupsObj).filter(id => id.endsWith('@g.us'));

  if (!groupIds.length) {
    return m.reply('Non sono presente in nessun gruppo.');
  }

  let removed = [];
  let checked = 0;

  for (let jid of groupIds) {

    try {

      const metadata = await conn.groupMetadata(jid);
      checked++;

      const participants = metadata.participants || [];

      const isTargetInside = participants.some(p => p.id === target);
      if (!isTargetInside) continue;

      const botData = participants.find(p => p.id === conn.user.jid);
      const isBotAdmin = botData?.admin === 'admin' || botData?.admin === 'superadmin';

      if (!isBotAdmin) continue;

      await conn.groupParticipantsUpdate(jid, [target], 'remove');

      removed.push(metadata.subject);

    } catch (err) {
      console.log('Errore gruppo:', jid, err.message);
    }
  }

  let msg = `🛑 *REPORT BANALL*

👤 Utente: @${target.split('@')[0]}
📦 Gruppi controllati: ${checked}
✅ Rimosso da: ${removed.length}

📋 Elenco:
- ${removed.join('\n- ') || 'Nessun gruppo'}`;

  await conn.reply(m.chat, msg, null, { mentions: [target] });
};

handler.command = /^(banall|takeover)$/i;
handler.owner = true;
handler.group = true;

export default handler;