import fs from 'fs/promises';

let handler = async (m, { conn, usedPrefix, command, args: [evento], text }) => {
    if (!evento) return await m.reply(
`ⓘ 𝐔𝐬𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:\n\n> ${usedPrefix + command} benvenuto @user\n> ${usedPrefix + command} addio @user\n> ${usedPrefix + command} promozione/p @user\n> ${usedPrefix + command} retrocessione/r @user\n> ${usedPrefix + command} rimozione @user`) 
    
    let mentions = text.replace(evento, '').trimStart()
    let who = mentions ? conn.parseMention(mentions) : []
    let part = who.length ? who : [m.sender]
    let act = false
    let testoEvento = ''

    switch (evento.toLowerCase()) {
        case 'add':
        case 'welcome':
        case 'benvenuto':       
            act = 'add'
            testoEvento = "𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨"
            break
        case 'bye':
        case 'leave':
        case 'addio':
            act = 'remove'
            testoEvento = "𝐚𝐝𝐝𝐢𝐨"
            break
        case 'promote':
        case 'promozione':
        case 'p':       
            act = 'promote'
            testoEvento = "𝐩𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞"
            break
        case 'demote':
        case 'retrocessione':
        case 'r':       
            act = 'demote'
            testoEvento = "𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞"
            break
        default:
            throw `ⓘ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧𝐚 𝐨𝐩𝐳𝐢𝐨𝐧𝐞 𝐯𝐚𝐥𝐢𝐝𝐚:\n\n> ${usedPrefix + command} benvenuto @user\n> ${usedPrefix + command} addio @user\n> ${usedPrefix + command} promozione/p @user\n> ${usedPrefix + command} retrocessione/r @user`
    }

    m.reply(`> ⚠️ 𝐒𝐢𝐦𝐮𝐥𝐚𝐳𝐢𝐨𝐧𝐞 ${testoEvento}...\n> ⓘ 𝐈𝐥 𝐛𝐨𝐭 𝐬𝐭𝐚 𝐬𝐢𝐦𝐮𝐥𝐚𝐧𝐝𝐨 𝐮𝐧 𝐞𝐯𝐞𝐧𝐭𝐨, 𝐬𝐞𝐧𝐳𝐚 𝐞𝐟𝐟𝐞𝐭𝐭𝐢 𝐜𝐨𝐧𝐜𝐫𝐞𝐭𝐢 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.`)

    if (act === 'add' || act === 'remove') {
        return conn.participantsUpdate({
            id: m.chat,
            participants: part,
            action: act
        })
    } else if (act === 'promote' || act === 'demote') {
        let profilePicture
        try {
            profilePicture = await conn.profilePictureUrl(part[0], 'image')
        } catch (e) {
            profilePicture = null
        }

        const fetchBuffer = async (url) => {
            const res = await fetch(url)
            return await res.arrayBuffer()
        }

        const getThumbnail = async () => {
            if (profilePicture) {
                try {
                    return Buffer.from(await fetchBuffer(profilePicture))
                } catch {
                    return await fs.readFile('icone/profilo.png')
                }
            } else {
                return await fs.readFile('icone/profilo.png')
            }
        }

        const actor = m.sender
        const user = part[0]
        const actorName = actor.split('@')[0]
        const userName = user.split('@')[0]

        const textMsg = act === 'promote'
            ? `@${actorName} 𝐡𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${userName}`
            : `@${actorName} 𝐡𝐚 𝐥𝐞𝐯𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${userName}`

        const title = act === 'promote'
            ? '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐩𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞 👑'
            : '𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 🙇🏻‍♂️'

        return conn.sendMessage(m.chat, {
            text: textMsg,
            contextInfo: {
                mentionedJid: [actor, user],
                externalAdReply: {
                    title,
                    thumbnail: await getThumbnail()
                }
            }
        }, { quoted: m })
    }
}

handler.help = ['simula <evento> [@mention]', 'sim <evento>']
handler.tags = ['owner']
handler.command = /^sim|simula$/i
handler.group = true
export default handler