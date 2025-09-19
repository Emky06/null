// Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, args }) => {

    if (args.length < 2) {
        return m.reply(`Uso corretto: .spam <quantità> <testo>\nEsempio: .spam 5 ciao`);
    }

    let times = parseInt(args[0]);
    if (isNaN(times) || times < 1) return m.reply("La quantità deve essere un numero valido maggiore di 0.");
    if (times > 50) times = 50;

    let text = args.slice(1).join(" ");

    let mentions = [];
    let textWithMentions = text.replace(/@(\d{6,15})/g, (_, number) => {
        let jid = number + "@s.whatsapp.net";
        mentions.push(jid);
        return `@${number}`;
    });

    for (let i = 0; i < times; i++) {
        await conn.sendMessage(
            m.chat, 
            { text: `➠ ${textWithMentions}`, mentions }, 
            { quoted: m }
        );
    }
};

handler.help = ['spam <quantità> <testo>'];
handler.tags = ['fun'];
handler.command = /^spam$/i;
handler.group = true;
handler.admin = true;

export default handler;