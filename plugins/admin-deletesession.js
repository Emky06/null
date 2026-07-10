//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, usedPrefix }) => {

    const buttons = [
        {
            buttonId: `${usedPrefix}ds`,
            buttonText: { displayText: "🔄 𝐒𝐯𝐮𝐨𝐭𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢" },
            type: 1
        },
        {
            buttonId: `${usedPrefix}ping`,
            buttonText: { displayText: "⚡ 𝐏𝐢𝐧𝐠" },
            type: 1
        },
        {
            buttonId: `${usedPrefix}pong`,
            buttonText: { displayText: "🏓 𝐏𝐨𝐧𝐠" },
            type: 1
        },
        {
            buttonId: `${usedPrefix}speed`,
            buttonText: { displayText: "📊 𝐒𝐩𝐞𝐞𝐝" },
            type: 1
        }
    ]


    const quotedMessage = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: `${nomebot}`,
                jpegThumbnail: fs.readFileSync(path.join('icone', 'spunta.png')),
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Bot;;;
FN:Bot
ORG:Bot
TITLE:
item1.TEL;waid=11111111111:+1 (111) 111-1111
item1.X-ABLabel:Bot
X-WA-BIZ-NAME:Bot
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    }


    const sessionDir = './Sessioni'


    if (!fs.existsSync(sessionDir)) {

        return await conn.sendMessage(m.chat, {
            text: "*❌ 𝐋𝐚 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐞̀ 𝐯𝐮𝐨𝐭𝐚 𝐨 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞.*",
            buttons,
            headerType: 1
        }, { quoted: quotedMessage })

    }


    try {

        const files = fs.readdirSync(sessionDir)

        const updates = {}

        let deletedCount = 0


        for (const file of files) {

            if (file === "creds.json") continue


            let category = null
            let id = null


            if (file.startsWith('sender-key-')) {

                category = 'sender-key'
                id = file
                    .substring('sender-key-'.length)
                    .replace('.json', '')

            } else if (file.startsWith('session-')) {

                category = 'session'
                id = file
                    .substring('session-'.length)
                    .replace('.json', '')

            } else if (file.startsWith('pre-key-')) {

                category = 'pre-key'
                id = file
                    .substring('pre-key-'.length)
                    .replace('.json', '')

            } else if (file.startsWith('app-state-sync-key-')) {

                category = 'app-state-sync-key'
                id = file
                    .substring('app-state-sync-key-'.length)
                    .replace('.json', '')

            }


            if (category && id) {

                if (!updates[category]) {
                    updates[category] = {}
                }

                updates[category][id] = null
                deletedCount++

            }
        }


        if (deletedCount === 0) {

            return await conn.sendMessage(m.chat, {
                text: "ⓘ 𝐋𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢 𝐬𝐨𝐧𝐨 𝐯𝐮𝐨𝐭𝐞, 𝐫𝐢𝐩𝐫𝐨𝐯𝐚 𝐭𝐫𝐚 𝐩𝐨𝐜𝐨‼️",
                buttons,
                headerType: 1
            }, { quoted: quotedMessage })

        }


        await conn.authState.keys.set(updates)


        await conn.sendMessage(m.chat, {
            text: `🗑️ 𝐒𝐨𝐧𝐨 𝐬𝐭𝐚𝐭𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 ${deletedCount} 𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐝𝐞𝐥𝐥𝐞 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢! 𝐆𝐫𝐚𝐳𝐢𝐞 𝐩𝐞𝐫 𝐚𝐯𝐞𝐫𝐦𝐢 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐨 😏`,
            buttons,
            headerType: 1
        }, { quoted: quotedMessage })


    } catch (error) {

        console.error(error)

        await conn.sendMessage(m.chat, {
            text: "❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐳𝐢𝐨𝐧𝐞!",
            buttons,
            headerType: 1
        }, { quoted: quotedMessage })

    }
}

handler.command = /^(ds|diosbura)$/i
handler.admin = true

export default handler