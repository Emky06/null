// Plugin fatto da Axtral_WiZaRd
let userSpamCounters = {};  // Start
const STICKER_LIMIT = 6;  // Start
const PHOTO_VIDEO_LIMIT = 6;  // Start
const RESET_TIMEOUT = 5000;  // Start

export async function before(m, { isAdmin, isBotAdmin, conn }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat] || {};
    let bot = global.db.data.settings[this.user.jid] || {};
    let delet = m.key.participant;
    let bang = m.key.id;
    const sender = m.sender;  // Start
    const isOwner = global.owner.map(([number]) => number + '@s.whatsapp.net').includes(m.sender);

    // ? Ignora se il messaggio è dell'owner o del bot stesso
    if (isOwner || m.fromMe) return true;

    // Start
    if (!userSpamCounters[m.chat]) {
        userSpamCounters[m.chat] = {};
    }
    if (!userSpamCounters[m.chat][sender]) {
        userSpamCounters[m.chat][sender] = { 
            stickerCount: 0, 
            photoVideoCount: 0, 
            messageIds: [], 
            lastMessageTime: 0, 
            timer: null 
        };
    }

    const counter = userSpamCounters[m.chat][sender];
    const currentTime = Date.now();

    // Start
    const isSticker = m.message?.stickerMessage;
    const isPhoto = m.message?.imageMessage || m.message?.videoMessage;
    

    if (isSticker || isPhoto) {
        if (isSticker) {
            counter.stickerCount++;
        } else if (isPhoto) {
            counter.photoVideoCount++;
        } 

        counter.messageIds.push(m.key.id);
        counter.lastMessageTime = currentTime;

        if (counter.timer) {
            clearTimeout(counter.timer);
        }

        const isStickerSpam = counter.stickerCount >= STICKER_LIMIT;
        const isPhotoVideoSpam = counter.photoVideoCount >= PHOTO_VIDEO_LIMIT;

        if (chat.antispam && (isStickerSpam || isPhotoVideoSpam)) {
            if (isBotAdmin && bot.restrict) {
                try {
                    console.log('Spam rilevato! Modificando le impostazioni del gruppo...');

                    // Blocca chat temporaneamente
                    await conn.groupSettingUpdate(m.chat, 'announcement');
                    console.log('Solo gli amministratori possono inviare messaggi.');

                    // Rimuove l’utente se non è admin
                    if (!isAdmin) {
                        let responseb = await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
                        console.log(`Participant removal response: ${JSON.stringify(responseb)}`);

                        if (responseb[0].status === "404") {
                            console.log('Utente non trovato o già rimosso.');
                        }
                    } else {
                        console.log('L\'utente è un amministratore e non verrà rimosso.');
                    }

                    // Elimina i messaggi spam
                    for (const messageId of counter.messageIds) {
                        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: delet } });
                        console.log(`Messaggio con ID ${messageId} eliminato.`);
                    }
                    console.log('Tutti i messaggi di spam sono stati eliminati.');

                    // Riattiva la chat
                    await conn.groupSettingUpdate(m.chat, 'not_announcement');
                    console.log('Chat riattivata per tutti i membri.');

                    // Notifica
                    await conn.sendMessage(m.chat, { text: '> ⚠️ 𝐀𝐍𝐓𝐈𝐒𝐏𝐀𝐌 𝐀𝐓𝐓𝐈𝐕𝐎 ⚠\n\n*𝐍𝐨𝐧 𝐞̀ 𝐜𝐨𝐧𝐜𝐞𝐬𝐬𝐨 𝐢𝐧𝐯𝐢𝐚𝐫𝐞 𝐩𝐢𝐮̀ 𝐝𝐢 5 𝐬𝐭𝐢𝐜𝐤𝐞𝐫/𝐟𝐨𝐭𝐨/𝐯𝐢𝐝𝐞𝐨 𝐝𝐢 𝐬𝐞𝐠𝐮𝐢𝐭𝐨.*' });
                    console.log('Messaggio di notifica antispam inviato.');

                    // Reset contatore
                    delete userSpamCounters[m.chat][sender];
                    console.log('Contatore di spam per l\'utente resettato.');

                } catch (error) {
                    console.error('Errore durante la gestione dello spam:', error);
                }
            } else {
                console.log('Il bot non è amministratore o la restrizione è disattivata. Non posso eseguire l\'operazione.');
            }
        } else {
            counter.timer = setTimeout(() => {
                delete userSpamCounters[m.chat][sender];
                console.log('Contatore di spam per l\'utente resettato dopo il timeout.');
            }, RESET_TIMEOUT);
        }
    } else {
        if (currentTime - counter.lastMessageTime > RESET_TIMEOUT && 
            (counter.stickerCount > 0 || counter.photoVideoCount > 0 || counter.tagCount > 0)) {
            console.log('Timeout scaduto. Reset del contatore di spam per l\'utente.');
            delete userSpamCounters[m.chat][sender];
        }
    }

    return true;
}