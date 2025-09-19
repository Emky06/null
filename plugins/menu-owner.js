import { performance } from 'perf_hooks';
import fetch from 'node-fetch'; // Assicurati di avere node-fetch installato

const handler = async (message, { conn, usedPrefix, command }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

    if (command === 'menu') {
        return await (await import('./menu-principale.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'admin') {
        return await (await import('./menu-admin.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'mod') {
        return await (await import('./menu-mod')).default(message, { conn, usedPrefix });
    }
    if (command === 'funzioni') {
        return await (await import('./menu-funzioni.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'gruppo') {
        return await (await import('./menu-gruppo.js')).default(message, { conn, usedPrefix });
    }    
    if (command === 'giochi') {
        return await (await import('./menu-giochi.js')).default(message, { conn, usedPrefix });   
    }

    const menuText = generateMenuText(usedPrefix, botName, userCount);


    await conn.sendMessage(
        message.chat,
        {
            text: menuText,
            footer: 'Scegli un menu:',
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
                { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
                { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ Menu Mod" }, type: 1 },
                { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 Menu Funzioni" }, type: 1 },
                { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
                { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 Menu Giochi" }, type: 1 },
            ],
            viewOnce: true,
        }
    );
};

handler.help = ['owner', 'menu', 'admin', 'funzioni', 'gruppo'];
handler.tags = ['menu'];
handler.command = /^(owner|menu|admin|funzioni|gruppo|giochi)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
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
