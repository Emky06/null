import os from 'os';

let handler = async (m, { conn }) => { try { const totalMem = os.totalmem(); const freeMem = os.freemem(); const usedMem = totalMem - freeMem; const percentUsed = ((usedMem / totalMem) * 100).toFixed(2);

const totalMemGB = (totalMem / 1024 / 1024 / 1024).toFixed(2);
const usedMemGB = (usedMem / 1024 / 1024 / 1024).toFixed(2);

const message = `╭━━━━━━•✦•━━━━━━╮\n              𝑹𝑨𝑴 𝑰𝑵𝑭𝑶\n╰━━━━━━•✦•━━━━━━╯

𝑼𝒔𝒂𝒕𝒂: ${usedMemGB} 𝐆𝐁 / ${totalMemGB} 𝐆𝐁 𝐏𝐞𝐫𝐜𝐞𝐧𝐭𝐮𝐚𝐥𝐞: ${percentUsed}% `.trim();

await conn.sendMessage(m.chat, {
  text: message,
});

} catch (err) { console.error("Errore nell'handler RAM:", err); } };

handler.help = ['ram']; handler.tags = ['info']; handler.command = /^(ram)$/i;

export default handler;