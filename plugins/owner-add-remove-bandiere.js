//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, args, command, participants, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) {
        return m.reply('❌ Solo gli admin del gruppo possono modificare le vittorie.');
    }

    if (!m.mentionedJid[0]) {
        return m.reply(`⚠️ Devi menzionare un utente.\n\nEsempio:\n*.${command} @utente 3*`);
    }

    let numero = parseInt(args[1]);
    if (isNaN(numero)) {
        return m.reply('⚠️ Devi specificare un numero valido di vittorie.');
    }

    let target = m.mentionedJid[0];
    let users = global.db.data.users;

    if (!users[target]) users[target] = {};
    users[target].vittorieBandiera = users[target].vittorieBandiera || 0;

    if (command === 'addvittorie') {
        users[target].vittorieBandiera += numero;
        return m.reply(`✅ Hai aggiunto ${numero} vittorie a @${target.split('@')[0]}`, null, { mentions: [target] });
    }

    if (command === 'removevittorie') {
        users[target].vittorieBandiera = Math.max(0, users[target].vittorieBandiera - numero);
        return m.reply(`✅ Hai rimosso ${numero} vittorie a @${target.split('@')[0]}`, null, { mentions: [target] });
    }
};

handler.help = ['.addvittorie @utente 3', '.removevittorie @utente 2'];
handler.tags = ['game'];
handler.command = ['addvittorie', 'removevittorie']; // Usati come .addvittorie ecc.
handler.group = true;
handler.owner = true;

export default handler;