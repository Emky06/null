//Plugin fatto da Axtral_WiZaRd
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
    
    const message = `${speed} ms`.trim();

    await conn.sendMessage(m.chat, {
      text: message,
      footer: `𝐏𝐢𝐧𝐠 ${nomebot}`,
      buttons: [
        { buttonId: `${usedPrefix}pong3`, buttonText: { displayText: "🔄 𝐏𝐨𝐧𝐠" }, type: 1 },
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
handler.command = /^(pong3)$/i;

export default handler;