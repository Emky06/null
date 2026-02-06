//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, participants, isOwner }) => {
    if (!m.isGroup) {
        return conn.reply(m.chat, '❌ Questo comando può essere usato solo nei gruppi!', m);
    }

    if (!isOwner) {
        return conn.reply(m.chat, '❌ Solo il proprietario del bot può usare questo comando!', m);
    }

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');

    let usersToReset = participants
        .map(p => p.jid)
        .filter(jid => jid && !ownerJids.includes(jid));

    for (const jid of usersToReset) {
        const user = global.db.data.users[jid];
        if (user) {
            user.messaggi = 0;
        }
    }

    if (global.db.write) await global.db.write();

    conn.reply(
        m.chat,
        `✅ 𝐇𝐨 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐨 𝐢 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢 𝐝𝐢 𝐭𝐮𝐭𝐭𝐢 𝐢 𝐦𝐞𝐦𝐛𝐫𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.`,
        m
    );
};

handler.command = /^removeallmsg$/i;
handler.rowner = true;
handler.group = true;

export default handler;