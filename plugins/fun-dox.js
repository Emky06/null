//Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';

let handler = async (m, { conn, text }) => {

    let jid;

    if (m.mentionedJid && m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (m.quoted) {
        jid = m.quoted.sender;
    } else {
        jid = m.sender;
    }

    let target = `@${jid.split('@')[0]}`;

    await m.reply(`⏳ *Inizio processo di DOX...*`);

    await m.reply(`🔍 *Progresso:* ${pickRandom(['12','18','25','33','41'])}%`);
    await m.reply(`🔍 *Progresso:* ${pickRandom(['52','64','73','81'])}%`);
    await m.reply(`🔍 *Progresso:* ${pickRandom(['88','94','97','100'])}%`);

    let old = performance.now();
    let neww = performance.now();
    let speed = `${(neww - old).toFixed(2)} ms`;

    let doxeo = `
*✔️ DOX COMPLETATO CON SUCCESSO*
━━━━━━━━━━━━━━━━━━━━━
👤 *Persona doxata:* ${target}

🌐 *IP Pubblico:* ${pickRandom([
    '92.28.211.234',
    '140.216.58.100',
    '80.139.134.15',
    '88.53.127.8',
    '231.87.85.223',
    '176.45.22.91',
    '109.201.134.77'
])}

🛰️ *IP Secondario:* ${pickRandom([
    '10.0.0.254',
    '192.168.1.1',
    '172.16.0.3'
])}

🌍 *Geo-Location:* ${pickRandom([
    'Milano, Italia',
    'Roma, Italia',
    'Napoli, Italia',
    'Torino, Italia',
    'Bari, Italia',
    'Palermo, Italia'
])}

📶 *ISP:* ${pickRandom([
    'Vodafone',
    'WINDTRE',
    'Fastweb',
    'TIM',
    'Iliad',
    'Sky Wifi'
])}

📡 *DNS:* ${pickRandom([
    '8.8.8.8',
    '8.8.4.4',
    '1.1.1.1',
    '9.9.9.9'
])}

🖥️ *MAC Address:* ${pickRandom([
    '4A:93:23:18:BA:7F',
    'F0:1A:30:3B:EA:D1',
    'AD:7E:2A:FB:81:B3',
    'C8:3D:97:11:FA:22'
])}

📟 *Device:* ${pickRandom([
    'Samsung Galaxy S24',
    'iPhone 15 Pro',
    'Xiaomi 14 Ultra',
    'OnePlus 12',
    'Huawei P60 Pro',
    'Redmi Note 13'
])}

🌐 *Browser:* ${pickRandom([
    'Chrome Mobile',
    'Safari',
    'Firefox',
    'Samsung Internet'
])}

🔐 *Sistema:* ${pickRandom([
    'Android 14',
    'iOS 17',
    'MIUI 15',
    'HyperOS'
])}

📂 *Leak Database:* Breach v3.7 - SIMULATED

━━━━━━━━━━━━━━━━━━━━━
🕒 *Tempo di esecuzione:* ${speed}
`.trim();

    return conn.sendMessage(m.chat, {
        text: doxeo,
        mentions: [jid]
    }, { quoted: m });
};

handler.help = ['dox <nome>'];
handler.tags = ['fun'];
handler.command = /^dox$/i;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}