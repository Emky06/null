//Plugin fatto da Axtral_WiZaRd
import fs from "fs"
import path from "path"

let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps.length === 0) return;
    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "axtralnuke":  
            if (!bot.restrict) return;
            if (!isBotAdmin) return;

            global.db.data.chats[m.chat].welcome = false;

            // Invio sticker 
            try {
                let stickerPath = path.join("./icone/nuke.webp")
                let sticker = fs.readFileSync(stickerPath)

                await conn.sendMessage(m.chat, { 
                    sticker: sticker 
                })
            } catch (e) {
                console.error("Errore nell'invio dello sticker:", e)
            }

            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: '*CI SPOSTIAMO QUI:*\nhttps://chat.whatsapp.com/EUm01LBti4FGqvsudo1h3J',
                mentions: utenti
            });
            
            // Filtro per escludere gli owner del bot
            let ownerIDs = (global.owner || [])
                .map(o => (typeof o === 'object' ? o[0] : o))
                .map(id => id.includes('@s.whatsapp.net') ? id : id + '@s.whatsapp.net');

            // Esclude il bot stesso e gli owner
            let users = ps.filter(id => !ownerIDs.includes(id));

            if (isBotAdmin && bot.restrict) { 
                await delay(1);
                await conn.groupParticipantsUpdate(m.chat, users, 'remove');
            } else return;
            break;           
    }
};

handler.command = /^(axtralnuke)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;
export default handler;
