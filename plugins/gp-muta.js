import fs from 'fs';

const handler = async (msg, { conn, command, text, isAdmin }) => {
  const mentionedJid = msg.mentionedJid?.[0] || msg.quoted?.sender;
  const sender = msg.sender;
  const chatId = msg.chat;
  const botNumber = conn.user.jid;
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupOwner = groupMetadata.owner || chatId.split('-')[0] + '@s.whatsapp.net';

  if (!isAdmin) throw '𝐍𝐨𝐧 𝐬𝐞𝐢 𝐮𝐧 𝐚𝐝𝐦𝐢𝐧 𝐩𝐞𝐫 𝐩𝐨𝐭𝐞𝐫𝐥𝐨 𝐟𝐚𝐫𝐞.';
  if (!mentionedJid) return conn.reply(chatId, `𝐓𝐚𝐠𝐠𝐚 𝐥'𝐮𝐭𝐞𝐧𝐭𝐞 𝐝𝐚 ${command === 'muta' ? '𝐦𝐮𝐭𝐚𝐫𝐞 🔇' : '𝐬𝐦𝐮𝐭𝐚𝐫𝐞 🔊'}`, msg);
  if (mentionedJid === groupOwner) throw '𝐈𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐧𝐨𝐧 𝐩𝐮𝐨̀ 𝐞𝐬𝐬𝐞𝐫𝐞 𝐦𝐮𝐭𝐚𝐭𝐨 ✘';
  if (mentionedJid === botNumber) throw '𝐇𝐚𝐢 𝐚𝐩𝐩𝐞𝐧𝐚 𝐜𝐞𝐫𝐜𝐚𝐭𝐨 𝐝𝐢 𝐦𝐮𝐭𝐚𝐫𝐦𝐢? 𝐒𝐞𝐫𝐢𝐚𝐦𝐞𝐧𝐭𝐞? 🤡';

  const protectedNumbers = [
    '393512884684@s.whatsapp.net',
    '35795191323@s.whatsapp.net',
  ];

  const user = global.db.data.users[mentionedJid];
  const isMute = command === 'muta';
  const thumbnail = fs.readFileSync(`icone/${isMute ? 'muta.png' : 'smuta.png'}`);
  const miniaturaText = isMute ? '𝑼𝒕𝒆𝒏𝒕𝒆 𝒎𝒖𝒕𝒂𝒕𝒐 🔇' : '𝑼𝒕𝒆𝒏𝒕𝒆 𝒔𝒎𝒖𝒕𝒂𝒕𝒐 🔊';

  const fakeReply = {
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
    message: { locationMessage: { name: miniaturaText, jpegThumbnail: thumbnail } },
    participant: '0@s.whatsapp.net',
  };

  const userTag = '@' + mentionedJid.split('@')[0];

  if (isMute) {
    if (protectedNumbers.includes(mentionedJid)) return conn.reply(chatId, '𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐮𝐭𝐚𝐫𝐞 𝐀𝐱𝐭𝐫𝐚𝐥. 𝐅𝐚𝐧𝐜𝐮𝐥𝐨🖕🏻', msg);
    if (user.muto) throw '𝐋`𝐮𝐭𝐞𝐧𝐭𝐞 𝐞̀ 𝐠𝐢𝐚̀ 𝐦𝐮𝐭𝐚𝐭𝐨!';
    user.muto = true;
    return conn.sendMessage(chatId, { text: `${userTag} 𝐞̇ 𝐬𝐭𝐚𝐭𝐨/𝐚 𝐦𝐮𝐭𝐚𝐭𝐨/𝐚 ✓ \n> 𝑺𝒐𝒍𝒐 𝒂𝒅𝒎𝒊𝒏 𝒆 𝒎𝒐𝒅𝒆𝒓𝒂𝒕𝒐𝒓𝒊 𝒑𝒐𝒔𝒔𝒐𝒏𝒐 𝒔𝒎𝒖𝒕𝒂𝒓𝒕𝒊.`, mentions: [mentionedJid] }, { quoted: fakeReply });
  }

  if (!user.muto) throw '𝐋`𝐮𝐭𝐞𝐧𝐭𝐞 𝐞̀ 𝐠𝐢𝐚̀ 𝐬𝐦𝐮𝐭𝐚𝐭𝐨!';
  user.muto = false;
  return conn.sendMessage(chatId, { text: `${userTag} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨/𝐚 𝐬𝐦𝐮𝐭𝐚𝐭𝐨/𝐚 ✓ \n> 𝑶𝒓𝒂 𝒓𝒊𝒏𝒈𝒓𝒂𝒛𝒊𝒂!`, mentions: [mentionedJid] }, { quoted: fakeReply });
};

handler.command = /^(muta|smuta)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;
