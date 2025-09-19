//by kinderino, mod da axtral
import os from 'os';
import 'util';
import '@whiskeysockets/baileys';
import { performance } from 'perf_hooks';

let handler = async (m, { conn, usedPrefix }) => {
  try {
    const uptimeMs = process.uptime() * 1000;
    const uptimeStr = clockString(uptimeMs);
    const startTime = performance.now();
    const endTime = performance.now();
    const speed = (endTime - startTime).toFixed(4);

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const percentUsed = ((usedMem / totalMem) * 100).toFixed(2);

    const totalMemGB = (totalMem / 1024 / 1024 / 1024).toFixed(2);
    const usedMemGB = (usedMem / 1024 / 1024 / 1024).toFixed(2);

    const botName = global.db?.data?.nomedelbot || "𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕";
    
    const botStartTime = new Date(Date.now() - uptimeMs);
    const activationTime = botStartTime.toLocaleString('it-IT', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const message = `
╭━━━━━━•✦•━━━━━━╮
                  𝑷𝑰𝑵𝑮
         𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
╰━━━━━━•✦•━━━━━━╯

𝑼𝒑𝒕𝒊𝒎𝒆: ${uptimeStr}  
𝑽𝒆𝒍𝒐𝒄𝒊𝒕𝒂̀: ${speed} ms  
𝑹𝑨𝑴 𝒖𝒔𝒂𝒕𝒂: ${usedMemGB} / ${totalMemGB} GB (${percentUsed}%)  
𝑨𝒗𝒗𝒊𝒐: ${activationTime}

╭━━━━━━•✦•━━━━━━╮
   𝑶𝒘𝒏𝒆𝒓: 𝛬𝑿𝑻𝑹𝜜𝑳  
   𝑺𝒕𝒂𝒕𝒐: _Online_  
╰━━━━━━•✦•━━━━━━╯
`.trim();

    await conn.sendMessage(m.chat, {
      text: message,
      footer: `𝐏𝐢𝐧𝐠 ${botName}`,
      buttons: [
        { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "🔄 𝐑𝐢𝐟𝐚𝐢 𝐩𝐢𝐧𝐠" }, type: 1 },
        { buttonId: `${usedPrefix}ds`, buttonText: { displayText: "🗑️ 𝐒𝐯𝐮𝐨𝐭𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢" }, type: 1 },
      ],
      headerType: 1,
      contextInfo: {
        mentionedJid: conn.parseMention(botName),
      },
    });
  } catch (err) {
    console.error("Errore nell'handler:", err);
  }
};

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor((ms % 3600000) / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
}

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^(ping)$/i;

export default handler;