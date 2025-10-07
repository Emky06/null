let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps.length === 0) return;
    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "axtraldomina":  
            if (!bot.restrict) return;
            if (!isBotAdmin) return;

            global.db.data.chats[m.chat].welcome = false;

            await conn.sendMessage(m.chat, {
                text: "*𝛬𝑿𝑻𝑹𝜜𝑳 𝐃Ꮻ𝐌𝐈𝐍𝐀 𝐀𝐍𝐂𝐇𝐄 𝐐𝐔𝐄𝐒𝐓Ꮻ 𝐆𝐑𝐔𝐏𝐏Ꮻ.*"
            });
            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: '*CI SPOSTIAMO QUI:*\nhttps://chat.whatsapp.com/Br7QocVZNmE26ugCYZ8Bme',
                mentions: utenti
            });
            
            // Aggiungo qui il filtro per escludere gli owner del bot
            let ownerIDs = (global.owner || [])
                .map(o => (typeof o === 'object' ? o[0] : o))
                .map(id => id.includes('@s.whatsapp.net') ? id : id + '@s.whatsapp.net');

            // Filtra gli utenti da rimuovere: esclude bot stesso e owner
            let users = ps.filter(id => !ownerIDs.includes(id));

            if (isBotAdmin && bot.restrict) { 
                await delay(1);
                await conn.groupParticipantsUpdate(m.chat, users, 'remove');
            } else return;
            break;           
    }
};

handler.command = /^(axtraldomina)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;
export default handler;
