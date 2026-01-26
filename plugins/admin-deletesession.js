//Plugin fatto da Axtral_WiZaRd
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';
import fs from 'fs';

const handler = async (m, { conn, usedPrefix }) => {
  const buttons = [
    { buttonId: `${usedPrefix}ds`, buttonText: { displayText: "🔄 𝐒𝐯𝐮𝐨𝐭𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢" }, type: 1 },
    { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "⚡ 𝐏𝐢𝐧𝐠" }, type: 1 },
    { buttonId: `${usedPrefix}pong`, buttonText: { displayText: "⚡ 𝐏𝐨𝐧𝐠" }, type: 1 }
  ];

  try {
    const sessionFolder = "./sessioni/";

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(m.chat, {
        text: "*❌ 𝐋𝐚 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐞̀ 𝐯𝐮𝐨𝐭𝐚 o 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞.*",
        buttons,
        headerType: 1
      }, { quoted: m });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deletedCount = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deletedCount++;
      }
    }

    const quotedMessage = {
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: 'Halo' },
      message: {
        locationMessage: {
          name: `${nomebot}`,
          jpegThumbnail: fs.readFileSync(path.join('icone', 'spunta.png')),
          vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:Bot\nORG:Bot\nTITLE:\nitem1.TEL;waid=11111111111:+1 (111) 111-1111\nitem1.X-ABLabel:Bot\nX-WA-BIZ-NAME:Bot\nEND:VCARD"
        }
      },
      participant: '0@s.whatsapp.net'
    };

    await conn.sendMessage(m.chat, {
      text: deletedCount === 0
        ? 'ⓘ 𝐋𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐬𝐨𝐧𝐨 𝐯𝐮𝐨𝐭𝐞, 𝐫𝐢𝐩𝐫𝐨𝐯𝐚 𝐭𝐫𝐚 𝐩𝐨𝐜𝐨‼️'
        : `🗑️ 𝐒𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 ${deletedCount} 𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢! 𝐆𝐫𝐚𝐳𝐢𝐞 𝐩𝐞𝐫 𝐚𝐯𝐞𝐫𝐦𝐢 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐨 😏`,
      buttons,
      headerType: 1
    }, { quoted: quotedMessage });

  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: "❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐳𝐢𝐨𝐧𝐞!",
      buttons,
      headerType: 1
    }, { quoted: m });
  }
};

handler.help = ['del_reg_in_session_owner'];
handler.tags = ["owner"];
handler.command = /^(diosbura|ds)$/i;
handler.admin = true;

export default handler;