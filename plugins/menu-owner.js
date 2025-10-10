//Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix, command }) => {
    
    const menuText = generateMenuText(usedPrefix);

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
                                    { title: '🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧', description: 'Comandi amministratore', id: `${usedPrefix}admin` },
                                    { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatore', id: `${usedPrefix}mod` },
                                    { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi generali e utilità', id: `${usedPrefix}funzioni` },
                                    { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi per la gestione dei gruppi', id: `${usedPrefix}gruppo` },
                                    { title: '🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢', description: 'Comandi per giochi e intrattenimento', id: `${usedPrefix}giochi` }
                                ]
                            }
                        ]
                    })
                }
            ]
        },
        { quoted: message }
    );
};

handler.help = ['owner'];
handler.tags = ['menu'];
handler.command = /^(owner)$/i;

export default handler;

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
┣━ 👋🏻 .pulizia <prefisso>
┣━ 📑 .setcategoria ┃ Assegna una categoria
┣━ 📑 .delcategoria ┃ Rimuovi categoria 

📊 *Controllo Utenti*
┣━ 📉 .azzera @ ┃ Azzera msg
┣━ 📉 .azzeratutti ┃ Azzera msg e bestemmie di tutti
┣━ 📉 .azzeramoney @ ┃ Azzera soldi
┣━ 📉 .removeallmoney ┃ Azzera soldi di tutti gli utenti del gruppo
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
┣━ 🕒 .timer ┃ Timer automatico per attivare e disattivare soloadmin
┣━ 🔴 .timeroff ┃ Disattiva il timer
┣━ 🚪 .out ┃ Il bot esce dal gruppo
┣━ 🚪 .outall ┃ Da tutti i gruppi
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