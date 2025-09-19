let handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('❗Rispondi a un messaggio per vederne l\'ID');

  const msgID = m.quoted.id || m.quoted.key?.id;
  const senderJid = m.quoted.sender || 'sconosciuto';
  const tagUtente = senderJid.replace(/@.+/, '');

  const messaggio = `╭─[ 🔎 *ID del Messaggio* ]
│ 👤 Utente: *@${tagUtente}*
│ 🆔 ID: \`\`\`${msgID || 'Non trovato'}\`\`\`
╰───────────────`;

  await conn.sendMessage(m.chat, {
    text: messaggio,
    mentions: [senderJid]
  }, { quoted: m });
};

handler.command = /^idmsg$/i;
handler.group = true;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

export default handler;