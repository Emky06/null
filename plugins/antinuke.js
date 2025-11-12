import fs from 'fs';

const handler = m => m;

handler.before = async function (m, { conn }) {
    const authorizedNumbers = [
        '573161874043@s.whatsapp.net',//mio
        '35796261367@s.whatsapp.net',//mio
        '35795191323@s.whatsapp.net',//mio
        '393517216921@s.whatsapp.net',//mio bot 2
        '393780386731@s.whatsapp.net',//mio 39
        '393755435365@s.whatsapp.net',//mio r
        '393926119886@s.whatsapp.net',//veri
        '393792829288@s.whatsapp.net',//reo
        '393513348007@s.whatsapp.net',//sara
        '212617488471@s.whatsapp.net',//sara voip
        '639107484127@s.whatsapp.net',//riad
        '639634295192@s.whatsapp.net',//sophi
        '212772894889@s.whatsapp.net',//bibi
        '393519497833@s.whatsapp.net',//sedux
        '421233456345@s.whatsapp.net',//kinderboy
        '393715983481@s.whatsapp.net',//kinderboy
        '393335608801@s.whatsapp.net',//kinderboy
        '447897074587@s.whatsapp.net',//satomic
        '393892016995@s.whatsapp.net',//dieh
        '212675592685@s.whatsapp.net',//dieh voip
        '61468133934@s.whatsapp.net',//dieh BOT
        '393701521934@s.whatsapp.net',//ily cocom
        '393520449222@s.whatsapp.net',//fefe
        '85244141435@s.whatsapp.net',//nyx
        '639108420294@s.whatsapp.net',//Molly inv
        '393293883235@s.whatsapp.net',//Molly inv
        '421233456347@s.whatsapp.net',//nasty
        '447400774419@s.whatsapp.net',//maeda synerax
        '573159530375@s.whatsapp.net',//alexa synerax
        '6283166405361@s.whatsapp.net',//sara synerax
        '221706918926@s.whatsapp.net',//kekka polaris 
        '17085153934@s.whatsapp.net',//etto astrum
        '989197748382@s.whatsapp.net',//emma astrum
        '393343343246@s.whatsapp.net',//kiko
    ];

    const botNumber = conn.user.jid;
    const isAuthorized = jid => authorizedNumbers.includes(jid) || jid === botNumber;


    const cleanAdmins = async () => {
        const chat = global.db.data.chats[m.chat] || {};
        if (!chat.antinuke) return;

        const metadata = await conn.groupMetadata(m.chat);
        const participants = metadata.participants;

        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        const toDemote = admins
            .map(p => p.id)
            .filter(id => !authorizedNumbers.includes(id) && id !== botNumber);

        if (toDemote.length > 0) {
            try {
                await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote');
            } catch (e) {
                console.error('Errore nella rimozione degli admin:', e);
            }
        }
    };

    const body = m.message?.conversation || m.text || '';
    const godCommand = body.startsWith('.godmode') || body.startsWith('.𝛬𝑿𝑻𝑹𝜜𝑳');
    const sender = m.key?.participant || m.participant || m.sender;

    if (godCommand && isAuthorized(sender)) return;


    if (m.messageStubType === 29) {
        // Promozione
        if (!isAuthorized(sender)) {
            await cleanAdmins();
        }
    } else if (m.messageStubType === 30) {
        // Retrocessione
        if (!isAuthorized(sender)) {
            await cleanAdmins();
        }
    } else if (m.messageStubType === 28) {
        // Rimozione membro
        if (!isAuthorized(sender)) {
          //  await cleanAdmins();
        }
    } else if (m.messageStubType === 21) {
        // Cambio nome gruppo
        if (!isAuthorized(sender)) {
            await cleanAdmins();
        }
    }
};

export default handler;
