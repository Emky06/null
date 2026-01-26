let handler = async (m, { conn }) => {
    const users = global.db.data.users || {};

    // Crea la classifica dai dati del DB
    let classifica = Object.entries(users)
        .filter(([key, data]) => (data.vittorieBandiera || 0) > 0)
        .map(([key, data]) => ({ id: key, vittorie: data.vittorieBandiera }))
        .sort((a, b) => b.vittorie - a.vittorie)
        .slice(0, 10);

    if (classifica.length === 0) {
        return conn.reply(m.chat, "⚠︎ Nessun giocatore ha ancora vinto una partita nel gioco delle bandiere!", m);
    }

    // Costruisci il messaggio
    let testo = '🏆 Top 10 vincitori del gioco delle bandiere 🏆\n\n';
    classifica.forEach((item, index) => {
        testo += `#${index + 1} *@${item.id.split('@')[0]}* → *${item.vittorie} vittorie*\n`;
    });

    await conn.sendMessage(m.chat, { text: testo, mentions: classifica.map(u => u.id) });
};

handler.command = /^topbandiere$/i;
export default handler;