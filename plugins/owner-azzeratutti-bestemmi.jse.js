//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, participants, isOwner }) => {
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
            user.blasphemy = 0;
        }
    }

    if (global.db.write) await global.db.write();

    conn.reply(
        m.chat,
        `✅ 𝐋𝐞 𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞 𝐝𝐢 𝐭𝐮𝐭𝐭𝐢 𝐢 𝐦𝐞𝐦𝐛𝐫𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐬𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐞 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐞.`,
        m
    );
};

handler.command = /^removeallblasph/i;
handler.rowner = true;
handler.group = true;

export default handler;