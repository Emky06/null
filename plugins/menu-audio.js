//Plugin fatto da Axtral_WiZaRd
const handler = async (_message, { conn, usedPrefix }) => {
    const messageContent = `
═════════════════════
            ✧ 𝐌𝚵𝐍𝐔 𝚲𝐔𝐃𝕀Ꮻ ✧  
═════════════════════

*Rispondi a un audio con i comandi:*

➤ ${usedPrefix}blown
➤ ${usedPrefix}reverse
➤ ${usedPrefix}chipmunk
➤ ${usedPrefix}deep
➤ ${usedPrefix}fast
➤ ${usedPrefix}slow
➤ ${usedPrefix}squirrel
➤ ${usedPrefix}bass
➤ ${usedPrefix}robot
➤ ${usedPrefix}nightcore
➤ ${usedPrefix}earrape
═════════════════════`;

    conn.reply(_message.chat, messageContent.trim(), _message);
};

handler.help = ["menuaudio", "audio"];
handler.tags = ["audio"];
handler.command = /^(menuaudio|audio)$/i;

export default handler;