// savetext.js aggiornato
import fs from 'fs'

let handler = async (m, { conn, text, command }) => {
    if (!text) throw `📌 *Usa:* .${command} <nomefile>`
    if (!m.quoted) throw `⚠️ *Rispondi o tagga un messaggio di testo o un file .txt!*`

    let data = ''
    const mime = m.quoted.mimetype || ''

    if (m.quoted.text) {
        data = m.quoted.text
    } else if (/text\/plain/.test(mime)) {
        data = await (await m.quoted.download()).toString()
    } else {
        throw `❌ *Il messaggio taggato non è un file .txt né un testo semplice!*`
    }

    const pathFile = `./storage/${text}.txt`
    fs.writeFileSync(pathFile, data)

    // Usa solo file locale
    const thumbnail = fs.readFileSync('icone/saveditpl.png')

    const fakeMsg = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "H3LLO"
        },
        message: {
            locationMessage: {
                name: '📄 𝐓𝐞𝐱𝐭 𝐬𝐚𝐥𝐯𝐚𝐭𝐨 ✓',
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Bot;;;
FN:Bot
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Cell
END:VCARD`
            }
        }
    }

    await conn.reply(m.chat, `✅ *File salvato in:* ${pathFile}`, fakeMsg)
}

handler.help = ['savetext <nome>']
handler.tags = ['tools']
handler.command = ['savetext', 'salvatesto']
handler.rowner = true

export default handler