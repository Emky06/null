//Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, participants, isOwner }) => {
    if (!m.isGroup) {
        return conn.reply(m.chat, '❌ Questo comando può essere usato solo nei gruppi!', m);
    }

    if (!isOwner) {
        return conn.reply(m.chat, '❌ Solo il proprietario del bot può usare questo comando!', m);
    }

    for (const p of participants) {
        const user = global.db.data.users[p.id];
        if (user) {
            user.blasphemy = 0;
        }
    }

    conn.reply(
        m.chat,
        `✅ 𝐇𝐨 𝐚𝐳𝐳𝐞𝐫𝐚𝐭𝐨 𝐥𝐞 𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞 𝐝𝐢 𝐭𝐮𝐭𝐭𝐢 𝐢 𝐦𝐞𝐦𝐛𝐫𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.`,
        m
    );
};

handler.command = /^azzeratuttibstm$/i;
handler.rowner = true;
handler.group = true;

export default handler;