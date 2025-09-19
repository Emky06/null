import fs from 'fs/promises';

async function handler(m, { conn, participants, usedPrefix, command }) {
  if (!m.mentionedJid?.[0] && !m.quoted) return;
  let target;
  if (m.isGroup) {
    target = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted.sender;
  } else {
    target = m.chat;
  }

  const protectedNumbers = ["393755435365@s.whatsapp.net", "573161874043@s.whatsapp.net"];
  if (protectedNumbers.includes(target)) {
    return conn.reply(m.chat, "ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐛𝐚𝐧𝐧𝐚𝐫𝐞 𝐢𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐞 𝐢𝐥 𝐛𝐨𝐭", m);
  }

  global.db.data.users[target].banned = true;

  // Usa solo file locale
  const thumbnail = await fs.readFile('icone/banuser.png');

  const vcardMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "𝐔𝐭𝐞𝐧𝐭𝐞 𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐨",
        jpegThumbnail: thumbnail,
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  conn.reply(m.chat, "𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐩𝐨𝐭𝐫𝐚̀ 𝐩𝐢𝐮̀ 𝐞𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢.", vcardMessage);
}

handler.command = /^banuser$/i;
handler.rowner = true;
export default handler;