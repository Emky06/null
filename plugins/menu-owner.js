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

// === Testo menu con font fancy ===
function generateMenuText(prefix) {
    return `
┏━━━━━━━━━━━━━━━━━━━┓
┃       🔱𝐌𝐄𝐍𝐔 𝐎𝐖𝐍𝐄𝐑🔱      ┃
┗━━━━━━━━━━━━━━━━━━━┛

📂 *Gestione Bot*
┣━ 🔧 .impostanome ┃ Imposta nome bot
┣━ ♻️ .resettanome ┃ Resetta nome
┣━ 🖼️ .setpp ┃ Cambia immagine profilo

👥 *Gestione Gruppi*
┣━ ➕ .setgruppi ┃ Gruppi autorizzati
┣━ ➕ .aggiungigruppi @
┣━ ➖ .resetgruppi @

🙎 *Gestione Utenti*
┣━ ⛔ .banuser @ / .unbanuser @
┣━ 🚫 .blockuser @ / .unblockuser @
┣━ 📑 .setcategoria ┃ Assegna una categoria
┣━ 📑 .delcategoria ┃ Rimuovi categoria

📊 *Controllo Utenti*
┣━ 📉 .azzera @ ┃ Azzera msg
┣━ 📉 .azzeramoney @ ┃ Azzera soldi
┣━ 📉 .removeallmoney ┃ Azzera soldi di tutti gli utenti del gruppo
┣━ 📉 .removeallblasph ┃ Azzera bestemmie di tutti gli utenti del gruppo
┣━ ➕ .aggiungi 10 @ ┃ Aggiunge msg
┣━ ➖ .rimuovi 10 @ ┃ Rimuove msg
┣━➕💶 .addmoney 10 @ ┃ Aggiunge soldi
┣━➖💶 .rmoney 10 @ ┃ Rimuove soldi

🔒 *Sicurezza*
┣━ 📃 .blocklist ┃ Lista bloccati
┣━ 📃 .banlist ┃ Utenti bannati
┣━ 👮🏻‍♂️ .addmod @ ┃ Aggiungi moderatori
┣━ 👮🏻‍♂️ .delmod @ ┃ Rimuovi moderatori

🛠️ *Strumenti Avanzati*
┣━ 🕒 .timer ┃ Timer automatico per attivare/disattivare soloadmin
┣━ 🔴 .timeroff ┃ Disattiva il timer
┣━ 🚪 .byebye ┃ Il bot esce dal gruppo
┣━ ⚙️ .prefisso / .resettaprefisso
┣━ 👑 .godmode ┃ Auto-admin

📦 *Plugin & File*
┣━ 📥 .getplugin / .getfile
┣━ ✏️ .editplugin
┣━ 💾 .saveplugin
┣━ 🗑️ .deleteplugin

👑 *Permessi Owner*
┣━ 👥 .addowner @ / .delowner @
┣━ 🛡️ .tempadmin

🚀 *Extra Tools*
┗━ 📢 .bigtag ┃ Tag continui

━━━━━━━━━━━━━━━━━━━━━
┏━━━━━━━━━━━━━━━━━━━┓
┃        ☄️𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕☄️     ┃
┗━━━━━━━━━━━━━━━━━━━┛
`.trim();
}
