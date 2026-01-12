//Plugin fatto da Axtral_WiZaRd
const handler = m => m;

handler.before = async function (m, { conn, participants, isBotAdmin }) {
    if (!m.isGroup) return;
    if (!isBotAdmin) return;

    const authorizedNumbers = [
        '393780386731@s.whatsapp.net', // mio
        '393793178438@s.whatsapp.net', // riad
        '393715983481@s.whatsapp.net', // kinderboy
        '393508853853@s.whatsapp.net', // kinderboy
        '6285881815061@s.whatsapp.net', // dieh
        '559180930059@s.whatsapp.net',  // dieh BOT
        '393532112054@s.whatsapp.net',  // maeda synerax
        '393509496378@s.whatsapp.net',  // kekka polaris
        '6283171546122@s.whatsapp.net', // laura synerax
        '393533242715@s.whatsapp.net', //naomi
        '5521982303171@s.whatsapp.net', // pat rivotril
    ];

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const sender = m.key?.participant || m.participant || m.sender;


    let founderJid = null;
    try {
        const metadata = await conn.groupMetadata(m.chat);
        founderJid = metadata.owner; 
    } catch {
        founderJid = null;
    }

    const isAuthorized = jid =>
        authorizedNumbers.includes(jid) ||
        ownerJids.includes(jid) ||
        jid === botJid ||
        jid === founderJid; 
    const cleanAdmins = async () => {
        const chat = global.db.data.chats[m.chat];
        if (!chat?.antinuke) return;

        const usersToDemote = participants
            .map(p => p.jid)
            .filter(jid =>
                jid &&
                jid !== botJid &&
                !ownerJids.includes(jid) &&
                !authorizedNumbers.includes(jid) &&
                jid !== founderJid 
            );

        if (!usersToDemote.length) return;

        try {
            await conn.groupParticipantsUpdate(
                m.chat,
                usersToDemote,
                'demote'
            );
            console.log('[ANTINUKE] Retrocessi:', usersToDemote);
        } catch (e) {
            console.error('[ANTINUKE] Errore:', e);
        }
    };

    if (m.messageStubType === 29) {
        // Promozione
        if (!isAuthorized(sender)) await cleanAdmins();
    } else if (m.messageStubType === 30) {
        // Retrocessione
        if (!isAuthorized(sender)) await cleanAdmins();
    } else if (m.messageStubType === 28) {
        // Rimozione membro
        if (!isAuthorized(sender)) {
//await cleanAdmins();
}
    } else if (m.messageStubType === 21) {
        // Cambio nome gruppo
        if (!isAuthorized(sender)) await cleanAdmins();
    }
};

export default handler;