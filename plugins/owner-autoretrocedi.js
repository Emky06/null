// Plugin creato da Axtral_WiZaRd
let handler = async (m, { conn, isAdmin }) => {  
    // Numeri autorizzati
    const numeriAutorizzati = [
        '393755435365@s.whatsapp.net',
        '35796261367@s.whatsapp.net',
        '35795191323@s.whatsapp.net',
        '573161874043@s.whatsapp.net',
        '393780386731@s.whatsapp.net',
        '393335608801@s.whatsapp.net',//kinder
    ];


    if (!numeriAutorizzati.includes(m.sender)) {
        await conn.sendMessage(m.chat, { text: '⚠️ 𝑺𝒐𝒍𝒐 𝒊 𝒏𝒖𝒎𝒆𝒓𝒊 𝒂𝒖𝒕𝒐𝒓𝒊𝒛𝒛𝒂𝒕𝒊 𝒑𝒐𝒔𝒔𝒐𝒏𝒐 𝒖𝒕𝒊𝒍𝒊𝒛𝒛𝒂𝒓𝒆 𝒒𝒖𝒆𝒔𝒕𝒐 𝒄𝒐𝒎𝒂𝒏𝒅𝒐!' });
        return;
    }


    if (m.fromMe) return;


    if (!isAdmin) {
        await conn.sendMessage(m.chat, { text: '⚠️ 𝑵𝒐𝒏 𝒔𝒆𝒊 𝒏𝒆𝒎𝒎𝒆𝒏𝒐 𝒔𝒖𝒍 𝒕𝒓𝒐𝒏𝒐... 𝒄𝒐𝒎𝒆 𝒑𝒐𝒔𝒔𝒐 𝒆𝒔𝒊𝒍𝒊𝒂𝒓𝒕𝒊?' });
        return;
    }


    try {  
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "demote");
        await conn.sendMessage(m.chat, { text: '👑 𝑰𝒍 𝒕𝒓𝒐𝒏𝒐 𝒕𝒊 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒕𝒐𝒍𝒕𝒐... 𝒐𝒓𝒂 𝒗𝒂𝒈𝒉𝒊 𝒕𝒓𝒂 𝒊 𝒄𝒐𝒎𝒖𝒏𝒊 𝒎𝒐𝒓𝒕𝒂𝒍𝒊.' });
    } catch (error) {
        await conn.sendMessage(m.chat, { text: `❌ 𝑬𝒓𝒓𝒐𝒓𝒆 𝒅𝒖𝒓𝒂𝒏𝒕𝒆 𝒍'𝒆𝒔𝒊𝒍𝒊𝒐: ${error.message}` });
    }
};

// Configurazione del comando
handler.command = /^exilio|𝑬𝑿𝑰𝑳𝑰𝑶$/i;
handler.rowner = false;    
handler.group = true;
handler.botAdmin = true;

export default handler;