import fs from 'fs';

let handler = async (m, { conn, args, participants }) => {
    try {
        const users = global.db.data.users || {};
        
        // DEBUG: Mostra i dati reali
        console.log('📊 DEBUG TOP - Utenti nel DB:', Object.keys(users).length);
        
        // Ottieni tutti i partecipanti del gruppo
        let groupParticipants = participants || [];
        
        // Mappa i dati correttamente
        let usersData = groupParticipants
            .filter(p => p.id !== conn.user.jid)  // Escludi il bot
            .map(p => {
                const userId = p.id;
                const userData = users[userId] || {};
                
                // DEBUG per ogni utente
                console.log(`👤 ${userId.split('@')[0]}: messaggi = ${userData.messaggi || 0}`);
                
                return {
                    messaggi: userData.messaggi || 0,
                    jid: userId,
                    name: p.name || userId.split('@')[0]
                };
            })
            .filter(user => user.messaggi > 0);  // Filtra solo chi ha messaggi > 0

        // DEBUG: Mostra dati estratti
        console.log('📋 Utenti con messaggi > 0:', usersData.length);
        console.log('📋 Dati estratti:', usersData.map(u => `${u.name}: ${u.messaggi}`));

        let count = 10;
        if (args[0] && ['10', '50', '100'].includes(args[0])) count = parseInt(args[0]);

        if (usersData.length === 0) {
            return conn.reply(m.chat, "⚠︎ Nessun utente ha inviato messaggi nel gruppo!", m);
        }

        let sorted = usersData.sort((a, b) => b.messaggi - a.messaggi).slice(0, count);

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

        let totalPlayers = groupParticipants.length - 1; // -1 per escludere il bot
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
        console.error('❌ Errore nel plugin top:', error);
        conn.reply(m.chat, `❌ Errore nel comando top: ${error.message}`, m);
    }
};

handler.command = /^top$/i;
export default handler;