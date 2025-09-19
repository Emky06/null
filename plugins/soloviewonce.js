// Plugin fatto da Axtral_WiZaRd
export async function before(m, { conn, isAdmin, isBotAdmin }) {
  let chat = db.data.chats[m.chat];
  if (!chat.soloviewonce || chat.isBanned) return;

  if (m.fromMe || isAdmin) return;

  if (m.mtype === 'imageMessage' || m.mtype === 'videoMessage') {
    await conn.sendMessage(m.chat, { delete: m.key });
    await conn.sendMessage(m.chat, {
      text: '> ⚠️𝐀𝐍𝐓𝐈𝐌𝐄𝐃𝐈𝐀 𝐀𝐓𝐓𝐈𝐕𝐎⚠️\n𝐒𝐨𝐧𝐨 𝐜𝐨𝐧𝐬𝐞𝐧𝐭𝐢𝐭𝐞 𝐬𝐨𝐥𝐨 𝐟𝐨𝐭𝐨 𝐞 𝐯𝐢𝐝𝐞𝐨 𝐚𝐝 1 𝐯𝐢𝐬𝐮𝐚𝐥①.'
    });
    return;
  }

  if (m.mtype === 'viewOnceMessageV2') {
    return;
  }
}