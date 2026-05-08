//Plugin fatto da Axtral_WiZaRd
import { performance } from 'perf_hooks';

let handler = async (m, { conn }) => {

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

    await m.reply(`🔍 *Progresso:* ${pickRandom(['12','21','35','44'])}%`);
    await m.reply(`🔍 *Progresso:* ${pickRandom(['58','67','73','81'])}%`);
    await m.reply(`🔍 *Progresso:* ${pickRandom(['88','92','96','100'])}%`);

    let old = performance.now();
    let neww = performance.now();
    let speed = `${(neww - old).toFixed(2)} ms`;

    const devices = [
        {
            brand: "Xiaomi",
            models: ["Xiaomi 14 Ultra", "Redmi Note 13", "Poco F6"],
            os: "HyperOS"
        },
        {
            brand: "Samsung",
            models: ["Galaxy S24", "Galaxy A55", "Z Fold 5"],
            os: "One UI 6 (Android 14)"
        },
        {
            brand: "Apple",
            models: ["iPhone 15 Pro", "iPhone 14", "iPhone SE 2022"],
            os: "iOS 17"
        },
        {
            brand: "Huawei",
            models: ["P60 Pro", "Mate 50", "Nova 11"],
            os: "HarmonyOS"
        },
        {
            brand: "OnePlus",
            models: ["OnePlus 12", "OnePlus 11", "Nord 3"],
            os: "OxygenOS"
        }
    ];

    const device = pickRandom(devices);
    const model = pickRandom(device.models);

    let doxeo = `
*✔️ DOX COMPLETATO CON SUCCESSO*
━━━━━━━━━━━━━━━━━━━━━
👤 *Persona doxata:* ${target}

📱 *Device:* ${device.brand} ${model}
💻 *Sistema:* ${device.os}

🌐 *IP Pubblico:* ${pickRandom([
        '92.28.211.234',
        '140.216.58.100',
        '80.139.134.15',
        '88.53.127.8',
        '176.45.22.91'
])}

🛰️ *IP Locale:* ${pickRandom([
        '192.168.1.1',
        '10.0.0.254',
        '172.16.0.2'
])}

🌍 *Geo:* ${pickRandom([
        'Milano, Italia',
        'Roma, Italia',
        'Napoli, Italia',
        'Bari, Italia',
        'Torino, Italia'
])}

📶 *ISP:* ${pickRandom([
        'Vodafone',
        'TIM',
        'WINDTRE',
        'Iliad',
        'Fastweb'
])}

📡 *DNS:* ${pickRandom([
        '8.8.8.8',
        '1.1.1.1',
        '9.9.9.9'
])}

🖥️ *MAC:* ${pickRandom([
        '4A:93:23:18:BA:7F',
        'F0:1A:30:3B:EA:D1',
        'C8:3D:97:11:FA:22'
])}

━━━━━━━━━━━━━━━━━━━━━
🕒 *Tempo:* ${speed}
`.trim();

    return conn.sendMessage(m.chat, {
        text: doxeo,
        mentions: [jid]
    }, { quoted: m });
};

handler.command = /^dox$/i;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}