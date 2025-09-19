import fs from 'fs';
let handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) throw `uhm.. che nome do al plugin?`;
    if (!m.quoted.text) throw `Rispondi al msg!`;
    let path = `plugins/${text}.js`;
    await fs.writeFileSync(path, m.quoted.text);

    let prova = { 
        key: {
            participants: "0@s.whatsapp.net", 
            fromMe: false, 
            id: "Halo"
        }, 
        message: { 
            locationMessage: { 
                name: '𝐏𝐥𝐮𝐠𝐢𝐧 𝐬𝐚𝐥𝐯𝐚𝐭𝐨 ✓',
                jpegThumbnail: fs.readFileSync('./icone/saveditpl.png'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }, 
        participant: "0@s.whatsapp.net"
    };

    conn.reply(m.chat, `${path}`, prova);
};

handler.help = ['saveplugin'].map(v => v + ' <nome>');
handler.tags = ['owner'];
handler.command = ["sp", "saveplugin"];
handler.rowner = true;

export default handler;