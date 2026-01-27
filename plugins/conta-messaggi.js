// handler-contatore-messaggi.js
let handler = message => message;

handler.all = async function(message) {
    // Conta SOLO i messaggi nei gruppi
    if (message.isGroup && message.text && !message.isBaileys && !message.fromMe) {
        try {
            // Assicurati che il database esista
            if (!global.db.data) global.db.data = {};
            if (!global.db.data.users) global.db.data.users = {};
            
            // Assicurati che l'utente esista
            if (!global.db.data.users[message.sender]) {
                global.db.data.users[message.sender] = {
                    messaggi: 0,
                    command: 0
                };
            }
            
            // Assicurati che messaggi sia un numero
            if (typeof global.db.data.users[message.sender].messaggi !== 'number') {
                global.db.data.users[message.sender].messaggi = 0;
            }
            
            // Incrementa il contatore
            global.db.data.users[message.sender].messaggi++;
            
            // DEBUG: mostra ogni 5 messaggi
            const count = global.db.data.users[message.sender].messaggi;
            if (count % 5 === 0) {
                console.log(`📊 [CONTATORE] ${message.sender.split('@')[0]}: ${count} messaggi`);
            }
            
            // Se è un comando, conta anche quello
            if (message.isCommand) {
                if (typeof global.db.data.users[message.sender].command !== 'number') {
                    global.db.data.users[message.sender].command = 0;
                }
                global.db.data.users[message.sender].command++;
            }
            
        } catch (error) {
            console.error('❌ Errore nel contatore messaggi:', error);
        }
    }
};

export default handler;