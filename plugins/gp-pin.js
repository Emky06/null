const pinQueue = new Map();

let handler = async (m, { conn, command, usedPrefix }) => {
    if (!m.isGroup) return;
    if (!m.quoted && command !== 'pin') return;

    if (command === 'pin') {
        pinQueue.set(m.chat, m.quoted);

        const buttons = [
            { buttonId: `${usedPrefix}pin1d`, buttonText: { displayText: '⏳ 1 Giorno' }, type: 1 },
            { buttonId: `${usedPrefix}pin7d`, buttonText: { displayText: '⏳ 7 Giorni' }, type: 1 },
            { buttonId: `${usedPrefix}pin30d`, buttonText: { displayText: '⏳ 30 Giorni' }, type: 1 }
        ];

        await conn.sendMessage(m.chat, {
            text: 'Scegli per quanto tempo vuoi fissare il messaggio:',
            buttons,
            headerType: 1
        });
        return;
    }

    if (['pin1d', 'pin7d', 'pin30d'].includes(command)) {
        const quoted = pinQueue.get(m.chat);
        if (!quoted) return;

        const key = { ...quoted.key };
        if (!key.participant && quoted.sender) key.participant = quoted.sender;

        try {
            await conn.sendMessage(m.chat, { pin: { key, type: 1 } });
            m.react('✅');
            pinQueue.delete(m.chat);
        } catch (e) {
            console.error('[PIN ERROR]', e);
            m.reply('❌ Errore nel fissare il messaggio. Controlla che il bot sia admin.');
        }
        return;
    }

    if (command === 'unpin') {
        const key = { ...m.quoted.key };
        if (!key.participant && m.quoted.sender) key.participant = m.quoted.sender;

        try {
            await conn.sendMessage(m.chat, { pin: { key, type: 2 } });
            m.react('✅');
        } catch (e) {
            console.error('[UNPIN ERROR]', e);
            m.reply('❌ Errore nell\'eseguire il comando. Controlla che il bot sia admin.');
        }
    }
};

handler.command = ['pin', 'pin1d', 'pin7d', 'pin30d', 'unpin'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;