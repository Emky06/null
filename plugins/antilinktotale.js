// antilink di Riad, mod da axtral

const linkRegex = /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi;
const safeDomains = ['whatsapp.com', 'instagram.com', 'instagr.am', 'tiktok.com'];
const ignoredCommands = ['.play', '.play1', '.play2'];
const maxWarn = 3;

// Funzione per rimuovere caratteri invisibili e normalizzare il testo
function normalizeText(text) {
    return (text || '')
        .normalize('NFKC') // normalizza unicode
        .replace(/[\u200B-\u200D\uFEFF\u2060-\u206F\u00AD\u034F\u180E\u17B4\u17B5]/g, '') // caratteri invisibili, soft hyphen, ecc.
        .replace(/\s+/g, ''); // rimuove spazi normali
}

export async function before(m, { isAdmin, isBotAdmin, conn }) {
    if (!m.isGroup || m.isBaileys) return true;

    let chat = global.db.data.chats[m.chat];
    if (!chat.antilinktotale) return true;

    // Ignora se il messaggio inizia con uno dei comandi ignorati
    const lowerText = (m.text || '').toLowerCase();
    if (ignoredCommands.some(cmd => lowerText.startsWith(cmd))) return true;

    // 🔹 Pulizia avanzata del testo per rilevare link anche con caratteri invisibili
    let cleanedText = normalizeText(m.text || '');

    if (linkRegex.test(cleanedText)) {
        let matched = cleanedText.match(linkRegex);
        let link = matched ? matched[0] : '';

        if (safeDomains.some(domain => link.includes(domain))) return true;
        if (isAdmin) return true;

        const user = global.db.data.users[m.sender];
        user.warn = user.warn || 0;
        user.warn += 1;

        // Elimina messaggio originale
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant || m.sender
            }
        });

        // Avviso warn
        await conn.sendMessage(m.chat, {
            text: `⚠️ 𝐋𝐈𝐍𝐊 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎\n@${m.sender.split('@')[0]} 𝐡𝐚 𝐫𝐢𝐜𝐞𝐯𝐮𝐭𝐨 𝐮𝐧 𝐰𝐚𝐫𝐧.\n> 𝐖𝐚𝐫𝐧 *${user.warn} 𝐬𝐮 ${maxWarn}*`,
            mentions: [m.sender]
        });

        // Rimozione dopo max warn
        if (user.warn >= maxWarn) {
            user.warn = 0;
            await conn.sendMessage(m.chat, {
                text: `⛔ @${m.sender.split('@')[0]} 𝐡𝐚 𝐫𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨 ${maxWarn} 𝐰𝐚𝐫𝐧 𝐞𝐝 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐛𝐮𝐭𝐭𝐚𝐭𝐨 𝐟𝐮𝐨𝐫𝐢 𝐚 𝐜𝐚𝐥𝐜𝐢 𝐢𝐧 𝐜𝐮𝐥𝐨.`,
                mentions: [m.sender]
            });
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }

    return true;
}