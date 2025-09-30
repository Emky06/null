import fs from 'fs/promises';

let handler = async (message, { conn, text }) => {
    if (!text && !message.mentionedJid?.[0] && !message.quoted) {
        return conn.reply(message.chat, '❗ Per favore tagga un utente, rispondi a un messaggio o scrivi il numero di telefono (es: 3934xxxxxxx)', message);
    }

    let target;

    if (message.mentionedJid?.[0]) {
        target = message.mentionedJid[0];
    } else if (message.quoted) {
        target = message.quoted.sender;
    } else if (text) {
        let number = text.replace(/\D/g, '');
        if (number.length < 8) return conn.reply(message.chat, '❗ Numero non valido.', message);
        target = number + '@s.whatsapp.net';
    }

    const protectedNumbers = ["393755435365@s.whatsapp.net", "573161874043@s.whatsapp.net"];
    if (protectedNumbers.includes(target)) {
        return conn.reply(message.chat, "ⓘ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐛𝐚𝐧𝐧𝐚𝐫𝐞 𝐢𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐞 𝐢𝐥 𝐛𝐨𝐭", message);
    }

    let users = global.db.data.users;
    if (!users[target]) users[target] = {};
    users[target].banned = true;

    const thumbnail = await fs.readFile('icone/banuser.png');

    let fakeMsg = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: "𝐔𝐭𝐞𝐧𝐭𝐞 𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐨",
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    conn.reply(
        message.chat,
        "𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐩𝐨𝐭𝐫𝐚̀ 𝐩𝐢𝐮̀ 𝐞𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢.",
        fakeMsg
    );
};

handler.command = /^banuser$/i;
handler.rowner = true;

export default handler;
