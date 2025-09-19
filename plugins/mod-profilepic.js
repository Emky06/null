//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text, isPrems }) => {

    if (!isPrems) return m.reply('*❌ Solo moderatori possono usare questo comando.*')

    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;


    if (who === conn.user.jid) {
        await conn.sendMessage(m.chat, { 
            text: `🚫 Impossibile ottenere la foto profilo del bot.` 
        }, { quoted: m });
        return;
    }

    // Verifica se l'utente è uno degli owner
    if (global.owner.some(o => (Array.isArray(o) ? o[0] : o) + '@s.whatsapp.net' === who)) {
        await conn.sendMessage(m.chat, {
            text: `🚫 Impossibile ottenere la foto profilo di un owner.`
        }, { quoted: m });
        return;
    }

    try {
        // Recupera la foto profilo dell'utente (se esiste)
        let profilePicture = await conn.profilePictureUrl(who, 'image');
        await conn.sendMessage(m.chat, { 
            image: { url: profilePicture }, 
            caption: `📸` 
        }, { quoted: m, mentions: [who] });
    } catch (e) {
        // Caso in cui l'utente non ha una foto profilo o non è disponibile
        await conn.sendMessage(m.chat, { 
            text: `@${who.split('@')[0]} 𝐧𝐨𝐧 𝐡𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 🚫`, 
            mentions: [who] 
        }, { quoted: m });
    }
};

handler.command = /^(foto)$/i;
handler.group = true;
handler.premium = true;

export default handler;