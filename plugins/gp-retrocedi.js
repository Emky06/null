//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, usedPrefix, text }) => {
    // Lista dei numeri autorizzati
    const authorizedNumbers = [
        '393780386731',//mio 39
        '393793178438',//riad
        '212772894889',//bibi
        '393279399297',//kinderboy
        '393715983481',//kinderboy
        '393891353450',//nasty
        '393444297827',//teo real
        '420323280016',//teo voip
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
        return m.reply(`❌ Devi taggare un utente o rispondere a un suo messaggio per retrocederlo.`);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
        
    } catch (e) {
        console.error('Errore durante demote:', e);
        m.reply('⚠️ Errore durante la rimozione dei privilegi.');
    }
};

handler.help = ['*numero*', '*@utente*', '*rispondi al messaggio*'].map(v => 'r ' + v);
handler.tags = ['group'];
handler.command = /^(demote|retrocedi|togliadmin|r)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
