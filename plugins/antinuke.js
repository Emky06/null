import fs from 'fs';
import path from 'path';

const handler = m => m;

// Percorso del file JSON
const whitelistFile = path.join('./db', 'autorizzati-antinuke.json');

// Funzioni di lettura e scrittura JSON
const readWhitelist = () => {
    if (!fs.existsSync(whitelistFile)) return {};
    return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'));
};

const writeWhitelist = (data) => {
    fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf-8');
};

// Handler principale antinuke
handler.before = async function (m, { conn, participants, isBotAdmin }) {
    if (!m.isGroup) return;
    if (!isBotAdmin) return;

    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const sender = m.key?.participant || m.participant || m.sender;

    // Leggi whitelist
    const whitelist = readWhitelist();
    const groupWhitelist = whitelist[m.chat]?.autorizzati || [];

    let founderJid = null;
    try {
        const metadata = await conn.groupMetadata(m.chat);
        founderJid = metadata.owner;
    } catch {
        founderJid = null;
    }

    const isAuthorized = jid =>
        groupWhitelist.includes(jid) || jid === botJid || jid === founderJid;

    const cleanAdmins = async () => {
        const usersToDemote = participants
            .map(p => p.jid)
            .filter(jid =>
                jid &&
                jid !== botJid &&
                !groupWhitelist.includes(jid) &&
                jid !== founderJid
            );

        if (!usersToDemote.length) return;

        try {
            await conn.groupParticipantsUpdate(m.chat, usersToDemote, 'demote');
            console.log('[ANTINUKE] Retrocessi:', usersToDemote);
        } catch (e) {
            console.error('[ANTINUKE] Errore:', e);
        }
    };

    if ([29, 30, 21].includes(m.messageStubType)) {
        if (!isAuthorized(sender)) await cleanAdmins();
    }
};

// Comando per gestire la whitelist (add / del)
handler.command = async function (m, { conn, text, args }) {
    if (!m.isGroup) return;
    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    const sender = m.key?.participant || m.participant || m.sender;

    // Solo owner globali possono usare il comando
    if (!ownerJids.includes(sender)) return m.reply('❌ Solo gli owner possono usare questo comando.');

    if (!args[0] || !['add', 'del'].includes(args[0].toLowerCase())) {
        return m.reply('Usa il comando così:\n.addwhitelist @user | .delwhitelist @user');
    }

    const action = args[0].toLowerCase();
    const whitelist = readWhitelist();
    if (!whitelist[m.chat]) whitelist[m.chat] = { autorizzati: [] };

    let targetJid;

    // Se rispondi al messaggio
    if (m.quoted) targetJid = m.quoted.sender;
    // Se tagghi @user
    else if (args[1] && args[1].startsWith('@')) targetJid = args[1].replace('@', '') + '@s.whatsapp.net';
    // Se inserisci numero
    else if (args[1]) targetJid = args[1].replace(/\D/g, '') + '@s.whatsapp.net';
    else return m.reply('Specifica un utente da aggiungere o rimuovere.');

    const participants = (await conn.groupMetadata(m.chat)).participants.map(p => p.jid);
    if (!participants.includes(targetJid)) return m.reply('L’utente deve essere nel gruppo.');

    if (action === 'add') {
        if (!whitelist[m.chat].autorizzati.includes(targetJid)) {
            whitelist[m.chat].autorizzati.push(targetJid);
            writeWhitelist(whitelist);
            return m.reply(`✅ Utente aggiunto alla whitelist: ${targetJid}`);
        } else return m.reply('Utente già nella whitelist.');
    }

    if (action === 'del') {
        whitelist[m.chat].autorizzati = whitelist[m.chat].autorizzati.filter(jid => jid !== targetJid);
        writeWhitelist(whitelist);
        return m.reply(`❌ Utente rimosso dalla whitelist: ${targetJid}`);
    }
};

// Rimuovere automaticamente chi esce dal gruppo dalla whitelist
handler.onParticipantUpdate = async function (m, { participants }) {
    const whitelist = readWhitelist();
    if (!whitelist[m.chat]) return;

    for (const p of participants) {
        if (p.action === 'remove') {
            whitelist[m.chat].autorizzati = whitelist[m.chat].autorizzati.filter(jid => jid !== p.id);
        }
    }
    writeWhitelist(whitelist);
};

export default handler;