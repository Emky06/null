//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, participants, groupMetadata, args }) => {
    if (!global.db || !global.db.data.groups)
        return m.reply('Nessun dato disponibile.');

    const groupId = m.chat;
    const groupData = global.db.data.groups[groupId];
    const prems = groupData?.prems || [];

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    const groupAdmins = participants
        .filter(p => p.admin && p.jid !== botId)
        .map(p => p.jid);

    const groupName = groupMetadata?.subject || 'Gruppo senza nome';

    let pesan = args.join(' ');
    let message = pesan ? pesan : '❌ Nessun messaggio fornito';


    let text = `╭━━━━━━━━━━━━━━━━━━━╮
         _*𝐒𝐭𝐚𝐟𝐟 𝐝𝐢  ${groupName}*_
╰━━━━━━━━━━━━━━━━━━━╯

✎ *𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨:*  
➥ ${message}

╭━━━━━━━━━━━━━━━━━━━╮
`;

    let mentions = [];

    if (groupAdmins.length) {
        text += `┃              *🛡️ 𝐀𝐝𝐦𝐢𝐧 🛡️*\n`;
        groupAdmins.forEach((jid, i) => {
            mentions.push(jid);
            text += `┣➤ 🛡️ @${jid.split('@')[0]}\n`;
        });
    }

    if (prems.length) {
        text += `┣━━━━━━━━━━━━━━━━━━━┫\n┃           *👮🏻‍♂️ 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 👮🏻‍♂️*\n`;
        prems.forEach((user, i) => {
            let jid = user.includes('@s.whatsapp.net')
                ? user
                : `${user}@s.whatsapp.net`;

            mentions.push(jid);
            text += `┣➤ 👮🏻‍♂️ @${jid.split('@')[0]}\n`;
        });
    }

    text += `╰━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(groupId, { text, mentions });
};

handler.help = ['staff <messaggio>'];
handler.tags = ['group'];
handler.command = /^staff$/i;
handler.group = true;

export default handler;