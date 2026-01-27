import fs from 'fs';

let handler = async (m, { conn, args }) => {
    try {
        console.log('🚀 AVVIO COMANDO TOP');
        
        // Prendi i dati del database
        const users = global.db.data?.users || {};
        console.log(`📊 Totale utenti nel DB: ${Object.keys(users).length}`);
        
        // Prendi i metadati del gruppo
        let groupMetadata;
        try {
            groupMetadata = await conn.groupMetadata(m.chat);
            console.log(`👥 Partecipanti nel gruppo: ${groupMetadata.participants.length}`);
        } catch (error) {
            console.error('❌ Errore nel prendere i metadati:', error);
            return m.reply("❌ Errore nel recuperare i dati del gruppo!");
        }
        
        const participants = groupMetadata.participants || [];
        
        // Crea l'array dei dati
        let usersData = [];
        let foundCurrentUser = false;
        
        for (let participant of participants) {
            const userId = participant.id;
            
            // Salta il bot
            if (userId === conn.user.jid) continue;
            
            const userData = users[userId] || {};
            const messaggiCount = userData.messaggi || 0;
            
            // DEBUG: mostra l'utente corrente
            if (userId === m.sender) {
                console.log(`🎯 UTENTE CORRENTE: ${userId.split('@')[0]} - ${messaggiCount} messaggi`);
                foundCurrentUser = true;
            }
            
            usersData.push({
                messaggi: messaggiCount,
                jid: userId,
                name: participant.name || participant.notify || userId.split('@')[0]
            });
        }
        
        if (!foundCurrentUser) {
            console.log(`⚠️ Utente corrente ${m.sender.split('@')[0]} non trovato nei partecipanti!`);
        }
        
        console.log(`📋 Dati elaborati: ${usersData.length} utenti`);
        
        // Filtra se vuoi mostrare solo chi ha messaggi > 0 (commenta se vuoi tutti)
        usersData = usersData.filter(user => user.messaggi > 0);
        console.log(`📋 Utenti con messaggi > 0: ${usersData.length}`);
        
        if (usersData.length === 0) {
            return m.reply("⚠️ Nessun utente ha inviato messaggi nel gruppo!");
        }
        
        // Ordina per messaggi
        let sorted = usersData.sort((a, b) => b.messaggi - a.messaggi);
        
        // Limita il numero
        let count = 10;
        if (args[0] && ['10', '50', '100'].includes(args[0])) {
            count = parseInt(args[0]);
        }
        sorted = sorted.slice(0, count);
        
        // Crea il messaggio
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
            
            if (user.jid === m.sender) {
                userPosition = i + 1;
                console.log(`🏆 Posizione trovata: ${userPosition}°`);
            }
        });
        
        // Trova la posizione esatta se non è nella top
        if (userPosition === null) {
            const allSorted = usersData.sort((a, b) => b.messaggi - a.messaggi);
            const exactPosition = allSorted.findIndex(user => user.jid === m.sender) + 1;
            if (exactPosition > 0) {
                userPosition = exactPosition;
                console.log(`📊 Posizione esatta fuori top: ${userPosition}°`);
            }
        }
        
        let totalPlayers = participants.length - 1; // -1 per escludere il bot
        let userMessage = userPosition
            ? `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞 𝐞̀ ${userPosition}° 𝐬𝐮 ${totalPlayers}`
            : `𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: 𝐧𝐞𝐬𝐬𝐮𝐧𝐚`;
        
        console.log(`📤 Invio messaggio con ${sorted.length} utenti nella top...`);
        
        // Prepara l'anteprima
        const profileBuffer = fs.readFileSync('./icone/top.png');
        
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
        
        console.log('✅ Comando top completato con successo!');
        
    } catch (error) {
        console.error('❌ Errore critico in top:', error);
        m.reply(`❌ Errore: ${error.message}`);
    }
};

handler.command = /^top$/i;
handler.group = true;
export default handler;