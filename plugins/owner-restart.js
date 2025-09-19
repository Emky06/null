import { spawn } from 'child_process'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function isAuthorized(sender) {
    const authorizedNumbers = [
        '393755435365@s.whatsapp.net',
        '393511198848@s.whatsapp.net',
        '35796261367@s.whatsapp.net',
        '35795191323@s.whatsapp.net',
        '573161874043@s.whatsapp.net',
    ];
    return authorizedNumbers.includes(sender);
}

let handler = async (m, { conn }) => {
    if (!isAuthorized(m.sender)) {
        await conn.sendMessage(m.chat, { text: "❌ Non sei autorizzato a usare questo comando." });
        return;
    }

    if (!process.send) throw 'Non fare: node main.js\nFai: node index.js';

    if (global.conn.user.jid === conn.user.jid) {
        const sentMsg = await conn.sendMessage(m.chat, { text: `*Sto riavviando...⏳*` }, { quoted: m });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `🚀🚀🚀🚀`, edit: sentMsg.key });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `🚀🚀🚀🚀🚀🚀`, edit: sentMsg.key });

        await delay(1000);
        await conn.sendMessage(m.chat, { text: `*Riavviato con successo✅*`, edit: sentMsg.key });

        process.send('reset');
    } else {
        throw '_eeeeeiiittsssss..._';
    }
}

handler.help = ['restart', 'riavvia', 'reiniciar'];
handler.tags = ['proprietario'];
handler.command = /^(res(tart)?|riavvia|reiniciar)$/i;
handler.rowner = true;

export default handler;