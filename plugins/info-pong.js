//Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';

let handler = async (m, { conn, usedPrefix }) => {
  try {
  
    const start = performance.now();
    await conn.readMessages([m.key]);
    const speed = (performance.now() - start).toFixed(2);

    const message = `${speed} ms`.trim();

    await conn.sendMessage(m.chat, {
      text: message,
      footer: `𝐏𝐢𝐧𝐠 ${nomebot}`,
      buttons: [
        { buttonId: `${usedPrefix}pong`, buttonText: { displayText: "🔄 𝐏𝐨𝐧𝐠" }, type: 1 },
        { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "⚡ 𝐏𝐢𝐧𝐠" }, type: 1 },
        { buttonId: `${usedPrefix}ds`, buttonText: { displayText: "🗑️ 𝐒𝐯𝐮𝐨𝐭𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢" }, type: 1 },
      ],
      headerType: 1
    
    });
  } catch (err) {
    console.error("Errore nell'handler:", err);
  }
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^(pong)$/i;

export default handler;