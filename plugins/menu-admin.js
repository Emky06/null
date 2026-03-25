// Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

const handler = async (message, { conn, usedPrefix, command }) => {
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
    } else {
        device = 'Dispositivo sconosciuto 🕵️‍♂️';
        console.log('[ANALISI] Nuovo ID non riconosciuto:', msgID);
    }


    if (device.includes('iOS')) {
        await conn.sendMessage(
            message.chat,
            {
                text: menuText,
                footer: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐦𝐞𝐧𝐮̀:',
                buttons: [
                    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                    { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
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
                                    { title: '👑 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi del proprietario', id: `${usedPrefix}owner` },
                                    { title: '👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝', description: 'Comandi moderatori', id: `${usedPrefix}mod` },
                                    { title: '🔧 𝐌𝐞𝐧𝐮̀ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐢', description: 'Comandi gestione gruppo', id: `${usedPrefix}funzioni` },
                                    { title: '👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨', description: 'Comandi membri', id: `${usedPrefix}gruppo` },
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
    } else {
        await conn.sendMessage(
            message.chat,
            { text: menuText },
            { quoted: message }
        );
    }
};

handler.help = ['admin'];
handler.tags = ['menuadmin'];
handler.command = /^(admin)$/i;

export default handler;

function generateMenuText(prefix) {
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
┣━ 🛡️ .mutati / listamutati
┣━ 🛡️ .listawarn
┣━ 🛡️ .del

👥 *Gestione Tag & Gruppi:*
┣━ 📢 .tag
┣━ 📢 .tagall
┣━ ⏱️ .countdown (countdown tag)
┣━ ⏱️ .closetime
┣━ 🔓 .aperto / chiuso
┣━ 🔓 .remotegp/rgp (a distanza)
┣━ 📜 .rules

📥 *Messaggi automatici:*
┣━ 🎉 .setwelcome
┣━ 🥀 .setbye
┣━ ❌ .setremove
┣━ 📜 .setregole
┣━ 🎲 .sim

📊 *Gestione Gruppo:*
┣━ 👻 .inattivi
┣━ 🚪 .viainattivi
┣━ 👑 .admins
┣━ 📥 .richieste 
┣━ 📥 .request/profili (numeri nelle richieste)

🧊 *Extra Admin Tools:*
┣━ ❄️ .freeze @
┣━ 🗑️ .ds 
┣━ 👁️ .rivela
┣━ 🔗 .link
┣━ 🔗 .linkg
┣━ 🔗 .linkqr
┣━ 🔁 .reimposta (link)

🖼️ *Foto & Info:*
┣━ 📷 .pic @
┣━ 🖼️ .picgruppo
┣━ 🧬 .bio <testo>

🎉 *Comandi Fun*
┣━ 🏆 .top (10,50,100)
┣━ 💋 .topsexy
┣━ 🍑 .toptroie
┣━ ࿖ .topnazi
┣━ 🏳️‍🌈 .toplgbt

┏━━━━━━━━━━━━━━━━━━━┓
┃      ☄️ 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 ☄️     ┃
┗━━━━━━━━━━━━━━━━━━━┛
`.trim();
}
