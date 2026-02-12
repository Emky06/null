//Plugin creato da Axtral_WiZaRd
let handler = async (m, { conn, isAdmin }) => {  
    if (isAdmin) {
        await conn.sendMessage(m.chat, { text: '𝑺𝒕𝒂𝒊 𝒈𝒊𝒂̀ 𝒓𝒆𝒈𝒏𝒂𝒏𝒅𝒐 𝒊𝒏 𝒒𝒖𝒆𝒔𝒕𝒐 𝒈𝒓𝒖𝒑𝒑𝒐!' });
        return;
    }

    try {  
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote");
        await conn.sendMessage(m.chat, { text: '𝑯𝒂𝒊 𝒓𝒆𝒄𝒍𝒂𝒎𝒂𝒕𝒐 𝒊𝒍 𝒕𝒓𝒐𝒏𝒐. 𝑶𝒓𝒂 𝒓𝒆𝒈𝒏𝒊 𝒔𝒖 𝒒𝒖𝒆𝒔𝒕𝒐 𝒈𝒓𝒖𝒑𝒑𝒐.' });
    } catch (error) {
        await conn.sendMessage(m.chat, { text: `❌ Errore durante la promozione: ${error.message}` });
    }
};

handler.command = /^godmode|regna|𝛬𝑿𝑻𝑹𝜜𝑳|kinderinos|dominus$/i;
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;

export default handler;