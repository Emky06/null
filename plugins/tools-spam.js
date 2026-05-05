const handler = async (m, { conn, args }) => {

    if (args.length < 2) {
        return m.reply(`Uso corretto: .spam <quantità> <testo>\nEsempio: .spam 5 ciao @utente`);
    }

    let times = parseInt(args[0]);
    if (isNaN(times) || times < 1) return m.reply("La quantità deve essere un numero valido maggiore di 0.");
    if (times > 50) times = 50;

    let text = args.slice(1).join(" ");
    
    let groupMetadata = await conn.groupMetadata(m.chat);
    let processedText = text;
    let mentions = [];
    
    for (let mention of m.mentionedJid) {
        let participant = groupMetadata.participants.find(p => p.id === mention);
        if (participant) {
            let pushname = participant.pushname || participant.id.split('@')[0];
            processedText = processedText.replace(new RegExp(`@${participant.id.split('@')[0]}`, 'g'), `@${pushname}`);
            processedText = processedText.replace(new RegExp(`@\\+?${participant.id.split('@')[0].replace(/\+/g, '\\+')}`, 'g'), `@${pushname}`);
            mentions.push(mention);
        } else {
            mentions.push(mention);
        }
    }

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