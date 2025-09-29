let handler = async (m, { conn, usedPrefix, text }) => {
    // Lista dei numeri autorizzati
    const authorizedNumbers = [
        '393755435365',//mio r
        '35796261367',//mio
        '35795191323',//mio
        '393512884684',//mio att
        '393780386731',//mio 39
        '393511198848',//mio bot 39
        '393510240643',//mio
        '393792829288',//reo
        '393519497833',//sedux
        '393508571301',//riad
        '393513348007',//sara
        '212617488471',//sara voip
        '639634295192',//sophi
        '212772894889',//bibi
        '421233456345',//kinderboy
        '393715983481',//kinderboy
        '393335608801',//kinderboy
        '6285179461237',//fuma
        '393892016995',//dieh
        '212675592685',//dieh voip
        '85244141435',//nyx
        '639108420294',//Molly inv
        '393293883235',//Molly inv
        '421233456347',//nasty
        '447400774419',//maeda synerax
        '573159530375',//alexa synerax
        '6283166405361',//sara synerax
        '221706918926',//kekka polaris     
        '17085153934',//etto astrum
        '989197748382',//emma astrum   
        '393343343246',//kiko
        '212775421202',//naomi
    ];

    const senderNumber = m.sender.split('@')[0];

    if (!authorizedNumbers.includes(senderNumber)) {
        return m.reply('⛔ Non sei autorizzato a usare questo comando.');
    }

    let user;

    // Caso: menzioni
    if (m.mentionedJid?.length) {
        user = m.mentionedJid[0];
    }
    // Caso: reply a un messaggio
    else if (m.quoted?.sender) {
        user = m.quoted.sender;
    }
    // Caso: numero scritto manualmente
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
        // nessun messaggio di conferma, come nel tuo originale
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
