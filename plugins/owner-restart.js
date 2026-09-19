//Plugin fatto da Axtral_WiZaRd
import { spawn } from 'child_process'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn }) => {
    if (!process.send) throw 'Non fare: node main.js\nFai: node index.js';

    if (global.conn.user.jid === conn.user.jid) {
        const sender = m.sender
        const orario = new Date().toLocaleTimeString('it-IT')

        const buildMsg = (stato, extra = '') => `
╭━━━〔 ⚙️ 𝐁𝐎𝐓 𝐑𝐄𝐒𝐓𝐀𝐑𝐓 〕━━━⬣
┃
┃ 👤 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐨 𝐝𝐚: @${sender.split('@')[0]}
┃ 🕒 𝐎𝐫𝐚: ${orario}
┃ 📊 𝐒𝐭𝐚𝐭𝐨: \`${stato}\`
┃${extra}
╰━━━━━━━━━━━━━━━━━━⬣`.trim()

        const sentMsg = await conn.sendMessage(
            m.chat,
            { text: buildMsg('𝐀𝐯𝐯𝐢𝐨 𝐫𝐢𝐚𝐯𝐯𝐢𝐨...'), mentions: [sender] },
            { quoted: m }
        )

        await delay(1000)
        await conn.sendMessage(m.chat, {
            text: buildMsg('𝐂𝐡𝐢𝐮𝐬𝐮𝐫𝐚 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢...', '\n┃ 🚀 𝐏𝐫𝐨𝐜𝐞𝐝𝐮𝐫𝐚 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...'),
            edit: sentMsg.key,
            mentions: [sender]
        })

        await delay(1000)
        await conn.sendMessage(m.chat, {
            text: buildMsg('𝐑𝐢𝐚𝐯𝐯𝐢𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...', '\n┃ 🚀🚀🚀🚀🚀🚀'),
            edit: sentMsg.key,
            mentions: [sender]
        })

        await delay(1000)
        await conn.sendMessage(m.chat, {
            text: `
╭━━━〔 ✅ 𝐁𝐎𝐓 𝐑𝐈𝐀𝐕𝐕𝐈𝐀𝐓𝐎 〕━━━⬣
┃
┃ 👤 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐨 𝐝𝐚: @${sender.split('@')[0]}
┃ 🕒 𝐎𝐫𝐚: ${orario}
┃ 📊 𝐒𝐭𝐚𝐭𝐨: \`𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐨\`
┃
╰━━━━━━━━━━━━━━━━━━⬣

> ⏳ 𝐀𝐭𝐭𝐞𝐧𝐝𝐢 𝐢𝐥 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐞𝐥 𝐫𝐢𝐚𝐯𝐯𝐢𝐨 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐮𝐬𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐭.
> 🔄 𝐈𝐥 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐨 𝐬𝐚𝐫𝐚̀ 𝐧𝐮𝐨𝐯𝐚𝐦𝐞𝐧𝐭𝐞 𝐚𝐭𝐭𝐢𝐯𝐨 𝐚 𝐛𝐫𝐞𝐯𝐞.`.trim(),
            edit: sentMsg.key,
            mentions: [sender]
        })

        process.send('reset');
    } else {
        throw '_eeeeeiiittsssss..._';
    }
}

handler.help = ['restart', 'riavvia'];
handler.tags = ['owner'];
handler.command = /^(res(tart)?|riavvia)$/i;
handler.rowner = true;

export default handler;