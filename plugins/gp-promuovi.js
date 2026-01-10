//Plugin fatto da Axtral_WiZaRd

let handler = async (m, { conn, usedPrefix, text }) => {
    // Lista di numeri autorizzati
    const authorizedNumbers = [
        '393780386731',//mio 39
        '393793178438',//riad
        '212772894889',//bibi
        '393279399297',//kinderboy
        '393715983481',//kinderboy
        '393472425001',//dieh
        '393891353450',//nasty
        '393532112054',//maeda synerax
        '6283166405361',//sara synerax
        '393509496378',//kekka polaris
        '6283171546122',//laura synerax
        '393343343246',//kiko
        '393780854347',//fefe cocomera
        '393701521934',//ily cocomera
        '393273097621',//linda
    ];

    const senderNumber = m.sender.split('@')[0];

const botNumber = conn.user.jid;
const ownerNumbers = (global.owner || []).map(o => o[0]);


const isAuthorized =
    authorizedNumbers.includes(senderNumber) ||
    ownerNumbers.includes(senderNumber) ||
    senderNumber + '@s.whatsapp.net' === botNumber;

if (!isAuthorized) {
    return m.reply('⛔ Non sei autorizzato a usare questo comando.');
}

    let user;

    if (m.mentionedJid?.length) {
        user = m.mentionedJid[0];
    }

    else if (m.quoted?.sender) {
        user = m.quoted.sender;
    }
 
    else if (text) {
        if (text.endsWith('@s.whatsapp.net') || text.endsWith('@c.us')) {
            user = text.trim();
        } else {
            let number = text.replace(/[^0-9]/g, '');
            if (number.length < 8 || number.length > 15) {
                return m.reply('⚠️ Numero non valido.');
            }
            user = number + '@s.whatsapp.net';
        }
    }

    if (!user) {
        return m.reply(`❌ Devi taggare un utente o rispondere a un suo messaggio per promuoverlo.`);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');

    } catch (e) {
        console.error('Errore durante promote:', e);
        m.reply('⚠️ Errore durante la promozione.');
    }
};

handler.command = /^(promote|promuovi|mettiadmin|p)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
