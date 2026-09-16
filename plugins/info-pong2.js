//by kinderino + axtral + edo
import { performance } from 'perf_hooks';
import '@axtral_wizard/baileys';

let handler = async (m, { conn }) => {
  try {
    // ─── Misura tempo invio messaggio (ping reale) ───
    const startTime = performance.now();
    let sent = await conn.sendMessage(m.chat, { text: "🏓 Pong..." });
    const endTime = performance.now();
    const speed = (endTime - startTime).toFixed(2);

    // ─── Messaggio finale ───
    const message = `${speed} ms`;

    // Modifica il messaggio già inviato
    await conn.sendMessage(m.chat, {
      text: message,
      edit: sent.key,
    });
  } catch (err) {
    console.error("Errore nell'handler:", err);
  }
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^(pong2)$/i;

export default handler;