//by riad
let preventGameCommands = async (msg, { command }) => {
    let chatConfig = global.db.data.chats[msg.chat] || {};
    
    if (chatConfig.antigiochi) {
        // Elenco dei comandi di gioco da bloccare
        const giochiComandi = ['slot', 'scommetti', 'moneta', 'sfida', 'accetta', 'tris', 'entra', 'bandiera', 'skipbandiera']; // Estendi con i tuoi comandi

        // Controlla se il comando rientra in quelli di gioco
        if (giochiComandi.includes(command)) {
            throw false; // Ferma l'esecuzione, senza rispondere
        }
    }
};

export default preventGameCommands;