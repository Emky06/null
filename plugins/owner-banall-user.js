let handler = async (m, { conn }) => {

    let target = m.mentionedJid?.[0] 
        ? m.mentionedJid[0] 
        : m.quoted?.sender || null;

    if (!target) {
        return conn.reply(
            m.chat, 
            '⚠️ 𝐃𝐞𝐯𝐢 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐝𝐚 𝐫𝐢𝐦𝐨𝐯𝐞𝐫𝐞!\n\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: .banall @user 𝐨𝐩𝐩𝐮𝐫𝐞 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐜𝐨𝐧 .banall', 
            m
        );
    }

    const clean = jid => jid.split(':')[0];

    let groups = await conn.groupFetchAllParticipating().catch(() => ({}));

    let removedGroups = [];

    for (let id in groups) {

        if (!id.endsWith('@g.us')) continue;

        try {

            const metadata = await conn.groupMetadata(id);
            const participants = metadata.participants || [];

            const isTargetInside = participants.some(p => clean(p.id) === clean(target));
            if (!isTargetInside) continue;

            const botData = participants.find(p => clean(p.id) === clean(conn.user.jid));
            const isBotAdmin = botData?.admin === 'admin' || botData?.admin === 'superadmin';

            if (!isBotAdmin) continue;

            await conn.groupParticipantsUpdate(id, [target], 'remove');

            removedGroups.push(metadata.subject);

        } catch (e) {
            console.log('Errore gruppo:', id, e.message);
        }
    }

    let message = `🛑 *𝐑𝐞𝐩𝐨𝐫𝐭*:
𝐇𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 @${target.split('@')[0]} 𝐝𝐚 ${removedGroups.length} 𝐠𝐫𝐮𝐩𝐩𝐢.

📋 𝐄𝐥𝐞𝐧𝐜𝐨 𝐠𝐫𝐮𝐩𝐩𝐢:
- ${removedGroups.join('\n- ') || '*𝐍𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨*'}`;

    await conn.reply(m.chat, message, null, { mentions: [target] });
};

handler.command = /^(banall|takeover)$/i;
handler.group = true;
handler.owner = true;

export default handler;