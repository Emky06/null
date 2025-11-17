// Plugin fatto da Axtral_WiZaRd
import fs from 'fs';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const imagePath = './icone/link.png';
const thumbnail = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

const linkRegex = /chat\.whatsapp\.com\/[0-9A-Za-z]{20,24}/i;
const channelRegex = /(?:www\.)?whatsapp\.com\/channel\/[0-9A-Za-z]+/i;

async function getMediaBuffer(message) {
  try {
    const msg =
      message.message?.imageMessage ||
      message.message?.videoMessage ||
      message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
      message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

    if (!msg) return null;
    const type = msg.mimetype?.startsWith('video') ? 'video' : 'image';
    const stream = await downloadContentFromMessage(msg, type);

    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    return buffer;
  } catch (e) {
    console.error('Errore nel download media (QR):', e);
    return null;
  }
}

async function readQRCode(imageBuffer) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const FormData = (await import('form-data')).default;
    const fetch = (await import('node-fetch')).default;
    const formData = new FormData();
    formData.append('file', imageBuffer, 'image.jpg');

    const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeout);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return data?.[0]?.symbol?.[0]?.data || null;
    } catch {
      console.error('❌ Risposta non JSON dalla QR API:', text.slice(0, 100));
      return null;
    }
  } catch (e) {
    console.error('Errore lettura QR:', e);
    return null;
  }
}

export async function before(msg, { isAdmin, isPrems, isBotAdmin, conn }) {
  if (msg.isBaileys || msg.fromMe) return true;
  if (!msg.isGroup) return false;

  const chatData = global.db.data.chats[msg.chat];
  const botSettings = global.db.data.settings[conn.user.jid] || {};
  const userData = global.db.data.users[msg.sender] || {};
  const sender = msg.key.participant;
  const messageId = msg.key.id;
  const warnLimit = 3;

  if (!chatData.antiqr) return true;

  const media = await getMediaBuffer(msg);
  if (!media) return true;

  const qrData = await readQRCode(media);
  const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? '';
  if (!qrText) return true;

  if (linkRegex.test(qrText) || channelRegex.test(qrText)) {
    if (isAdmin || isPrems || !isBotAdmin || !botSettings.restrict) return true;

    const groupLink = 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(msg.chat));
    if (qrText.includes(groupLink.replace(/\s+/g, ''))) return true;

    const vcardMessage = {
      key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'vcardqr1' },
      message: {
        locationMessage: {
          name: '⚠️ 𝐀𝐧𝐭𝐢-𝐐𝐑 𝐚𝐭𝐭𝐢𝐯𝐨 ⚠️',
          jpegThumbnail: thumbnail,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:;AntiQR;;;
FN:AntiQR
ORG:AntiQR System
TITLE:
item1.TEL;waid=10000000000:+1 000 000 0000
item1.X-ABLabel:AntiQR Bot
X-WA-BIZ-DESCRIPTION:Protezione automatica da codici QR con link
X-WA-BIZ-NAME:AntiQR
END:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    let user = global.db.data.users[msg.sender];
    user.warn = (user.warn || 0) + 1;
    user.warnReasons = user.warnReasons || [];
    user.warnReasons.push(`QR con link WhatsApp vietato`);

    await conn.sendMessage(msg.chat, {
      delete: { remoteJid: msg.chat, fromMe: false, id: messageId, participant: sender }
    });

    const warnCount = user.warn;
    if (warnCount < warnLimit) {
      const remaining = warnLimit - warnCount;
      await conn.sendMessage(msg.chat, {
        text: `𝐐𝐑 𝐂𝐎𝐍 𝐋𝐈𝐍𝐊 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐍𝐎𝐍 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐎\n*${warnCount}° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎*\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒆 𝒔𝒂𝒓𝒂𝒊 𝒓𝒊𝒎𝒐𝒔𝒔𝒐/𝒂 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`,
        mentions: [msg.sender]
      }, { quoted: vcardMessage });
    } else {
      user.warn = 0;
      user.warnReasons = [];
      await conn.sendMessage(msg.chat, { text: '⛔ *UTENTE RIMOSSO DOPO 3 QR CON LINK*', mentions: [msg.sender] });
      await conn.groupParticipantsUpdate(msg.chat, [msg.sender], 'remove');
    }

    return false;
  }

  return true;
}