// Codice di spamm.js

const handler = async (m, { conn }) => {
    const interactiveButtons = [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "Copia",
                id: 'https://chat.whatsapp.com/DcyVYf6zgvVI52uuAXz4Nq?mode=ems_copy_t',
                copy_code: 'https://chat.whatsapp.com/DcyVYf6zgvVI52uuAXz4Nq?mode=ems_copy_t'
            })
        }
    ];

    const interactiveMessage = {
        text: `Ecco il link del gruppo:`,
        title: "Copia il link qui sotto",
        footer: "Tocca il pulsante per copiarlo",
        interactiveButtons
    };

    for (let i = 0; i < 10; i++) {
        await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
    }
};

handler.help = ['spamm'];
handler.tags = ['group'];
handler.command = /^spamm$/i;
handler.group = true;
handler.rowner = true;

export default handler;