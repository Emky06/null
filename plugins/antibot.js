let whitelist = [
  '212784607757@s.whatsapp.net',//bot reo
  '393511186531@s.whatsapp.net',//chatfight
  '393396784825@s.whatsapp.net',//andrea gp
  '3508287515@s.whatsapp.net',//riad bot
  '212777075886@s.whatsapp.net',//ange molly
];

function rilevaDispositivoCheck(msgID = '') {
  if (!msgID) return 'sconosciuto';
  if (/^[a-zA-Z]+-[a-fA-F0-9]+$/.test(msgID)) return 'bot';
  if (msgID.startsWith('false_') || msgID.startsWith('true_')) return 'web';
  if (msgID.startsWith('3EB0') && msgID.length === 20 && /^3EB0[A-F0-9]{16}$/.test(msgID)) {
    return 'webbot';
  }

  if (msgID.includes(':')) return 'desktop';
  if (/^[A-F0-9]{32}$/i.test(msgID)) return 'android';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msgID)) return 'ios';
  if (/^[A-Z0-9]{20,25}$/i.test(msgID) && !msgID.startsWith('3EB0')) return 'ios';
  if (msgID.startsWith('3EB0') && msgID.length > 20) return 'android_old';
  if (msgID.startsWith('3EB0')) return 'web';
  return 'sconosciuto';
}

export async function before(m, { conn }) {
  if (!m.isGroup || !m.sender || !m.key?.id) return;

  const msgID = m.key?.id;
  const device = rilevaDispositivoCheck(msgID);

  console.log(`[ANTIBOT DEBUG] ${m.sender} | ID: ${msgID} | DEVICE: ${device}`);

  const sospettiDispositivi = ['bot'];

  if (!sospettiDispositivi.includes(device)) return;

  const metadata = await conn.groupMetadata(m.chat);
  const botNumber = conn.user.jid;
  const autorizzati = [botNumber, metadata.owner, ...whitelist];

  if (autorizzati.includes(m.sender)) return;

  const currentAdmins = metadata.participants.filter(p => p.admin).map(p => p.id);
  const èAdmin = currentAdmins.includes(m.sender);

  if (èAdmin) {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'demote');
    await conn.sendMessage(m.chat, {
      text: `⚠️ @${m.sender.split('@')[0]} *retrocesso*: dispositivo sospetto → *${device.toUpperCase()}*`,
      mentions: [m.sender]
    });
  }

  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  await conn.sendMessage(m.chat, {
    text: `🚫 @${m.sender.split('@')[0]} *espulso automaticamente* (Dispositivo: *${device.toUpperCase()}*)`,
    mentions: [m.sender]
  });
}