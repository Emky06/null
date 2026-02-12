//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

const handler = async (msg, { conn, command, text }) => {
  let mentionedJid = msg.mentionedJid?.[0] || msg.quoted?.sender;

  if (!mentionedJid && text) {
    if (text.endsWith('@s.whatsapp.net') || text.endsWith('@c.us')) {
      mentionedJid = text.trim();
    } else {
      let number = text.replace(/[^0-9]/g, '');
      if (number.length >= 8 && number.length <= 15) {
        mentionedJid = number + '@s.whatsapp.net';
      }
    }
  }

  const sender = msg.sender;
  const chatId = msg.chat;
  const botNumber = conn.user.jid;
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupOwner = groupMetadata.owner || chatId.split('-')[0] + '@s.whatsapp.net';
  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');

  if (!mentionedJid) return conn.reply(chatId, `𝐓𝐚𝐠𝐠𝐚 𝐥\'𝐮𝐭𝐞𝐧𝐭𝐞 𝐝𝐚 ${command === 'muto' ? '𝐦𝐮𝐭𝐚𝐫𝐞 🔇' : '𝐬𝐦𝐮𝐭𝐚𝐫𝐞 🔊'}`, msg);
  if (mentionedJid === groupOwner) throw '𝐈𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐧𝐨𝐧 𝐩𝐮𝐨̀ 𝐞𝐬𝐬𝐞𝐫𝐞 𝐦𝐮𝐭𝐚𝐭𝐨 ✘';
  if (mentionedJid === botNumber) throw '𝐇𝐚𝐢 𝐚𝐩𝐩𝐞𝐧𝐚 𝐜𝐞𝐫𝐜𝐚𝐭𝐨 𝐝𝐢 𝐦𝐮𝐭𝐚𝐫𝐦𝐢? 𝐒𝐞𝐫𝐢𝐚𝐦𝐞𝐧𝐭𝐞? 🤡';
  if (ownerJids.includes(mentionedJid)) throw '𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐮𝐭𝐚𝐫𝐞 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫 ✘';

  const user = global.db.data.users[mentionedJid] || (global.db.data.users[mentionedJid] = {});
  const isMute = command === 'muto';
  const thumbnail = fs.readFileSync(`icone/${isMute ? 'muta.png' : 'smuta.png'}`);
  const miniaturaText = isMute ? '𝑼𝒕𝒆𝒏𝒕𝒆 𝒎𝒖𝒕𝒂𝒕𝒐 🔇' : '𝑼𝒕𝒆𝒏𝒕𝒆 𝒔𝒎𝒖𝒕𝒂𝒕𝒐 🔊';

  const fakeReply = {
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { locationMessage: { name: miniaturaText, jpegThumbnail: thumbnail } },
    participant: '0@s.whatsapp.net',
  };

  const userTag = '@' + mentionedJid.split('@')[0];

  if (isMute) {
    if (user.muto) throw '𝐋`𝐮𝐭𝐞𝐧𝐭𝐞 𝐞̀ 𝐠𝐢𝐚̀ 𝐦𝐮𝐭𝐚𝐭𝐨!';
    user.muto = true;
    return conn.sendMessage(
      chatId,
      {
        text: `${userTag} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨/𝐚 𝐦𝐮𝐭𝐚𝐭𝐨/𝐚 ✓ \n> 𝑺𝒐𝒍𝒐 𝒂𝒅𝒎𝒊𝒏 𝒆 𝒎𝒐𝒅𝒆𝒓𝒂𝒕𝒐𝒓𝒊 𝒑𝒐𝒔𝒔𝒐𝒏𝒐 𝒔𝒎𝒖𝐭𝐚𝐫𝐭𝐢.`,
        mentions: [mentionedJid]
      },
      { quoted: fakeReply }
    );
  }

  if (!user.muto) throw '𝐋`𝐮𝐭𝐞𝐧𝐭𝐞 𝐞̀ 𝐠𝐢𝐚̀ 𝐬𝐦𝐮𝐭𝐚𝐭𝐨!';
  user.muto = false;

  return conn.sendMessage(
    chatId,
    {
      text: `${userTag} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨/𝐚 𝐬𝐦𝐮𝐭𝐚𝐭𝐨/𝐚 ✓ \n> 𝑶𝒓𝒂 𝒓𝒊𝒏𝒈𝒓𝒂𝒛𝒊𝒂!`,
      mentions: [mentionedJid]
    },
    { quoted: fakeReply }
  );
};

handler.command = /^(muto|smuto)$/i;
handler.group = true;
handler.botAdmin = true;
handler.premium = true;

export default handler;