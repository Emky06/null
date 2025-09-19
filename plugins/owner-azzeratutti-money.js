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
            user.money = 0;
            user.bank = 0;
        }
    }

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