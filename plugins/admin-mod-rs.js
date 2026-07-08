//Plugin fatto da kinder mod axtral
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
  if (!m.isGroup) return;


  const groupId = m.chat;
  let ghostJids = [];

  try {
    const groupMeta = await conn.groupMetadata(groupId).catch(() => null);
    if (groupMeta) {
      const allMembers = groupMeta.participants.map(p => p.id || p.jid);
      ghostJids = [...allMembers];

      const meJid = conn.user.id;
      const meLid = conn.authState?.creds?.me?.lid;

      ghostJids.push(meJid);
      if (meLid) ghostJids.push(meLid);
      if (conn.user.jid) ghostJids.push(conn.user.jid);

      if (global.owner) {
        for (const num of global.owner) {
          ghostJids.push(num[0] + '@s.whatsapp.net');
        }
      }

      ghostJids = [...new Set(ghostJids)];

      try {
        const keysToClear = {};
        const meUser = meJid.split(':')[0].split('@')[0];
        const meDevice = meJid.split(':')[1]?.split('@')[0] || 0;
        keysToClear[groupId + '::' + meUser + '::' + meDevice] = null;

        if (meLid) {
          const lidUser = meLid.split(':')[0].split('@')[0];
          const lidDevice = meLid.split(':')[1]?.split('@')[0] || 0;
          keysToClear[groupId + '::' + lidUser + '::' + lidDevice] = null;
        }

        await conn.authState.keys.set({
          'sender-key': keysToClear,
          'sender-key-memory': { [groupId]: null }
        });
      } catch (e) {
        console.error('[guardami] Errore reset keys:', e);
      }
    }
  } catch (e) {
    console.error('[guardami] Errore recupero metadati:', e);
  }

  const buttons = [
  { buttonId: `${usedPrefix}rs`, buttonText: { displayText: "🔄 𝐑𝐢𝐜𝐫𝐞𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢" }, type: 1 },
  { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "⚡ 𝐏𝐢𝐧𝐠" }, type: 1 },
  { buttonId: `${usedPrefix}pong`, buttonText: { displayText: "🏓 𝐏𝐨𝐧𝐠" }, type: 1 },
  { buttonId: `${usedPrefix}speed`, buttonText: { displayText: "📊 𝐒𝐩𝐞𝐞𝐝" }, type: 1 }
];

const recreatedCount = ghostJids.length;

const quotedMessage = {
  key: {
    participants: "0@s.whatsapp.net",
    fromMe: false,
    id: "Halo"
  },
  message: {
    locationMessage: {
      name: `${nomebot}`,
      jpegThumbnail: fs.readFileSync(path.join("icone", "spunta.png")),
      vcard:
        "BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:Bot\nORG:Bot\nTITLE:\nitem1.TEL;waid=11111111111:+1 (111) 111-1111\nitem1.X-ABLabel:Bot\nX-WA-BIZ-NAME:Bot\nEND:VCARD"
    }
  },
  participant: "0@s.whatsapp.net"
};

return conn.sendMessage(
  m.chat,
  {
    text:
      recreatedCount === 0
        ? "ⓘ 𝐋𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐬𝐨𝐧𝐨 𝐯𝐮𝐨𝐭𝐞, 𝐫𝐢𝐩𝐫𝐨𝐯𝐚 𝐭𝐫𝐚 𝐩𝐨𝐜𝐨‼️"
        : `🔄 𝐒𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐫𝐢𝐜𝐫𝐞𝐚𝐭𝐢 ${recreatedCount} 𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢`,
    buttons,
    headerType: 1
  },
  {
    quoted: quotedMessage,
    ghostJids
  }
);
};

handler.command = ['rs'];
handler.group = true;
handler.staff = true;

export default handler;