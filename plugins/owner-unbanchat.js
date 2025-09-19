//Plugin fatto da Axtral_WiZaRd
let handler = async (m) => {
  global.db.data.chats[m.chat].isBanned = false;
  let message = '*𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚 ✓*';
  await conn.sendMessage(m.chat, { 
      text: message,
      contextInfo: {
      }
  }, { quoted: m });
};

handler.help = ['unbanchat'];
handler.tags = ['owner'];
handler.command = /^reveal$/i;
handler.rowner = true;
export default handler;