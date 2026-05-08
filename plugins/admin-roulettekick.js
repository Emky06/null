//Plugin fatto da Axtral_WiZaRd
function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

let handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return m.reply("⚠️ Questo comando funziona solo nei gruppi!");

    let groupMetadata = await conn.groupMetadata(m.chat);
    let owner = groupMetadata.owner;

    let validParticipants = participants
        .filter(p => !p.admin && p.id !== owner && conn.decodeJid(p.id) !== conn.decodeJid(conn.user.jid))
        .map(p => conn.decodeJid(p.id))
        .filter(id => id.endsWith('@s.whatsapp.net'));

    if (validParticipants.length < 1) {
        return m.reply("😅 Non ci sono utenti sacrificabili in questo gruppo.");
    }

    let messaggio = await conn.reply(m.chat, `🎯 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎*\n\n🔄 Preparando la ruota...`, m);

    for (let i = 0; i < 6; i++) {
        await delay(1500);
        let randomNames = [...validParticipants].sort(() => 0.5 - Math.random()).slice(0, 4);
        let righe = randomNames.map(u => `@${u.split('@')[0]}`).join(" | ");
        
        await conn.sendMessage(m.chat, { 
            edit: messaggio.key, 
            text: `🎯 *𝐑𝐎𝐔𝐋𝐄𝐓𝐓𝐄 𝐑𝐔𝐒𝐒𝐀*\n\n[ ${righe} ]`,
            mentions: randomNames
        });
    }

    await delay(2000);

    let esito = Math.floor(Math.random() * 4); 
    if (esito === 0) {
        await conn.sendMessage(m.chat, { 
            edit: messaggio.key, 
            text: `😮 𝐏𝐞𝐫 𝐪𝐮𝐞𝐬𝐭𝐚 𝐯𝐨𝐥𝐭𝐚 𝐬𝐢𝐞𝐭𝐞 𝐭𝐮𝐭𝐭𝐢 𝐬𝐚𝐥𝐯𝐢.`
        });
    } else {
        let scelto = validParticipants[Math.floor(Math.random() * validParticipants.length)];
        await conn.sendMessage(m.chat, { 
            edit: messaggio.key, 
            text: `💥 𝐄̀ 𝐮𝐬𝐜𝐢𝐭𝐨 @${scelto.split('@')[0]}, 𝐚𝐝𝐝𝐢𝐨 𝐩𝐥𝐞𝐛𝐞𝐨.`,
            mentions: [scelto]
        });
    }
};

handler.command = /^rouletterussa$/i;
handler.staff = true;
handler.group = true;

export default handler;