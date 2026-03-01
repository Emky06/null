// Plugin fatto da Axtral_WiZaRd + Elixir
let handler = async (m, { conn, args, command, participants, isBotAdmin }) => {

    // Prendi il target dal mention o quoted message
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

    // Assicurati che l'ID target abbia il formato completo
    if (!target.includes('@s.whatsapp.net')) {
        target = target.split('@')[0] + '@s.whatsapp.net';
    }

    let groups = await conn.groupFetchAllParticipating();
    let removedGroups = [];

    for (let id in groups) {
        let group = groups[id];
        
        // Verifica che il bot sia nel gruppo
        if (!group.participants.some(p => p.id === conn.user.jid)) {
            continue;
        }

        // Verifica se il target è nel gruppo (come nel secondo codice)
        let isTargetInGroup = group.participants.some(p => p.id === target);

        if (isTargetInGroup) {
            try {
                await conn.groupParticipantsUpdate(id, [target], 'remove');
                removedGroups.push(group.subject || id);
                
                // Piccolo delay per evitare rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (e) {
                console.error(`Errore nel gruppo ${id}:`, e);
                await conn.reply(m.chat, 
                    `❌ Errore nel rimuovere @${target.split('@')[0]} dal gruppo ${group.subject || id}`, 
                    m, 
                    { mentions: [target] }
                );
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