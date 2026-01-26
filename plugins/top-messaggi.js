import fs from 'fs';

let handler = async (m, { conn, args }) => {
    try {
        const users = global.db.data.users || {};
        
        // Ottieni i metadati del gruppo
        let groupMetadata;
        try {
            groupMetadata = await conn.groupMetadata(m.chat);
        } catch (e) {
            return conn.reply(m.chat, "⚠︎ Errore nel recuperare i dati del gruppo!", m);
        }
        
        const participants = groupMetadata.participants || [];
        
        // DEBUG COMPLETO
        console.log('🔍 DEBUG TOP COMPLETO:');
        console.log('- Numero partecipanti:', participants.length);
        console.log('- Utenti nel DB:', Object.keys(users).length);
        
        // Crea array di dati utente
        let usersData = [];
        
        for (let participant of participants) {
            const userId = participant.id;
            if (userId === conn.user.jid) continue; // Salta il bot
            
            const userData = users[userId];
            const messaggiCount = userData?.messaggi || 0;
            
            console.log(`👤 ${userId.split('@')[0]}: ${messaggiCount} messaggi`);
            
            if (messaggiCount > 0) {
                usersData.push({
                    messaggi: messaggiCount,
                    jid: userId,
                    name: participant.name || userId.split('@')[0]
                });
            }
        }
        
        console.log('📋 Utenti con messaggi > 0:', usersData.length);
        
        if (usersData.length === 0) {
            return conn.reply(m.chat, "⚠︎ Nessun utente ha inviato messaggi nel gruppo!", m);
        }
        
        let count = 10;
        if (args[0] && ['10', '50', '100'].includes(args[0])) count = parseInt(args[0]);
        
        let sorted = usersData.sort((a, b) => b.messaggi - a.messaggi).slice(0, count);
        
        let message = `🏆 𝕋𝕆ℙ 𝕄𝔼𝕊𝕊𝔸𝔾𝔾𝕀 🏆\n\n`;
        let mentions = [];
        let userPosition = null;
        
        sorted.forEach((user, i) => {
            let medal = "🏅";
            if (i === 0) medal = "🥇";
            else if (i === 1) medal = "🥈";
            else if (i === 2) medal = "🥉";
            
            message += `${medal} *${i + 1}.* @${user.jid.split('@')[0]} ➠ ${user.messaggi} messaggi\n`;
            mentions.push(user.jid);
            
            if (user.jid === m.sender) userPosition = i + 1;
        });
        
        let totalPlayers = participants.length - 1;
        let userMessage = userPosition
            ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
            : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;
        
        const profileBuffer = fs.readFileSync('./icone/messaggi.png');
        
        const quotedMessage = {
            key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
            message: {
                locationMessage: {
                    name: "Top Messaggi",
                    jpegThumbnail: profileBuffer,
                    vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
                }
            },
            participant: "0@s.whatsapp.net"
        };
        
        await conn.sendMessage(m.chat, {
            text: message + `\n\n${userMessage}`,
            mentions: mentions
        }, { quoted: quotedMessage });
        
    } catch (error) {
        console.error('❌ Errore in top:', error);
        conn.reply(m.chat, `❌ Errore: ${error.message}`, m);
    }
};

handler.command = /^top$/i;
export default handler;