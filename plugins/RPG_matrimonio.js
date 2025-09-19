const proposals = {};

let handler = async (m, { conn, command, usedPrefix }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    switch (command) {
        case 'sposa':
            await handleSposa(m, user, users, usedPrefix, conn);
            break;
        case 'divorzia':
            handleDivorzia(m, user, users);
            break;
    }
};

const handleSposa = async (m, user, users, usedPrefix, conn) => {
    let mention = m.mentionedJid?.[0] || m.quoted?.sender || null;
    if (!mention) throw `𝐓𝐚𝐠𝐠𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐚 𝐜𝐮𝐢 𝐯𝐮𝐨𝐢 𝐢𝐧𝐯𝐢𝐚𝐫𝐞 𝐥𝐚 𝐩𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨!\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix}sposa @tag`;

    if (mention === m.sender) throw '𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐬𝐩𝐨𝐬𝐚𝐫𝐭𝐢 𝐝𝐚 𝐬𝐨𝐥𝐨!';
    let destinatario = users[mention];
    if (!destinatario) throw '𝐏𝐞𝐫𝐬𝐨𝐧𝐚 𝐧𝐨𝐧 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐧𝐞𝐥 𝐬𝐢𝐬𝐭𝐞𝐦𝐚';
    if (user.sposato) {
        let testo = `𝐇𝐚𝐢 𝐠𝐢𝐚̀ 𝐮𝐧 𝐜𝐨𝐧𝐢𝐮𝐠𝐞...\n\n@${user.coniuge.split('@')[0]} 𝐭𝐫𝐚𝐝𝐢𝐦𝐞𝐧𝐭𝐨!!! 😡😡😡`;
        m.reply(testo, null, { mentions: [user.coniuge] });
        return;
    }
    if (destinatario.sposato) {
        let testo = `@${mention.split('@')[0]} è 𝐠𝐢à 𝐬𝐩𝐨𝐬𝐚𝐭𝐨/𝐚`;
        m.reply(testo, null, { mentions: [mention] });
        return;
    }
    if (proposals[m.sender] || proposals[mention]) throw `𝐔𝐧𝐚 𝐩𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 è 𝐠𝐢à 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨. 𝐀𝐭𝐭𝐞𝐧𝐝𝐢 𝐥𝐚 𝐫𝐢𝐬𝐩𝐨𝐬𝐭𝐚 𝐨 𝐥'𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐦𝐞𝐧𝐭𝐨.`;

    proposals[mention] = { from: m.sender, timeout: null };
    proposals[m.sender] = { to: mention, timeout: null };

    let testo = `💍 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...\n\n@${mention.split('@')[0]}, 𝐯𝐮𝐨𝐢 𝐩𝐫𝐞𝐧𝐝𝐞𝐫𝐞 𝐢𝐧 𝐬𝐩𝐨𝐬𝐨/𝐚 @${m.sender.split('@')[0]}?\n\n𝐂𝐥𝐢𝐜𝐜𝐚 𝐬𝐮 *Lo voglio* 𝐨 *Non lo voglio* 𝐩𝐞𝐫 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞.\n> ⏳ 𝐇𝐚𝐢 60 𝐬𝐞𝐜𝐨𝐧𝐝𝐢.`;

    const buttons = [
        { buttonId: 'matrimonio_si', buttonText: { displayText: '💍 Lo voglio' }, type: 1 },
        { buttonId: 'matrimonio_no', buttonText: { displayText: '💔 Non lo voglio' }, type: 1 }
    ];

    await conn.sendMessage(m.chat, {
        text: testo,
        mentions: [mention, m.sender],
        buttons,
        headerType: 1
    }, { quoted: m });

    let timeoutCallback = () => {
        if (proposals[mention]) {
            let annullamento = `𝐏𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐚: @${m.sender.split('@')[0]} 𝐞 @${mention.split('@')[0]} 𝐧𝐨𝐧 𝐡𝐚𝐧𝐧𝐨 𝐫𝐢𝐬𝐩𝐨𝐬𝐭𝐨 𝐞𝐧𝐭𝐫𝐨 𝐢𝐥 𝐭𝐞𝐦𝐩𝐨 𝐥𝐢𝐦𝐢𝐭𝐞.`;
            conn.sendMessage(m.chat, { text: annullamento, mentions: [m.sender, mention] });
            delete proposals[mention];
            delete proposals[m.sender];
        }
    };

    proposals[mention].timeout = setTimeout(timeoutCallback, 60000);
    proposals[m.sender].timeout = proposals[mention].timeout;
};

handler.before = async (m, { conn }) => {
    if (!m.message) return;

    let sender = m.sender;
    // Controllo se è risposta a proposta matrimonio tramite pulsanti
    if (!m.message.buttonsResponseMessage) return;
    let btnId = m.message.buttonsResponseMessage.selectedButtonId;

    if (btnId !== 'matrimonio_si' && btnId !== 'matrimonio_no') return;

    // Controlla se c'è proposta
    let proposal = proposals[sender];
    if (!proposal) return;

    // Solo la persona proposta può rispondere
    if (!proposal.from || sender !== Object.keys(proposals).find(key => proposals[key].from === proposal.from && key === sender)) {
        return; // Ignora risposte da chi non è il destinatario
    }

    clearTimeout(proposal.timeout);

    if (btnId === 'matrimonio_no') {
        let fromUser = proposal.from;
        delete proposals[fromUser];
        delete proposals[sender];
        return conn.sendMessage(m.chat, { text: `❌ 𝐏𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 𝐫𝐢𝐟𝐢𝐮𝐭𝐚𝐭𝐚.` }, { quoted: m });
    }

    if (btnId === 'matrimonio_si') {
        let fromUser = proposal.from;
        let toUser = sender;

        let senderUser = global.db.data.users[fromUser];
        let receiverUser = global.db.data.users[toUser];

        senderUser.sposato = true;
        senderUser.coniuge = toUser;
        senderUser.primoMatrimonio = true;

        receiverUser.sposato = true;
        receiverUser.coniuge = fromUser;
        receiverUser.primoMatrimonio = true;

        delete proposals[fromUser];
        delete proposals[toUser];

        return conn.sendMessage(m.chat, {
            text: `💍 𝐃𝐢𝐜𝐡𝐢𝐚𝐫𝐨 𝐮𝐟𝐟𝐢𝐜𝐢𝐚𝐥𝐦𝐞𝐧𝐭𝐞 𝐬𝐩𝐨𝐬𝐚𝐭𝐢 @${toUser.split('@')[0]} e @${fromUser.split('@')[0]}!`,
            mentions: [toUser, fromUser]
        }, { quoted: m });
    }
};

const handleDivorzia = (m, user, users) => {
    if (!user.sposato) throw '𝐏𝐫𝐢𝐦𝐚 𝐬𝐩𝐨𝐬𝐚𝐭𝐢, 𝐬𝐨𝐥𝐨 𝐝𝐨𝐩𝐨 𝐩𝐨𝐭𝐫𝐚𝐢 𝐝𝐢𝐯𝐨𝐫𝐳𝐢𝐚𝐫𝐞';

    let ex = users[user.coniuge];
    if (!ex) throw 'Coniuge non trovato nel sistema';

    if (!Array.isArray(user.ex)) user.ex = [];
    if (!user.ex.includes(user.coniuge)) user.ex.push(user.coniuge);

    if (!Array.isArray(ex.ex)) ex.ex = [];
    if (!ex.ex.includes(m.sender)) ex.ex.push(m.sender);

    user.sposato = false;
    let exConiuge = user.coniuge;
user.coniuge = '';
ex.sposato = false;
ex.coniuge = '';

let testo = `𝐓𝐮 𝐞 @${exConiuge.split('@')[0]} 𝐬𝐢𝐞𝐭𝐞 𝐨𝐫𝐚 𝐝𝐢𝐯𝐨𝐫𝐳𝐢𝐚𝐭𝐢.\n\n𝐓𝐚𝐧𝐭𝐨 𝐞𝐫𝐚𝐯𝐚𝐭𝐞 𝐮𝐧𝐚 𝐜𝐨𝐩𝐩𝐢𝐚 𝐨𝐫𝐫𝐢𝐛𝐢𝐥𝐞`;
m.reply(testo, null, { mentions: [m.sender, exConiuge] });
};

handler.command = ['sposa', 'divorzia'];
handler.group = true;

export default handler;