//Plugin fatto da Axtral_WiZaRd
let handler = async function (m, ctx = {}) {
  const conn = ctx.conn || this?.conn || this;
  if (!conn) return m.reply('❌ 𝐂𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐧𝐨𝐧 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞.');
  if (!m.isGroup) return;

  if (typeof conn.groupRequestParticipantsList !== 'function') 
    return m.reply('❌ 𝐀𝐏𝐈 𝐧𝐨𝐧 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞: groupRequestParticipantsList');

  let pending = [];
  try {
    const res = await conn.groupRequestParticipantsList(m.chat);
    
    if (res && Array.isArray(res)) {
      pending = res;
    } else {
      pending = [];
    }
    
  } catch (e) {
    console.error('Errore fetching requests:', e);
    return m.reply('❌ 𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐫𝐞𝐜𝐮𝐩𝐞𝐫𝐚𝐫𝐞 𝐥𝐞 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞.');
  }

  if (!pending || pending.length === 0) {
    return m.reply("✅ 𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 𝐢𝐧 𝐬𝐨𝐬𝐩𝐞𝐬𝐨.");
  }

  pending.sort((a, b) => {
    const timeA = parseInt(a.request_time) || 0;
    const timeB = parseInt(b.request_time) || 0;
    return timeB - timeA;
  });

  const latestDate = new Date(parseInt(pending[0]?.request_time) * 1000);
  const formattedDate = latestDate.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  await m.reply(`📊 *𝐑𝐢𝐞𝐩𝐢𝐥𝐨𝐠𝐨 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞:*\n\n𝐓𝐨𝐭𝐚𝐥𝐞: ${pending.length} 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 𝐢𝐧 𝐬𝐨𝐬𝐩𝐞𝐬𝐨\n𝐏𝐢𝐮̀ 𝐫𝐞𝐜𝐞𝐧𝐭𝐞: ${formattedDate}\n\n𝐈𝐧𝐯𝐢𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...`);

  const allContacts = [];
  
  for (let i = 0; i < pending.length; i++) {
    const p = pending[i];
    
    let number = '';
    if (p.phone_number) {
      number = p.phone_number.split('@')[0];
    } else if (p.jid) {
      number = p.jid.split('@')[0];
    }
    
    if (!number) continue;
    
    const name = `𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 ${i + 1}`;
    
    allContacts.push({
      displayName: name,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;waid=${number}:${number}\nEND:VCARD`
    });
  }
  
  if (allContacts.length === 0) {
    return m.reply("❌ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐯𝐚𝐥𝐢𝐝𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.");
  }

  const BATCH_SIZE = 255;
  
  for (let i = 0; i < allContacts.length; i += BATCH_SIZE) {
    const batch = allContacts.slice(i, i + BATCH_SIZE);
    
    try {
      await conn.sendMessage(m.chat, { 
        contacts: {
          displayName: `📋 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 𝐢𝐧 𝐬𝐨𝐬𝐩𝐞𝐬𝐨 (${i+1}-${Math.min(i+BATCH_SIZE, allContacts.length)} 𝐝𝐢 ${allContacts.length})`,
          contacts: batch
        }
      });
      
      if (i + BATCH_SIZE < allContacts.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (err) {
      console.error(`Errore invio batch:`, err);
      if (batch.length > 50) {
        for (let j = 0; j < batch.length; j += 50) {
          const subBatch = batch.slice(j, j + 50);
          try {
            await conn.sendMessage(m.chat, { 
              contacts: {
                displayName: `📋 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐞 (${i+j+1}-${Math.min(i+j+50, allContacts.length)} 𝐝𝐢 ${allContacts.length})`,
                contacts: subBatch
              }
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (subErr) {
            console.error('Errore sottobatch:', subErr);
          }
        }
      }
    }
  }
};

handler.command = ['richiedenti', 'profili', 'request'];
handler.tags = ['gruppo'];
handler.help = ['Mostra i profili delle richieste in sospeso (ordinate per data)'];
handler.group = true;
handler.botAdmin = true;
handler.premium = true;

export default handler;