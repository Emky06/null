// Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

let telegramRegex = /(?:https?:\/\/)?(?:www\.)?(t\.me|telegram\.me)\/[^\s]*/i;

export async function before(m, { isAdmin, groupMetadata, isBotAdmin, conn }) {
  if (m.isBaileys || m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  let warnLimit = 3;
  let senderId = m.key.participant;
  let messageId = m.key.id;
  let userData = global.db.data.users[m.sender] || {};
  const isTelegramLink = telegramRegex.exec(m.text);

  if (isAdmin && chat.antitelegram && m.text.includes('AVVERTIMENTO')) return;

  if (chat.antitelegram && isTelegramLink && !isAdmin && isBotAdmin) {
    if (!userData.warn) userData.warn = 0;
    if (!userData.warnReasons) userData.warnReasons = [];

    userData.warn += 1;
    userData.warnReasons.push('Link Telegram');

    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: senderId,
      },
    });

    let thumbnail;
    try {
      thumbnail = fs.readFileSync('icone/telegram.png');
    } catch (e) {
      thumbnail = null;
    }

    const vcardMessage = {
      key: {
        participants: '0@s.whatsapp.net',
        fromMe: false,
        id: 'antitel1',
      },
      message: {
        locationMessage: {
          name: '𝐀𝐧𝐭𝐢 - 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦',
          jpegThumbnail: thumbnail,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:;AntiTelegram;;;
FN:AntiTelegram
ORG:AntiTelegram System
TITLE:
item1.TEL;waid=10000000000:+1 000 000 0000
item1.X-ABLabel:AntiTelegram Bot
X-WA-BIZ-DESCRIPTION:Protezione automatica da link Telegram
X-WA-BIZ-NAME:AntiTelegram
END:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    let warnCount = userData.warn;
    let remaining = warnLimit - warnCount;

    if (warnCount < warnLimit) {
      await conn.sendMessage(m.chat, {
        text: `> ⚠️ 𝐀𝐍𝐓𝐈𝐓𝐆 𝐀𝐓𝐓𝐈𝐕𝐎 ⚠️\n𝐋𝐈𝐍𝐊 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 𝐍𝐎𝐍 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐎\n*${warnCount}° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎*\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒍𝒊𝒏𝒌 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`
      }, { quoted: vcardMessage });
    } else {
      userData.warn = 0;
      userData.warnReasons = [];
      await m.reply('⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈');
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }

  return true;
}