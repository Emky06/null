//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
    if (!global.db || !global.db.data.groups) return m.reply('Nessun dato disponibile.');

    let text = `╭━━━━━━━━━━━━━━━━━━━╮
┃✨ _*𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐩𝐞𝐫 𝐠𝐫𝐮𝐩𝐩𝐨*_ ✨┃
╰━━━━━━━━━━━━━━━━━━━╯\n`;

    let mentions = [];

    for (let chatId in global.db.data.groups) {
        const groupData = global.db.data.groups[chatId];
        const prems = groupData?.prems || [];
        if (!prems.length) continue;

        const groupMetadata = await conn.groupMetadata(chatId).catch(() => null);
        const groupName = groupMetadata?.subject || 'Gruppo senza nome';

text += `━━━━━━━━━━━━━━━━━━━`;
text += `\n● \`𝐆𝐫𝐮𝐩𝐩𝐨\` 💬\n`;
text += `${groupName}\n`;
text += `● \`𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢\` 👮🏻‍♂️\n`;

prems.forEach((user, index) => {
    let jid = user.includes('@s.whatsapp.net')
        ? user
        : `${user}@s.whatsapp.net`;

    mentions.push(jid);

    text += `${String(index + 1).padStart(2, '0')}. @${jid.split('@')[0]}\n`;
});
    }

    if (text === `╭━━━━━━━━━━━━━━━━━━━╮
┃✨ _*𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐩𝐞𝐫 𝐠𝐫𝐮𝐩𝐩𝐨*_ ✨┃
╰━━━━━━━━━━━━━━━━━━━╯\n`) {
        return m.reply('𝐍𝐨𝐧 𝐜𝐢 𝐬𝐨𝐧𝐨 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐧𝐞𝐢 𝐠𝐫𝐮𝐩𝐩𝐢.');
    }

    
    await conn.sendMessage(m.chat, { text, mentions });
};

handler.help = ['listmod'];
handler.tags = ['owner'];
handler.command = /^(listmod|listamod)$/i;
handler.rowner = true;

export default handler;