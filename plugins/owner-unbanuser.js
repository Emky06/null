import fs from 'fs/promises';

async function handler(m, { conn, text }) {
  if (!text) return;
  let target;
  if (m.isGroup) {
    target = m.mentionedJid?.[0];
  } else {
    target = m.chat;
  }
  if (!target) return;

  global.db.data.users[target].banned = false;

  // Usa solo file locale
  const thumbnail = await fs.readFile('icone/unbanuser.png');

  const vcardMessage = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "𝐔𝐭𝐞𝐧𝐭𝐞 𝐬𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐨",
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

  conn.reply(m.chat, "𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐩𝐨𝐭𝐫𝐚̀ 𝐞𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢.", vcardMessage);
}

handler.help = ['unbanuser'];
handler.tags = ['help'];
handler.command = /^unbanuser|unban$/i;
handler.owner = true;
export default handler;