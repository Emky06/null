//Plugin fatto da Axtral_WiZaRd
const friendRequests = {};

let handler = async (m, { conn, participants, command, text, args, usedPrefix }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    switch (command) {
        case 'amicizia':
            await handleFriendRequest(m, user, users, text, usedPrefix, conn);
            break;
        case 'rimuoviamico':
            handleRemoveFriend(m, user, users);
            break;
    }
};

const handleFriendRequest = async (m, user, users, text, usedPrefix, conn) => {
    let mention = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!mention) throw `⚠️ Tagga la persona a cui vuoi inviare una richiesta di amicizia!\nEsempio: ${usedPrefix}amicizia @utente`;

    if (mention === m.sender) throw '❌ Non puoi mandare una richiesta di amicizia a te stesso.';

    let destinatario = users[mention];
    if (!destinatario) throw '🚫 Utente non trovato nel database.';

    if (user.amici?.includes(mention)) {
        return m.reply(`✅ @${mention.split('@')[0]} è già tuo amico.`, null, {
            mentions: [mention]
        });
    }

    if (friendRequests[m.sender] || friendRequests[mention]) {
        return m.reply('⚠️ C\'è già una richiesta di amicizia in corso.');
    }

    
    friendRequests[mention] = { from: m.sender, timeout: null };
    friendRequests[m.sender] = { to: mention, timeout: null };

    const testo = `👥 𝐑𝐈𝐂𝐇𝐈𝐄𝐒𝐓𝐀 𝐃𝐈 𝐀𝐌𝐈𝐂𝐈𝐙𝐈𝐀\n@${mention.split('@')[0]}, vuoi diventare amico/a di @${m.sender.split('@')[0]}?\n\nHai 60 secondi per rispondere.`;

    const buttons = [
        {
            buttonId: 'friend_yes',
            buttonText: { displayText: '✅ Accetta' },
            type: 1
        },
        {
            buttonId: 'friend_no',
            buttonText: { displayText: '❌ Rifiuta' },
            type: 1
        }
    ];

    await conn.sendMessage(m.chat, {
        text: testo,
        mentions: [mention, m.sender],
        buttons,
        headerType: 1
    }, { quoted: m });

    const timeout = setTimeout(() => {
        conn.sendMessage(m.chat, {
            text: `⏱️ La richiesta di amicizia è scaduta.`,
            mentions: [mention, m.sender]
        });
        delete friendRequests[mention];
        delete friendRequests[m.sender];
    }, 60000);

    friendRequests[mention].timeout = timeout;
    friendRequests[m.sender].timeout = timeout;
};

handler.before = async (m, { conn }) => {
    if (!m.message || !m.message.buttonsResponseMessage) return;

    const response = m.message.buttonsResponseMessage.selectedButtonId;

    if (!friendRequests[m.sender]) return;

    const from = friendRequests[m.sender].from;
    const senderUser = global.db.data.users[from];
    const receiverUser = global.db.data.users[m.sender];

    clearTimeout(friendRequests[m.sender]?.timeout);
    clearTimeout(friendRequests[from]?.timeout);

    if (response === 'friend_no') {
        delete friendRequests[m.sender];
        delete friendRequests[from];
        return conn.sendMessage(m.chat, {
            text: '❌ Richiesta di amicizia rifiutata.',
            mentions: [m.sender, from]
        });
    }

    if (response === 'friend_yes') {
        if (!Array.isArray(senderUser.amici)) senderUser.amici = [];
        if (!Array.isArray(receiverUser.amici)) receiverUser.amici = [];

        if (!senderUser.amici.includes(m.sender)) senderUser.amici.push(m.sender);
        if (!receiverUser.amici.includes(from)) receiverUser.amici.push(from);

        delete friendRequests[m.sender];
        delete friendRequests[from];

        return conn.sendMessage(m.chat, {
            text: `✅ Ora tu e @${from.split('@')[0]} siete amici!`,
            mentions: [m.sender, from]
        });
    }
};

const handleRemoveFriend = (m, user, users) => {
    let mention = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!mention) throw '⚠️ Tagga la persona che vuoi rimuovere dagli amici.';

    if (!user.amici || !user.amici.includes(mention)) throw `🚫 @${mention.split('@')[0]} non è tra i tuoi amici.`;

    user.amici = user.amici.filter(jid => jid !== mention);

    const friend = users[mention];
    if (friend && Array.isArray(friend.amici)) {
        friend.amici = friend.amici.filter(jid => jid !== m.sender);
    }

    return m.reply(`😞 Tu e @${mention.split('@')[0]} non siete più amici.`, null, {
        mentions: [mention]
    });
};

handler.command = ['amicizia', 'rimuoviamico'];
handler.group = true;

export default handler;