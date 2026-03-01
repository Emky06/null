let handler = async (m, { conn }) => {

    let target = m.mentionedJid?.[0] 
        || (m.quoted ? m.quoted.sender : null);

    if (!target) {
        return conn.reply(
            m.chat,
            '⚠️ 𝐃𝐞𝐯𝐢 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐨𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐝𝐚 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐞!\n\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: .banall @user',
            m
        );
    }

    let groups = await conn.groupFetchAllParticipating();

    let removedGroups = [];

    for (let id in groups) {
        let group = groups[id];

        try {
            let participants = group.participants.map(p => p.id);

            if (
                participants.includes(conn.user.jid) &&
                participants.includes(target)
            ) {
                await conn.groupParticipantsUpdate(id, [target], 'remove');
                removedGroups.push(group.subject);
            }

        } catch (e) {
            console.log(e);
        }
    }

    let report = `🛑 𝐑𝐞𝐩𝐨𝐫𝐭 𝐁𝐚𝐧𝐚𝐥𝐥\n\n` +
        `👤 𝐔𝐭𝐞𝐧𝐭𝐞: @${target.split('@')[0]}\n` +
        `📋 𝐑𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚 ${removedGroups.length} 𝐠𝐫𝐮𝐩𝐩𝐢\n\n` +
        `📌 𝐄𝐥𝐞𝐧𝐜𝐨 𝐠𝐫𝐮𝐩𝐩𝐢:\n` +
        `- ${removedGroups.join('\n- ') || '𝐍𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨'}`;

    await conn.reply(m.chat, report, m, { mentions: [target] });
};

handler.command = /^(banall|takeover)$/i;
handler.owner = true;
handler.group = true;

export default handler;