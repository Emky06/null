//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

export async function before(m, { isAdmin, groupMetadata, isBotAdmin, conn }) {
  if (m.isBaileys || m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  let warnLimit = 3;
  let senderId = m.key.participant;
  let messageId = m.key.id;

  let tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(vm\.tiktok\.com|tiktok\.com)\/[^\s]*/i;
  const isTiktokLink = tiktokRegex.exec(m.text);
  const avvisoTesto = '° AVVERTIMENTO';

  if (isAdmin && chat.antitiktok && m.text.includes(avvisoTesto)) return;

  if (chat.antitiktok && isTiktokLink && !isAdmin && isBotAdmin) {
    if (!global.db.data.users[m.sender].warn) global.db.data.users[m.sender].warn = 0;
    if (!global.db.data.users[m.sender].warnReasons) global.db.data.users[m.sender].warnReasons = [];

    global.db.data.users[m.sender].warn += 1;
    global.db.data.users[m.sender].warnReasons.push('link tiktok');

    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: senderId,
      },
    });

    let warnCount = global.db.data.users[m.sender].warn;
    let thumbnailBuffer;
    try {
      thumbnailBuffer = fs.readFileSync('icone/tiktok.png');
    } catch (e) {
      thumbnailBuffer = null;
    }

    let vcardMessage = {
      key: {
        participants: '0@s.whatsapp.net',
        fromMe: false,
        id: 'vcard1'
      },
      message: {
        locationMessage: {
          name: '𝐀𝐧𝐭𝐢 - 𝐓𝐢𝐤𝐭𝐨𝐤',
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
      let remaining = warnLimit - warnCount;
      await conn.sendMessage(m.chat, {
        text: `> ⚠️ 𝐀𝐍𝐓𝐈𝐓𝐈𝐊𝐓𝐎𝐊 𝐀𝐓𝐓𝐈𝐕𝐎 ⚠️ \n𝐋𝐈𝐍𝐊 𝐓𝐈𝐊𝐓𝐎𝐊 𝐍𝐎𝐍 𝐒𝐎𝐍𝐎 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐈\n*${warnCount}${avvisoTesto}*\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒍𝒊𝒏𝒌 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`
      }, { quoted: vcardMessage });
    } else {
      global.db.data.users[m.sender].warn = 0;
      global.db.data.users[m.sender].warnReasons = [];
      m.reply('⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈');
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }

  return true;
}