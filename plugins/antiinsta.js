import fs from 'fs';

let linkRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s]*/i;

export async function before(m, { isAdmin, groupMetadata, isBotAdmin, conn }) {
  if (m.isBaileys || m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  let warnLimit = 3;
  let senderId = m.key.participant;
  let messageId = m.key.id;

  const isInstagramLink = linkRegex.exec(m.text);
  const avvisoTesto = '° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎';

  if (isAdmin && chat.antiinsta && m.text.includes(avvisoTesto)) return;

  if (chat.antiinsta && isInstagramLink && !isAdmin && isBotAdmin) {
    if (!global.db.data.users[m.sender].warn) global.db.data.users[m.sender].warn = 0;
    if (!global.db.data.users[m.sender].warnReasons) global.db.data.users[m.sender].warnReasons = [];

    global.db.data.users[m.sender].warn += 1;
    global.db.data.users[m.sender].warnReasons.push('link instagram');

    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: senderId,
      },
    });

    let warnCount = global.db.data.users[m.sender].warn;
    let remaining = warnLimit - warnCount;

    let thumbnailBuffer;
    try {
      thumbnailBuffer = fs.readFileSync('icone/instagram.png');
    } catch (e) {
      thumbnailBuffer = null;
    }

    const botName = '⚠️ 𝐀𝐧𝐭𝐢-𝐈𝐧𝐬𝐭𝐚 𝐚𝐭𝐭𝐢𝐯𝐨 ⚠️';
    let vcardMessage = {
      key: {
        participants: '0@s.whatsapp.net',
        fromMe: false,
        id: 'vcard1'
      },
      message: {
        locationMessage: {
          name: botName,
          jpegThumbnail: thumbnailBuffer,
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
      participant: '0@s.whatsapp.net'
    };

    if (warnCount < warnLimit) {
      await conn.sendMessage(m.chat, {
        text: `𝐋𝐈𝐍𝐊 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈\n*${warnCount}${avvisoTesto}*\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒍𝒊𝒏𝒌 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`
      }, { quoted: vcardMessage });
    } else {
      global.db.data.users[m.sender].warn = 0;
      global.db.data.users[m.sender].warnReasons = [];
      await conn.sendMessage(m.chat, { 
  text: '⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈'
});
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }

  return true;
}