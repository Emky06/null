//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, participants, groupMetadata, args }) => {
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    const groupAdmins = participants
        .filter(p => p.admin && p.jid !== botId)
        .map(p => p.jid);

    const groupName = groupMetadata?.subject || 'Gruppo senza nome';

    let pesan = args.join(' ');
    let message = pesan ? pesan : '❌ Nessun messaggio fornito';

    const num = ['𝟏','𝟐','𝟑','𝟒','𝟓','𝟔','𝟕','𝟖','𝟗','𝟎'];

    let text = `╭━━━━━━━━━━━━━━━━━━━╮
         _*𝐀𝐝𝐦𝐢𝐧 𝐝𝐢  ${groupName}*_
╰━━━━━━━━━━━━━━━━━━━╯

✎ *𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨:*  
➥ ${message}

╭━━━━━━━━━━━━━━━━━━━╮
`;

    let mentions = [];

    if (groupAdmins.length) {
        groupAdmins.forEach((jid, i) => {
            mentions.push(jid);
            text += `┣➤ 🛡️ ${num[i] || i + 1} @${jid.split('@')[0]}\n`;
        });
    }

    text += `╰━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text, mentions });
};

handler.help = ['admins <messaggio>'];
handler.tags = ['group'];
handler.command = ['admins', '@admins', 'dmins'];
handler.group = true;

export default handler;