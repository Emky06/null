const pinQueue = new Map();

let handler = async (m, { conn, command, usedPrefix, participants }) => {
    if (!m.isGroup) return;

    if (command === 'pin') {
        if (!m.quoted) return m.reply('⚠️ Rispondi a un messaggio per fissarlo.');

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

        try {
            await conn.sendMessage(m.chat, {
                pin: {
                    key: quoted.key,
                    type: 1
                }
            });

            m.react('✅');
            pinQueue.delete(m.chat);
        } catch (err) {
            console.error(err);
            m.reply('❌ Errore nel fissare il messaggio.');
        }
        return;
    }

    if (command === 'unpin') {
        if (!m.quoted) return;

        try {
            await conn.sendMessage(m.chat, {
                pin: {
                    key: m.quoted.key,
                    type: 2
                }
            });

            m.react('✅');
        } catch (err) {
            console.error(err);
            m.reply('❌ Errore nell’eseguire il comando.');
        }
    }
};

handler.help = ['pin', 'unpin'];
handler.tags = ['gruppo'];
handler.command = ['pin', 'pin1d', 'pin7d', 'pin30d', 'unpin'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;