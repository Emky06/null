import fs from 'fs';

let handler = async (m, { conn, args }) => {
    try {
        const users = global.db.data.users || {};
        
        // DEBUG
        console.log('=== DEBUG TOP ===');
        console.log('Utenti nel DB totale:', Object.keys(users).length);
        
        // 1. OTTIENI I PARTECIPANTI REALI DEL GRUPPO
        let groupMetadata;
        try {
            groupMetadata = await conn.groupMetadata(m.chat);
        } catch (error) {
            console.error('Errore nel prendere i metadati:', error);
            return m.reply("❌ Errore nel recuperare i dati del gruppo!");
        }
        
        const participants = groupMetadata.participants || [];
        console.log('Partecipanti nel gruppo:', participants.length);
        
        // 2. PREPARA I DATI PER LA CLASSIFICA
        let usersData = [];
        
        for (let participant of participants) {
            if (participant.id === conn.user.jid) continue; // Salta il bot
            
            const user = users[participant.id] || {};
            const messaggi = user.messaggi || 0;
            
            // DEBUG: mostra alcuni utenti
            if (participant.id === m.sender) {
                console.log(`👤 UTENTE CORRENTE: ${participant.id.split('@')[0]} -> ${messaggi} messaggi`);
            }
            
            if (messaggi > 0) {
                usersData.push({
                    messaggi: messaggi,
                    jid: participant.id,
                    name: participant.name || participant.notify || participant.id.split('@')[0]
                });
            }
        }
        
        console.log('Utenti con messaggi > 0:', usersData.length);
        
        // 3. SE NESSUNO HA MESSAGGI
        if (usersData.length === 0) {
            return m.reply("⚠︎ Nessun utente ha inviato messaggi nel gruppo!");
        }
        
        // 4. ORDINA
        let sorted = usersData.sort((a, b) => b.messaggi - a.messaggi);
        
        // 5. LIMITA IL NUMERO
        let count = 10;
        if (args[0] && ['10', '50', '100'].includes(args[0])) {
            count = parseInt(args[0]);
        }
        sorted = sorted.slice(0, count);
        
        // 6. CREA IL MESSAGGIO
        let message = `🏆 𝕋𝕆ℙ 𝕄𝔼𝕊𝕊𝔸𝔾𝔾𝕀 🏆\n\n`;
        let mentions = [];
        let userPosition = null;
        
        sorted.forEach((user, i) => {
            let medal = "🏅";
            if (i === 0) medal = "🥇";
            else if (i === 1) medal = "🥈";
            else if (i === 2) medal = "🥉";
            
            const username = user.name || user.jid.split('@')[0];
            message += `${medal} *${i + 1}.* @${username} ➠ ${user.messaggi} messaggi\n`;
            mentions.push(user.jid);
            
            if (user.jid === m.sender) userPosition = i + 1;
        });
        
        // 7. TROVA LA POSIZIONE DELL'UTENTE ANCHE SE NON È IN TOP
        if (!userPosition) {
            const allSorted = usersData.sort((a, b) => b.messaggi - a.messaggi);
            const exactIndex = allSorted.findIndex(u => u.jid === m.sender);
            if (exactIndex !== -1) {
                userPosition = exactIndex + 1;
                console.log(`📍 Posizione utente trovata: ${userPosition}°`);
            }
        }
        
        let totalPlayers = participants.length - 1; // -1 per il bot
        let userMessage = userPosition
            ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
            : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;
        
        // 8. PREPARA L'ANTEPRIMA
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
        
        // 9. INVIA
        await conn.sendMessage(m.chat, {
            text: message + `\n\n${userMessage}`,
            mentions: mentions
        }, { quoted: quotedMessage });
        
        console.log('✅ Top inviato con successo!');
        
    } catch (error) {
        console.error('❌ Errore in top:', error);
        m.reply(`❌ Errore: ${error.message}`);
    }
};

handler.command = /^top$/i;
handler.group = true;
export default handler;