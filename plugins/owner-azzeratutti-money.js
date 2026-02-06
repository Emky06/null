//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, participants, isOwner }) => {
    if (!m.isGroup) {
        return conn.reply(m.chat, '❌ Questo comando può essere usato solo nei gruppi!', m);
    }

    if (!isOwner) {
        return conn.reply(m.chat, '❌ Solo il proprietario del bot può usare questo comando!', m);
    }

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');

    let usersToReset = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    for (const jid of usersToReset) {
        const user = global.db.data.users[jid];
        if (user) {
            user.money = 0;
            user.bank = 0;
        }
    }

    if (global.db.write) await global.db.write();

    conn.reply(
        m.chat,
        `💸 𝐓𝐮𝐭𝐭𝐢 𝐢 𝐜𝐨𝐧𝐭𝐚𝐧𝐭𝐢 𝐞 𝐢 𝐬𝐨𝐥𝐝𝐢 𝐢𝐧 𝐛𝐚𝐧𝐜𝐚 𝐝𝐞𝐢 𝐦𝐞𝐦𝐛𝐫𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐬𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐢.`,
        m
    );
};

handler.command = /^removeallmoney$/i;
handler.rowner = true;
handler.group = true;

export default handler;