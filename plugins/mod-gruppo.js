// Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
    if (!global.db || !global.db.data.groups) return m.reply('Nessun dato disponibile.');

    const groupId = m.chat;
    const groupData = global.db.data.groups[groupId];
    const prems = groupData?.prems || [];

    if (!prems.length) return m.reply('𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.');

    const groupMetadata = await conn.groupMetadata(groupId).catch(() => null);
    const groupName = groupMetadata?.subject || 'Gruppo senza nome';

    let text = `╭━━━━━━━━━━━━━━━━━━━╮
  _*𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐝𝐢 ${groupName}*_ 
╰━━━━━━━━━━━━━━━━━━━╯\n`;

    let mentions = [];
    prems.forEach(user => {
        let jid = user.includes('@s.whatsapp.net') ? user : `${user}@s.whatsapp.net`;
        mentions.push(jid);
        text += `┣➤ @${jid.split('@')[0]}\n`;
    });

    await conn.sendMessage(groupId, { text, mentions });
};

handler.help = ['mymods'];
handler.tags = ['group'];
handler.command = /^(mymods|moderatori)$/i;
handler.group = true;

export default handler;