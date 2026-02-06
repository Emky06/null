//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, isOwner, isAdmin, isPrems }) => {
  if (!isOwner && !isAdmin && !isPrems) 
    return m.reply('⚠️ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮𝐨̀ 𝐞𝐬𝐬𝐞𝐫𝐞 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐬𝐨𝐥𝐨 𝐝𝐚 𝐚𝐝𝐦𝐢𝐧 𝐞 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢.');

  let groupMetadata = await conn.groupMetadata(m.chat);
  let groupMembers = groupMetadata.participants.map(u => u.jid);

  let usersMuted = Object.entries(global.db.data.users)
    .filter(([jid, user]) => user.muto && groupMembers.includes(jid));

  if (!usersMuted.length) 
    return m.reply('⚠️ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐦𝐮𝐭𝐚𝐭𝐨 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.');

  let caption = `🔇 𝐋𝐈𝐒𝐓𝐀 𝐔𝐓𝐄𝐍𝐓𝐈 𝐌𝐔𝐓𝐀𝐓𝐈 🔇\n╭•━━━━━━━━━━━━━━━━━━•\n┃ 𝐓𝐨𝐭𝐚𝐥𝐞: ${usersMuted.length} 𝐔𝐬𝐞𝐫`;

  for (let i = 0; i < usersMuted.length; i++) {
    let [jid] = usersMuted[i];
    let tag = `@${jid.split('@')[0]}`;
    caption += `\n┃\n┃ ${i + 1}. ${tag}\n┣━━━━━━━━━━━━━━━━━━•`;
  }

  caption += `\n╰•━━━━━━━━━━━━━━━━━━•`;

  m.reply(caption, null, { mentions: usersMuted.map(([jid]) => jid) });
}

handler.command = /^(mutati|listamutati|mutelist)$/i;
handler.group = true;

export default handler;