// Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = generateMenuText(usedPrefix);

    const msgID = message.id || message.key?.id;
    let device = 'Dispositivo sconosciuto 🕵️‍♂️';

    if (!msgID) {
        device = '⚠️ Impossibile rilevare il dispositivo';
    } else if (/^[a-zA-Z]+-[a-fA-F0-9]+$/.test(msgID)) {
        device = '🤖 Messaggio da bot';
    } else if (msgID.startsWith('false_') || msgID.startsWith('true_')) {
        device = '💻 WhatsApp Web';
    } else if (msgID.startsWith('3EB0') && /^[A-Z0-9]+$/.test(msgID)) {
        device = '💻 WhatsApp Web o bot';
    } else if (msgID.includes(':')) {
        device = '🖥️ WhatsApp Desktop';
    } else if (/^[A-F0-9]{32}$/i.test(msgID)) {
        device = '📱 Android';
    } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msgID)) {
        device = '🍏 iOS';
    } else if (/^[A-Z0-9]{20,25}$/i.test(msgID) && !msgID.startsWith('3EB0')) {
        device = '🍏 iOS';
    } else if (msgID.startsWith('3EB0')) {
        device = '🤖 Android (vecchio schema)';
    }

    if (device.includes('iOS')) {
        await conn.sendMessage(
            message.chat,
            {
                text: menuText,
                footer: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐦𝐞𝐧𝐮̀:',
                buttons: [
                    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                    { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
                    { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝" }, type: 1 },
                    { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢" }, type: 1 },
                    { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨" }, type: 1 },
                    { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢" }, type: 1 },
                ]
            },
            { quoted: message }
        );
    } else if (device.includes('Android') || device.includes('Web')) {
        await conn.sendMessage(
            message.chat,
            {
                text: menuText,
                interactiveButtons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: '📝 𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐮𝐧 𝐦𝐞𝐧𝐮̀',
                            sections: [
                                {
                                    title: '𝐌𝐞𝐧𝐮̀',
                                    rows: [
                                        { title: '🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞', description: 'Torna al menu principale', id: `${usedPrefix}menu` },
                                        { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi admin', id: `${usedPrefix}admin` },
                                        { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatori', id: `${usedPrefix}mod` },
                                        { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi gestione gruppo', id: `${usedPrefix}funzioni` },
                                        { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi membri', id: `${usedPrefix}gruppo` },
                                        { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Comandi giochi e intrattenimento', id: `${usedPrefix}giochi` }
                                    ]
                                }
                            ]
                        })
                    }
                ]
            },
            { quoted: message }
        );
    } else {
        await conn.sendMessage(
            message.chat,
            { text: menuText },
            { quoted: message }
        );
    }
};

handler.help = ['owner'];
handler.tags = ['menu'];
handler.command = /^(owner)$/i;

export default handler;

function generateMenuText(prefix) {
    return `
╭━━━〔 𝑴𝑬𝑵𝑼 𝑶𝑾𝑵𝑬𝑹 〕━━━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 📂 *𝑮𝒆𝒔𝒕𝒊𝒐𝒏𝒆 𝑩𝒐𝒕*
┃
┃ 🔧 .impostanome — Imposta nome bot
┃ ♻️ .resettanome — Resetta nome bot
┃ 🖼️ .setfp — Cambia immagine profilo
┃ 🔗 .join — Entra nel gruppo con link
┣━━━━━━━━━━━━━━━━━━━━
┃ 🙎 *𝑮𝒆𝒔𝒕𝒊𝒐𝒏𝒆 𝑼𝒕𝒆𝒏𝒕𝒊*
┃
┃ ⛔ .banuser / .unbanuser — Blocca/sblocca utenti
┃ 🚫 .blockuser / .unblockuser — Blocca/sblocca user
┃ 📃 .blocklist — Lista utenti bloccati
┃ 📃 .banlist — Lista utenti bannati
┃ 📑 .setcategoria — Assegna categoria utente
┃ 📑 .delcategoria — Rimuovi categoria utente
┣━━━━━━━━━━━━━━━━━━━━
┃ 📊 *𝑪𝒐𝒏𝒕𝒓𝒐𝒍𝒍𝒐 𝑼𝒕𝒆𝒏𝒕𝒊*
┃
┃ 📉 .azzera — Azzera messaggi utente
┃ 📉 .azzeramoney — Azzera soldi utente
┃ 📉 .removeallmoney — Reset soldi gruppo
┃ 📉 .removeallmsg — Reset messaggi gruppo
┃ 📉 .removeallblasph — Reset bestemmie gruppo
┃ ➕ .aggiungi — Aggiunge messaggi
┃ ➖ .rimuovi — Rimuove messaggi
┃ ➕💶 .addmoney — Aggiunge soldi
┃ ➖💶 .rmoney — Rimuove soldi
┣━━━━━━━━━━━━━━━━━━━━
┃ 🔒 *𝑮𝒆𝒔𝒕𝒊𝒐𝒏𝒆 𝑴𝒐𝒅𝒆𝒓𝒂𝒕𝒐𝒓𝒊*
┃
┃ 👮🏻‍♂️ .listgp — Lista gruppi/mod
┃ 👮🏻‍♂️ .addmod / .delmod — Gestione moderatori
┃ 👮🏻‍♂️ .delallmod — Rimuovi tutti i mod
┃ 👮🏻‍♂️ .delmodglobal — Rimuovi mod globale
┃ 👮🏻‍♂️ .delgp — Rimuovi gruppo + mod
┣━━━━━━━━━━━━━━━━━━━━
┃ 🛠️ *𝑺𝒕𝒓𝒖𝒎𝒆𝒏𝒕𝒊 𝑨𝒗𝒂𝒏𝒛𝒂𝒕𝒊*
┃
┃ 🕒 .timer — Attiva timer solostaff
┃ 🔴 .timeroff — Disattiva timer
┃ 🚪 .byebye — Il bot esce dal gruppo
┃ ⚙️ .prefisso / .resettaprefisso — Prefisso
┃ 👑 .godmode — Auto-admin
┣━━━━━━━━━━━━━━━━━━━━
┃ 📦 *𝑷𝒍𝒖𝒈𝒊𝒏 & 𝑭𝒊𝒍𝒆*
┃
┃ 📥 .getplugin / .getfile — Scarica file
┃ ✏️ .editplugin — Modifica plugin
┃ 💾 .saveplugin — Salva plugin
┃ 🗑️ .deleteplugin — Elimina plugin
┣━━━━━━━━━━━━━━━━━━━━
┃ 👑 *𝑷𝒆𝒓𝒎𝒆𝒔𝒔𝒊 𝑶𝒘𝒏𝒆𝒓*
┃
┃ 👥 .addowner / .delowner — Gestione owner
┃ 🛡️ .tempadmin — Admin temporaneo
┣━━━━━━━━━━━━━━━━━━━━
┃ 🚀 *𝑬𝒙𝒕𝒓𝒂 𝑻𝒐𝒐𝒍𝒔*
┃
┃ 📢 .bigtag — Tag continuo utenti
╰━━━━━━━━━━━━━━━━━━━╯
*𝐁𝐲* ${nomebot}
`.trim();
}
