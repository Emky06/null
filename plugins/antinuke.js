// Plugin fatto da Axtral_WiZaRd
import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, args, usedPrefix, text, command, participants, isBotAdmin }) => {
    // Parte 1: Gestione comandi whitelist
    if (command === 'addwhitelist' || command === 'delwhitelist') {
        if (!m.isGroup) return;

        const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
        const sender = m.key?.participant || m.participant || m.sender;

        // Solo owner globali possono usare il comando
        if (!ownerJids.includes(sender)) {
            await conn.sendMessage(m.chat, { text: '❌ Solo gli owner possono usare questo comando.' }, { quoted: m });
            return;
        }

        const whitelistFile = path.join('./db', 'autorizzati-antinuke.json');
        
        // Funzioni di lettura e scrittura JSON
        const readWhitelist = () => {
            if (!fs.existsSync(whitelistFile)) return {};
            return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'));
        };

        const writeWhitelist = (data) => {
            fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf-8');
        };

        const whitelist = readWhitelist();
        if (!whitelist[m.chat]) whitelist[m.chat] = { autorizzati: [] };

        let targetJid;

        // Se rispondi al messaggio
        if (m.quoted) targetJid = m.quoted.sender;
        // Se tagghi @user
        else if (args[0] && args[0].startsWith('@')) {
            targetJid = args[0].replace('@', '') + '@s.whatsapp.net';
        }
        // Se inserisci numero
        else if (args[0]) {
            targetJid = args[0].replace(/\D/g, '') + '@s.whatsapp.net';
        }
        else {
            await conn.sendMessage(m.chat, { text: 'Specifica un utente da aggiungere o rimuovere.\nEsempi:\n• Rispondi a un suo messaggio\n• Taggalo con @utente\n• Inserisci il numero' }, { quoted: m });
            return;
        }

        try {
            const metadata = await conn.groupMetadata(m.chat);
            const participants = metadata.participants.map(p => p.id);
            
            if (!participants.includes(targetJid)) {
                await conn.sendMessage(m.chat, { text: '❌ L\'utente deve essere nel gruppo.' }, { quoted: m });
                return;
            }

            switch (command) {
                case 'addwhitelist':
                    if (!whitelist[m.chat].autorizzati.includes(targetJid)) {
                        whitelist[m.chat].autorizzati.push(targetJid);
                        writeWhitelist(whitelist);
                        await conn.sendMessage(m.chat, { 
                            text: `✅ Utente aggiunto alla whitelist:\n${targetJid}` 
                        }, { quoted: m });
                    } else {
                        await conn.sendMessage(m.chat, { text: '⚠️ Utente già nella whitelist.' }, { quoted: m });
                    }
                    break;

                case 'delwhitelist':
                    const index = whitelist[m.chat].autorizzati.indexOf(targetJid);
                    if (index > -1) {
                        whitelist[m.chat].autorizzati.splice(index, 1);
                        writeWhitelist(whitelist);
                        await conn.sendMessage(m.chat, { 
                            text: `❌ Utente rimosso dalla whitelist:\n${targetJid}` 
                        }, { quoted: m });
                    } else {
                        await conn.sendMessage(m.chat, { text: '⚠️ Utente non trovato nella whitelist.' }, { quoted: m });
                    }
                    break;
            }
        } catch (error) {
            console.error('[ANTINUKE] Errore comando:', error);
            await conn.sendMessage(m.chat, { text: '❌ Errore durante l\'esecuzione del comando.' }, { quoted: m });
        }
        return;
    }

    // Parte 2: Funzionalità antinuke (handler.before)
    if (!m.isGroup) return;
    if (!isBotAdmin) return;

    const chat = global.db.data.chats[m.chat];
    if (!chat?.antinuke) return;

    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const sender = m.key?.participant || m.participant || m.sender;

    // Leggi whitelist
    const whitelistFile = path.join('./db', 'autorizzati-antinuke.json');
    const readWhitelist = () => {
        if (!fs.existsSync(whitelistFile)) return {};
        return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'));
    };

    const whitelist = readWhitelist();
    const groupWhitelist = whitelist[m.chat]?.autorizzati || [];

    let founderJid = null;
    try {
        const metadata = await conn.groupMetadata(m.chat);
        founderJid = metadata.owner;
    } catch {
        founderJid = null;
    }

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');

    const isAuthorized = jid =>
        groupWhitelist.includes(jid) || jid === botJid || jid === founderJid || ownerJids.includes(jid);

    const cleanAdmins = async () => {
        try {
            const metadata = await conn.groupMetadata(m.chat);
            const admins = metadata.participants
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => p.id);

            const usersToDemote = admins.filter(jid =>
                jid &&
                jid !== botJid &&
                !ownerJids.includes(jid) &&
                !groupWhitelist.includes(jid) &&
                jid !== founderJid
            );

            if (!usersToDemote.length) return;

            // Demote in batch per evitare rate limit
            for (const jid of usersToDemote) {
                try {
                    await conn.groupParticipantsUpdate(m.chat, [jid], 'demote');
                    console.log(`[ANTINUKE] Retrocesso: ${jid}`);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Delay tra le operazioni
                } catch (e) {
                    console.error(`[ANTINUKE] Errore retrocessione ${jid}:`, e.message);
                }
            }
        } catch (e) {
            console.error('[ANTINUKE] Errore generale:', e);
        }
    };

    // Controlla se è un'azione di promozione/demozione
    if ([29, 30, 21].includes(m.messageStubType)) {
        if (!isAuthorized(sender)) {
            console.log(`[ANTINUKE] Azione non autorizzata da: ${sender}`);
            await cleanAdmins();
        }
    }
};

// Handler per eventi onParticipantUpdate (rimozione automatica dalla whitelist)
handler.onParticipantUpdate = async function (m, { participants }) {
    const whitelistFile = path.join('./db', 'autorizzati-antinuke.json');
    
    const readWhitelist = () => {
        if (!fs.existsSync(whitelistFile)) return {};
        return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'));
    };

    const writeWhitelist = (data) => {
        fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf-8');
    };

    const whitelist = readWhitelist();
    if (!whitelist[m.chat]) return;

    let changed = false;
    for (const p of participants) {
        if (p.action === 'remove') {
            const index = whitelist[m.chat].autorizzati.indexOf(p.id);
            if (index > -1) {
                whitelist[m.chat].autorizzati.splice(index, 1);
                changed = true;
                console.log(`[ANTINUKE] Rimosso ${p.id} dalla whitelist (uscito dal gruppo)`);
            }
        }
    }
    
    if (changed) {
        writeWhitelist(whitelist);
    }
};

// Comandi registrati
handler.command = ['addwhitelist', 'delwhitelist'];
handler.group = true;
handler.owner = true;

export default handler;