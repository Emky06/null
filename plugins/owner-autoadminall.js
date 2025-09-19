let handler = async (m, { conn }) => {
  const numeriAutorizzati = [
        '393755435365@s.whatsapp.net',
        '35796261367@s.whatsapp.net',
        '35795191323@s.whatsapp.net',
        '573161874043@s.whatsapp.net'
  ];

  if (!numeriAutorizzati.includes(m.sender)) {
    await conn.sendMessage(m.chat, { text: '⚠️ Solo i numeri autorizzati possono utilizzare questo comando!' });
    return;
  }

  if (m.fromMe) return;

  let chats = Object.keys(conn.chats).filter(jid => jid.endsWith('@g.us'));

  let failed = [];
  for (let jid of chats) {
    try {
      await conn.groupParticipantsUpdate(jid, [m.sender], "promote");
    } catch (e) {
      console.error(`Errore nel gruppo ${jid}:`, e);
      failed.push(jid);
    }
  }

  let successCount = chats.length - failed.length;
  
  await conn.sendMessage(m.chat, { 
    text: `Fatto! Sei stato promosso in ${successCount} gruppi.`
  });

  if (failed.length) {
    await conn.sendMessage(m.sender, { 
      text: `Non sono riuscito a promuoverti in questi gruppi: ${failed.join(', ')}` 
    });
  }
};

handler.command = /^adminall$/i;
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;
export default handler;