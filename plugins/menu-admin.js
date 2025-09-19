import { performance } from 'perf_hooks';
import fetch from 'node-fetch'; // Assicurati di avere node-fetch installato

const handler = async (message, { conn, usedPrefix, command }) => {
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.nomedelbot || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕';

    if (command === 'menu') {
        return await (await import('./menu-principale.js')).default(message, { conn, usedPrefix });
    }
    if (command === 'owner') {
        return await (await import('./menu-owner.js')).default(message, { conn, usedPrefix });
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
                { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 Menu Owner" }, type: 1 },
                { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ Menu Mod" }, type: 1 },
                { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: "🔧 Menu Funzioni" }, type: 1 },
                { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
                { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 Menu Giochi" }, type: 1 },
            ],
            viewOnce: true,
        }
    );
};

handler.help = ['admin', 'menu', 'owner', 'funzioni', 'gruppo'];
handler.tags = ['menuadmin'];
handler.command = /^(admin|menu|owner|funzioni|gruppo)$/i;

export default handler;

function generateMenuText(prefix, botName, userCount) {
    return `
┏━━━━━━━━━━━━━━━━━━━┓
┃   🛡️𝐌 𝐄 𝐍 𝐔   𝐀 𝐃 𝐌 𝐈 𝐍🛡️   ┃
┗━━━━━━━━━━━━━━━━━━━┛ 

🎯 *Comandi Moderazione:*
┣━ 🛡️ .promuovi / p
┣━ 🛡️ .retrocedi / r
┣━ 🛡️ .warn / unwarn
┣━ 🛡️ .resetwarn
┣━ 🛡️ .muta / smuta
┣━ 🛡️ .mutelist

👥 *Gestione Tag & Gruppi:*
┣━ 📢 .hidetag / tag
┣━ 📢 .tagall
┣━ 🔓 .aperto / chiuso

📥 *Messaggi automatici:*
┣━ 🎉 .setwelcome
┣━ 🥀 .setbye
┣━ ❌ .setremove

📊 *Gestione Gruppo:*
┣━ 👻 .inattivi
┣━ 📋 .listanum <prefisso>
┣━ 🚪 .viainattivi
┣━ 🎲 .sim
┣━ 👑 .admins
┣━ 📥 .richieste 

🧊 *Extra Admin Tools:*
┣━ ❄️ .freeze @
┣━ 🔍 .ispeziona (link)
┣━ 🏆 .top (10,50,100)
┣━ 💋 .topsexy
┣━ 🍑 .toptroie

🖼️ *Foto & Info:*
┣━ 📷 .pic @
┣━ 🖼️ .picgruppo
┣━ 📝 .nome <testo>
┣━ 🧬 .bio <testo>
┣━ 🔗 .linkqr

┏━━━━━━━━━━━━━━━━━━━┓
┃      ☄️ 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 ☄️     ┃
┗━━━━━━━━━━━━━━━━━━━┛
`.trim();
}
