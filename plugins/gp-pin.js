const pinQueue = new Map();

let handler = async (m, { conn, command, usedPrefix }) => {
    console.log('=== DEBUG PIN ===');
    console.log('Comando ricevuto:', command);
    console.log('Chat ID:', m.chat);
    console.log('Ha quoted?', !!m.quoted);
    
    if (command === 'pin') {
        if (!m.quoted) return m.reply(`⚠️ Rispondi a un messaggio per fissarlo.`);

        console.log('Messaggio quoted:', {
            id: m.quoted.id,
            fromMe: m.quoted.fromMe,
            sender: m.quoted.sender,
            type: m.quoted.mtype
        });

        pinQueue.set(m.chat, m.quoted);
        console.log('Salvato in pinQueue per chat:', m.chat);

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
        
        console.log('Bottoni inviati');
        return;
    }

    if (['pin1d', 'pin7d', 'pin30d'].includes(command)) {
        console.log('Comando durata ricevuto:', command);
        
        // Recupero il messaggio da pinnare salvato in pinQueue
        const quoted = pinQueue.get(m.chat);
        console.log('Recuperato da pinQueue:', !!quoted);
        
        if (!quoted) {
            console.log('ERRORE: Nessun messaggio in pinQueue');
            return m.reply('❌ Nessun messaggio da fissare. Usa prima il comando pin rispondendo a un messaggio.');
        }

        const messageKey = {
            remoteJid: m.chat,
            fromMe: quoted.fromMe,
            id: quoted.id,
            participant: quoted.sender
        };

        console.log('MessageKey creato:', JSON.stringify(messageKey, null, 2));

        // Calcolo durata in ms in base al comando
        let durationMs = 0;
        if (command === 'pin1d') durationMs = 1 * 24 * 60 * 60 * 1000;
        else if (command === 'pin7d') durationMs = 7 * 24 * 60 * 60 * 1000;
        else if (command === 'pin30d') durationMs = 30 * 24 * 60 * 60 * 1000;

        console.log('Durata calcolata (ms):', durationMs);
        console.log('Tentativo di pin...');

        try {
            // DEBUG: Mostra esattamente cosa stiamo inviando
            const pinPayload = { 
                pin: { 
                    key: messageKey, 
                    type: 1,
                    durationInSec: Math.floor(durationMs / 1000) // Converti in secondi
                } 
            };
            
            console.log('Payload inviato:', JSON.stringify(pinPayload, null, 2));
            
            await conn.sendMessage(m.chat, pinPayload);
            console.log('Comando pin inviato con successo');

            m.react('✅️');
            console.log('Reazione inviata');

            // Pulisco la mappa per evitare confusione
            pinQueue.delete(m.chat);
            console.log('Rimosso da pinQueue');
            
        } catch (e) {
            console.error('ERRORE durante pin:', e);
            console.error('Stack:', e.stack);
            console.error('Messaggio errore:', e.message);
            
            // Prova metodo alternativo
            console.log('Provo metodo alternativo...');
            try {
                await conn.chatModify(
                    { pin: true },
                    m.chat,
                    [quoted.id]
                );
                console.log('Metodo alternativo riuscito!');
                m.react('✅️');
                pinQueue.delete(m.chat);
            } catch (e2) {
                console.error('Anche metodo alternativo fallito:', e2.message);
                m.reply('❌ Errore nel fissare il messaggio: ' + e.message);
            }
        }
        return;
    }

    // Comandi normali unpin, destacar, desmarcar
    if (['unpin', 'destacar', 'desmarcar'].includes(command)) {
        console.log('Comando di rimozione:', command);
        
        if (!m.quoted) {
            console.log('ERRORE: Nessun quoted per unpin');
            return m.reply(`⚠️ Rispondi a un messaggio per ${command === 'unpin' ? 'rimuoverlo dai fissati' : 'eseguire l\'azione'}.`);
        }

        console.log('Messaggio quoted per unpin:', {
            id: m.quoted.id,
            fromMe: m.quoted.fromMe,
            sender: m.quoted.sender
        });

        const messageKey = {
            remoteJid: m.chat,
            fromMe: m.quoted.fromMe,
            id: m.quoted.id,
            participant: m.quoted.sender
        };

        console.log('MessageKey per unpin:', JSON.stringify(messageKey, null, 2));

        try {
            switch (command) {
                case 'unpin':
                    console.log('Tentativo unpin...');
                    await conn.sendMessage(m.chat, { 
                        unpin: { 
                            key: messageKey 
                        } 
                    });
                    break;
                case 'destacar':
                    console.log('Tentativo destacar...');
                    await conn.sendMessage(m.chat, { 
                        keep: { 
                            key: messageKey, 
                            type: 1 
                        } 
                    });
                    break;
                case 'desmarcar':
                    console.log('Tentativo desmarcar...');
                    await conn.sendMessage(m.chat, { 
                        keep: { 
                            key: messageKey, 
                            type: 2 
                        } 
                    });
                    break;
            }
            console.log('Comando eseguito con successo');
            m.react('✅️');
        } catch (err) {
            console.error('[ERRORE] Dettagli:', err);
            console.error('[ERRORE] Messaggio:', err.message);
            console.error('[ERRORE] Stack:', err.stack);
            
            // Prova metodo alternativo per unpin
            if (command === 'unpin') {
                try {
                    await conn.chatModify(
                        { pin: false },
                        m.chat,
                        [m.quoted.id]
                    );
                    console.log('Metodo alternativo unpin riuscito');
                    m.react('✅️');
                } catch (e2) {
                    m.reply('❌ Errore nell\'eseguire il comando: ' + err.message);
                }
            } else {
                m.reply('❌ Errore nell\'eseguire il comando: ' + err.message);
            }
        }
        return;
    }
    
    console.log('=== FINE DEBUG ===');
};

handler.help = ['pin'];
handler.tags = ['gruppo'];
handler.command = ['pin', 'unpin', 'destacar', 'desmarcar', 'pin1d', 'pin7d', 'pin30d'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;