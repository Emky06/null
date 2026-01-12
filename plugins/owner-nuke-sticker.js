//Plugin fatto da Axtral_WiZaRd
import fs from "fs";
import path from "path";

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

  
    try {
        let stickerPath = path.join("./icone/nuke.webp");
        let sticker = fs.readFileSync(stickerPath);

        await conn.sendMessage(m.chat, { sticker });
    } catch (e) {
        console.error("Errore invio sticker:", e);
    }

 
    await conn.sendMessage(m.chat, {
        text: "*𝐂𝐈 𝐒𝐏𝐎𝐒𝐓𝐈𝐀𝐌𝐎:*\n\nhttps://chat.whatsapp.com/EaYTMUx4nBn7XMmGyvUfLA",
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante il nuke.");
    }
};

handler.command = ['axtralnuke'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;