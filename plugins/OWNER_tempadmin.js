let handler = async (m, { conn, args, text }) => {
    if (!args[0] || isNaN(args[0])) return m.reply('𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥𝐥`𝐮𝐬𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨.\n𝐋`𝐮𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨 𝐞̀ 𝐢𝐥 𝐬𝐞𝐠𝐮𝐞𝐧𝐭𝐞:\n.𝐭𝐞𝐦𝐩𝐚𝐝𝐦𝐢𝐧 + 𝐧𝐮𝐦𝐞𝐫𝐨 𝐢𝐧 𝐦𝐢𝐧𝐮𝐭𝐢 + @𝐭𝐚𝐠');

    const minutes = parseInt(args[0]);
    if (minutes <= 0) return m.reply('𝐍𝐮𝐦𝐞𝐫𝐨 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨');

    let users = [];

    if (m.mentionedJid.length) {
        users = m.mentionedJid;
    } else if (m.quoted) {
        users.push(m.quoted.sender);
    } else {
        return m.reply('𝐂𝐡𝐢 𝐝𝐞𝐯𝐨 𝐩𝐫𝐨𝐦𝐮𝐨𝐯𝐞𝐫𝐞❔');
    }

    for (let user of users) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');

            let unit = minutes === 1 ? '𝒎𝒊𝒏𝒖𝒕𝒐' : '𝒎𝒊𝒏𝒖𝒕𝒊';
            m.reply(`@${user.split('@')[0]}  𝒔𝒂𝒓𝒂̀ 𝒂𝒅𝒎𝒊𝒏 𝒑𝒆𝒓 ${minutes} ${unit} 💎`, null, {
                mentions: [user]
            });

            setTimeout(async () => {
                try {
                    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
                    await conn.sendMessage(m.chat, { text: `𝑻𝒆𝒎𝒑𝒐 𝒔𝒄𝒂𝒅𝒖𝒕𝒐. @${user.split('@')[0]}  𝒏𝒐𝒏 𝒆̀ 𝒑𝒊𝒖̀ 𝒂𝒅𝒎𝒊𝒏 🚫 `, mentions: [user] });
                } catch (e) {
                    console.error(`Errore nel retrocedere ${user}:`, e);
                }
            }, minutes * 60 * 1000);

        } catch (e) {
            console.error(`Errore nel promuovere ${user}:`, e);
            m.reply(`𝐄𝐫𝐫𝐨𝐫𝐞 𝐜𝐨𝐧 @${user.split('@')[0]}`, null, { mentions: [user] });
        }
    }
};

handler.command = /^(tempadmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;