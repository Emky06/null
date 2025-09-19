const handler = async (m, { conn, args }) => {
    const metadata = await conn.groupMetadata(m.chat);
    const groupName = metadata.subject;

    const interactiveButtons = [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "Copia",
                id: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat),
                copy_code: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)
            })
        }
    ];

    const interactiveMessage = {
        text: `*${groupName}*`,
        title: "Eccoti il link del gruppo:",
        footer: "Premi il pulsante qui sotto per copiare il link.",
        interactiveButtons
    };

    await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
};

handler.help = ['linkgroup'];
handler.tags = ['group'];
handler.command = /^linkg(gro?up)?$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;