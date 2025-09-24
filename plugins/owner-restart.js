//Plugin fatto da Axtral_WiZaRd
import { spawn } from 'child_process'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn }) => {
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

handler.help = ['restart', 'riavvia'];
handler.tags = ['owner'];
handler.command = /^(res(tart)?|riavvia)$/i;
handler.rowner = true;

export default handler;
