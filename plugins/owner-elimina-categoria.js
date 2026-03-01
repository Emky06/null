//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, args }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!mention) {
    return conn.sendMessage(m.chat, { text: `❌ 𝐔𝐬𝐚: .delcategoria @utente` }, { quoted: m });
  }

  if (!global.db.data.users[mention]) {
    global.db.data.users[mention] = {};
  }

  if (!global.db.data.users[mention].categoria) {
    return conn.sendMessage(m.chat, { text: `⚠️ 𝐋'𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐧𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐚.` }, { quoted: m });
  }

  delete global.db.data.users[mention].categoria;

  await conn.sendMessage(m.chat, { text: `✅ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚 𝐝𝐢 @${mention.split("@")[0]} 𝐫𝐢𝐦𝐨𝐬𝐬𝐚 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨.`, mentions: [mention] }, { quoted: m });
};

handler.command = /^(eliminacategoria|delcategoria)$/i;
handler.owner = true; 
export default handler;