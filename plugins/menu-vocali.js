//Plugin fatto da Axtral_WiZaRd
import fs from 'fs/promises';
import fetch from 'node-fetch';

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

    
    let profilo;
    try {
      profilo = await conn.profilePictureUrl(targetJid, 'image');
    } catch {
      profilo = await fs.readFile('./icone/profilo.png');
    }

    const profilePicBuffer = typeof profilo === 'string'
      ? await (await fetch(profilo)).buffer()
      : profilo;

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
*𝑽𝒆𝒓𝒔𝒊𝒐𝒏𝒆: ${vs}*
*𝐁𝐲* ${nomebot}
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
handler.command = /^(vocali)$/i;

export default handler;