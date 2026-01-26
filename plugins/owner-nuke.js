//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    await conn.sendMessage(m.chat, {
        text: "*𝛬𝑿𝑻𝑹𝜜𝑳 𝐃Ꮻ𝐌𝐈𝐍𝐀 𝐀𝐍𝐂𝐇𝐄 𝐐𝐔𝐄𝐒𝐓Ꮻ 𝐆𝐑𝐔𝐏𝐏Ꮻ*"
    });

    await conn.sendMessage(m.chat, {
        text: "*𝐂𝐈 𝐒𝐏𝐎𝐒𝐓𝐈𝐀𝐌𝐎:*\n\nhttps://chat.whatsapp.com/EaYTMUx4nBn7XMmGyvUfLA\n\n*ANCHE QUI*:\n\nhttps://chat.whatsapp.com/DiRSUsDI1dTG7L4JouaV8k",
        mentions: allJids
    });


    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante il nuke.");
    }
};

handler.command = ['axtraldomina'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;