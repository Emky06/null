// Codice di menu-vocali.js

import fs from 'fs/promises';
import fetch from 'node-fetch';
import '@whiskeysockets/baileys';

const handler = async (message, { conn, usedPrefix }) => {
  try {
    const senderName = await conn.getName(message.sender);
    const targetJid = message.quoted
      ? message.quoted.sender
      : message.mentionedJid && message.mentionedJid[0]
      ? message.mentionedJid[0]
      : message.fromMe
      ? conn.user.jid
      : message.sender;

    // Caricamento immagine profilo identico a info-user.js
    let profilo;
    try {
      profilo = await conn.profilePictureUrl(targetJid, 'image');
    } catch {
      profilo = await fs.readFile('./icone/profilo.png');
    }

    const profilePicBuffer = typeof profilo === 'string'
      ? await (await fetch(profilo)).buffer()
      : profilo;

    const botName = global.db.data.nomedelbot || "𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕";

    const commandList = `
✨ *𝐌𝐞𝐧𝐮 𝐕𝐨𝐜𝐚𝐥𝐢* ✨
─────────────────────
➤ ${usedPrefix}𝐩𝐝𝐢𝐨
➤ ${usedPrefix}𝐨𝐫𝐠𝐚𝐬𝐦𝐨
➤ ${usedPrefix}𝐟𝐫𝐞𝐞𝐬𝐭𝐲𝐥𝐞
➤ ${usedPrefix}𝐟𝐚𝐜𝐜𝐞𝐭𝐭𝐚 (𝐟𝐚𝐜𝐜𝐞𝐭𝐭𝐚𝐧𝐞𝐫𝐚)
➤ ${usedPrefix}𝐞𝐫𝐢𝐤𝐚
➤ ${usedPrefix}𝐩𝐨𝐫𝐜𝐨𝐝𝐢𝐨
➤ ${usedPrefix}𝐰𝐨𝐦𝐞𝐧
➤ ${usedPrefix}𝐜𝐚𝐳𝐳𝐨
➤ ${usedPrefix}𝐩𝐨𝐥𝐢𝐳𝐢𝐚
➤ ${usedPrefix}𝐭𝐫𝐚𝐥𝐥𝐚𝐥𝐥𝐞𝐫𝐨
─────────────────────
🤖 𝑩𝒐𝒕: ${botName}
🌟 *𝑽𝑬𝑹𝑺𝑰𝑶𝑵𝑬*: ${vs}
`.trim();

    await conn.sendMessage(message.chat, {
      text: commandList,
      contextInfo: {
        mentionedJid: [message.sender],
        externalAdReply: {
          title: senderName,
          body: `𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞 𝐁𝐨𝐭: ${vs}`,
          mediaType: 1,
          renderLargerThumbnail: false,
          previewType: "PHOTO",
          thumbnail: profilePicBuffer,
          sourceUrl: 'ok'
        }
      }
    });

  } catch (error) {
    console.error("Errore in MENU VOCALI:", error);
    await conn.sendMessage(message.chat, { text: "❌ Errore nel mostrare il menu vocali." });
  }
};

handler.help = ["menu"];
handler.tags = ['menu'];
handler.command = /^(menuvocali)$/i;

export default handler;

// Formattazione del tempo
function clockString(milliseconds) {
  let hours = Math.floor(milliseconds / 3600000);
  let minutes = Math.floor(milliseconds / 60000) % 60;
  let seconds = Math.floor(milliseconds / 1000) % 60;

  return [hours, minutes, seconds].map(t => t.toString().padStart(2, '0')).join(':');
}