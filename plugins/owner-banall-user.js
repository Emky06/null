//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, args, command }) => {

    let target = m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.quoted 
        ? m.quoted.sender 
        : null;

if (!target) {
    return conn.reply(
        m.chat, 
        '⚠️ 𝐃𝐞𝐯𝐢 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐝𝐚 𝐫𝐢𝐦𝐨𝐯𝐞𝐫𝐞!\n\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: .banall @user 𝐨𝐩𝐩𝐮𝐫𝐞 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 .banall', 
        m
    );
}

    let groups = await conn.groupFetchAllParticipating();

    let removedGroups = [];

    for (let id in groups) {


            let participants = groups[id].participants.map(p => p.id);

            if (participants.includes(conn.user.jid) && participants.includes(target)) {

                try {

                    await conn.groupParticipantsUpdate(id, [target], 'remove');

                    removedGroups.push(groups[id].subject);

                } catch (e) {

                    await conn.reply(id, `❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞 @${target.split('@')[0]} 𝐝𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`, m, { mentions: [target] });

                }

            }

    }

    let message = `🛑 *𝐑𝐞𝐩𝐨𝐫𝐭*:\n𝐇𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 @${target.split('@')[0]} 𝐝𝐚 ${removedGroups.length} 𝐠𝐫𝐮𝐩𝐩𝐢.\n\n📋 𝐄𝐥𝐞𝐧𝐜𝐨 𝐠𝐫𝐮𝐩𝐩𝐢:\n- ${removedGroups.join('\n- ') || '*𝐍𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨*'}`;

await conn.reply(m.chat, message, null, { mentions: [target] });

}

handler.command = /^(banall|takeover)$/i;
handler.group = true;
handler.owner = true;

export default handler;