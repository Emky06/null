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
                                    { title: '👑 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫', description: 'Comandi del proprietario', id: `${usedPrefix}owner` },
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