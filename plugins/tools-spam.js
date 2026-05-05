// Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, args }) => {

    if (args.length < 2) {
        return m.reply(`Uso corretto: .spam <quantità> <testo>\nEsempio: .spam 5 ciao @utente`);
    }

    let times = parseInt(args[0]);
    if (isNaN(times) || times < 1) return m.reply("La quantità deve essere un numero valido maggiore di 0.");
    if (times > 50) times = 50;

    let text = args.slice(1).join(" ");
    
    let mention;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        mention = m.mentionedJid[0];
    } else if (m.quoted) {
        mention = m.quoted.sender;
    } else {
        mention = m.sender;
    }

    const mentions = [mention];
    const userId = mention.split('@')[0];
    
    let processedText = text.replace(`@${userId}`, `@${userId}`);

    for (let i = 0; i < times; i++) {
        await conn.sendMessage(
            m.chat, 
            { 
                text: `➠ ${processedText}`, 
                mentions: mentions 
            }, 
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