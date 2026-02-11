const pinQueue = new Map();

let handler = async (m, { conn, command, usedPrefix }) => {
    if (command === 'pin') {
        if (!m.quoted) return m.reply(`⚠️ Rispondi a un messaggio per fissarlo.`);

        pinQueue.set(m.chat, m.quoted);

        const buttons = [
            { buttonId: `${usedPrefix}pin1d`, buttonText: { displayText: '⏳ 1 Giorno' }, type: 1 },
            { buttonId: `${usedPrefix}pin7d`, buttonText: { displayText: '⏳ 7 Giorni' }, type: 1 },
            { buttonId: `${usedPrefix}pin30d`, buttonText: { displayText: '⏳ 30 Giorni' }, type: 1 },
        ];

        await conn.sendMessage(m.chat, {
            text: 'Scegli per quanto tempo vuoi fissare il messaggio:',
            buttons,
            headerType: 1
        });
        return;
    }

    if (['pin1d', 'pin7d', 'pin30d'].includes(command)) {
        // Recupero il messaggio da pinnare salvato in pinQueue
        const quoted = pinQueue.get(m.chat);
        if (!quoted) return m.reply('❌ Nessun messaggio da fissare. Usa prima il comando pin rispondendo a un messaggio.');

        const messageKey = {
            remoteJid: m.chat,
            fromMe: quoted.fromMe,
            id: quoted.id,
            participant: quoted.sender
        };

        // Calcolo durata in ms in base al comando
        let durationMs = 0;
        if (command === 'pin1d') durationMs = 1 * 24 * 60 * 60 * 1000;
        else if (command === 'pin7d') durationMs = 7 * 24 * 60 * 60 * 1000;
        else if (command === 'pin30d') durationMs = 30 * 24 * 60 * 60 * 1000;

        try {
            // PROVA TUTTI I METODI POSSIBILI
            let pinned = false;
            
            // Metodo 1: sendMessage standard
            try {
                await conn.sendMessage(m.chat, { 
                    pin: { 
                        key: messageKey, 
                        type: 1 
                    } 
                });
                pinned = true;
            } catch (e1) {
                console.log('Metodo 1 fallito:', e1.message);
                
                // Metodo 2: sendMessage senza type
                try {
                    await conn.sendMessage(m.chat, { 
                        pin: { 
                            key: messageKey
                        } 
                    });
                    pinned = true;
                } catch (e2) {
                    console.log('Metodo 2 fallito:', e2.message);
                    
                    // Metodo 3: chatModify
                    try {
                        await conn.chatModify(
                            { pin: true },
                            m.chat,
                            [quoted.id]
                        );
                        pinned = true;
                    } catch (e3) {
                        console.log('Metodo 3 fallito:', e3.message);
                        
                        // Metodo 4: messageKey minimale
                        try {
                            await conn.sendMessage(m.chat, {
                                pin: {
                                    key: {
                                        remoteJid: m.chat,
                                        id: quoted.id
                                    }
                                }
                            });
                            pinned = true;
                        } catch (e4) {
                            console.log('Metodo 4 fallito:', e4.message);
                        }
                    }
                }
            }

            if (pinned) {
                m.react('✅️');
                
                // Conferma con il tempo in millisecondi
                let durationText = '';
                if (command === 'pin1d') durationText = '1 giorno';
                else if (command === 'pin7d') durationText = '7 giorni';
                else if (command === 'pin30d') durationText = '30 giorni';
                
                await m.reply(`✅ Messaggio fissato per ${durationText}!`);
                
                // Pulisci la mappa per evitare confusione
                pinQueue.delete(m.chat);
            } else {
                m.reply('❌ Impossibile fissare il messaggio. Il bot potrebbe non avere i permessi di amministratore.');
            }
            
        } catch (e) {
            console.error('Errore finale:', e);
            m.reply('❌ Errore nel fissare il messaggio.');
        }
        return;
    }

    // Comandi normali unpin, destacar, desmarcar
    if (['unpin', 'destacar', 'desmarcar'].includes(command)) {
        if (!m.quoted) return m.reply(`⚠️ Rispondi a un messaggio per ${command === 'unpin' ? 'rimuoverlo dai fissati' : 'eseguire l\'azione'}.`);

        const messageKey = {
            remoteJid: m.chat,
            fromMe: m.quoted.fromMe,
            id: m.quoted.id,
            participant: m.quoted.sender
        };

        try {
            switch (command) {
                case 'unpin':
                    await conn.sendMessage(m.chat, { pin: { key: messageKey, type: 2 } });
                    break;
                case 'destacar':
                    await conn.sendMessage(m.chat, { keep: { key: messageKey, type: 1 } });
                    break;
                case 'desmarcar':
                    await conn.sendMessage(m.chat, { keep: { key: messageKey, type: 2 } });
                    break;
            }
            m.react('✅️');
        } catch (err) {
            console.error('[ERRORE]', err);
            m.reply('❌ Errore nell\'eseguire il comando.');
        }
        return;
    }
};

handler.help = ['pin'];
handler.tags = ['gruppo'];
handler.command = ['pin', 'unpin', 'destacar', 'desmarcar', 'pin1d', 'pin7d', 'pin30d'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;