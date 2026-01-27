import fs from 'fs';

let handler = async (m, { conn, args }) => {
    try {
        // 1. Ottieni tutti gli utenti dal database
        const allUsers = global.db.data.users || {};
        
        // 2. Ottieni i partecipanti del gruppo corrente
        const groupData = await conn.groupMetadata(m.chat);
        const groupParticipants = groupData.participants || [];
        
        // 3. Prepara l'array con i dati
        let topData = [];
        
        for (let participant of groupParticipants) {
            const userJid = participant.id;
            
            // Salta il bot stesso
            if (userJid === conn.user.jid) continue;
            
            // Cerca i dati dell'utente nel database
            const userData = allUsers[userJid];
            const messaggi = userData?.messaggi || 0;
            
            topData.push({
                jid: userJid,
                name: participant.name || participant.notify || userJid.split('@')[0],
                messaggi: messaggi
            });
        }
        
        // 4. Ordina dal più alto al più basso
        topData.sort((a, b) => b.messaggi - a.messaggi);
        
        // 5. Filtra chi ha 0 messaggi (opzionale, commenta se vuoi tutti)
        topData = topData.filter(user => user.messaggi > 0);
        
        if (topData.length === 0) {
            return m.reply("📭 Nessun utente ha messaggi registrati in questo gruppo!");
        }
        
        // 6. Limita i risultati
        let limit = 10;
        if (args[0]) {
            const num = parseInt(args[0]);
            if ([10, 20, 50, 100].includes(num)) limit = num;
        }
        
        const topResults = topData.slice(0, limit);
        
        // 7. Crea il messaggio della classifica
        let leaderboard = "🏆 *CLASSIFICA MESSAGGI* 🏆\n\n";
        let mentions = [];
        
        topResults.forEach((user, index) => {
            // Medaglie per i primi 3
            let medal = "▫️";
            if (index === 0) medal = "🥇";
            else if (index === 1) medal = "🥈";
            else if (index === 2) medal = "🥉";
            else if (index < 10) medal = `${index + 1}️⃣`;
            
            leaderboard += `${medal} *${index + 1}.* @${user.jid.split('@')[0]}\n`;
            leaderboard += `   📊 ${user.messaggi} messaggi\n\n`;
            mentions.push(user.jid);
        });
        
        // 8. Trova la posizione dell'utente che ha eseguito il comando
        const userIndex = topData.findIndex(user => user.jid === m.sender);
        const userPosition = userIndex + 1;
        
        let userStats = "";
        if (userPosition > 0) {
            const userMessages = topData[userIndex].messaggi;
            userStats = `\n─────────────────\n`;
            userStats += `📈 *La tua posizione:* ${userPosition}° / ${topData.length}\n`;
            userStats += `💬 *I tuoi messaggi:* ${userMessages}`;
        } else {
            userStats = `\n─────────────────\n`;
            userStats += `📭 *Non sei in classifica*\n`;
            userStats += `💬 Invia più messaggi per apparire!`;
        }
        
        // 9. Crea il messaggio finale
        const finalMessage = leaderboard + userStats;
        
        // 10. Invia il messaggio con menzioni
        await conn.sendMessage(m.chat, {
            text: finalMessage,
            mentions: mentions
        }, { quoted: m });
        
    } catch (error) {
        console.error("❌ Errore nel comando top:", error);
        m.reply("❌ Si è verificato un errore durante la generazione della classifica.");
    }
};

handler.help = ['top'];
handler.tags = ['group'];
handler.command = ['top', 'classifica', 'leaderboard'];
handler.group = true;

export default handler;