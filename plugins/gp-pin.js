const pinQueue = new Map();

let handler = async (m, { conn, command, usedPrefix }) => {
    if (command === 'pin') {
        if (!m.quoted) return m.reply(`⚠️ Rispondi a un messaggio per fissarlo.`);

        pinQueue.set(m.chat, m.quoted);

        const buttons = [
            { buttonId: `${usedPrefix}pinnow`, buttonText: { displayText: '📍 Fissa Ora' }, type: 1 },
            { buttonId: `${usedPrefix}cancelpin`, buttonText: { displayText: '❌ Annulla' }, type: 1 }
        ];

        await conn.sendMessage(m.chat, {
            text: 'Vuoi fissare questo messaggio?',
            buttons,
            headerType: 1
        });
        return;
    }

    if (command === 'pinnow') {
        const quoted = pinQueue.get(m.chat);
        if (!quoted) return m.reply('❌ Nessun messaggio da fissare.');

        try {
            // Metodo 1: Usa l'ID del messaggio direttamente
            await conn.sendMessage(m.chat, {
                pin: {
                    key: {
                        remoteJid: m.chat,
                        id: quoted.id
                    }
                }
            });
            
            // Metodo alternativo: prova con chatModify
            // await conn.chatModify({ pin: true }, m.chat, quoted.id);
            
            m.reply('✅ Messaggio fissato con successo!');
            pinQueue.delete(m.chat);
        } catch (e) {
            console.error('Errore pin:', e);
            m.reply('❌ Impossibile fissare: ' + e.message);
        }
        return;
    }

    if (command === 'cancelpin') {
        pinQueue.delete(m.chat);
        m.reply('❌ Operazione annullata.');
        return;
    }

    if (command === 'unpin') {
        if (!m.quoted) return m.reply('⚠️ Rispondi a un messaggio fissato per rimuoverlo.');

        try {
            await conn.sendMessage(m.chat, {
                unpin: {
                    key: {
                        remoteJid: m.chat,
                        id: m.quoted.id
                    }
                }
            });
            m.reply('✅ Messaggio rimosso dai fissati.');
        } catch (e) {
            console.error(e);
            m.reply('❌ Errore: ' + e.message);
        }
        return;
    }
};

handler.help = ['pin', 'unpin'];
handler.tags = ['gruppo'];
handler.command = ['pin', 'unpin', 'pinnow', 'cancelpin'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;