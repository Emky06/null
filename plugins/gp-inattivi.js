// Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, participants, command }) => {
    if (!m.isGroup) return

    let inattivi = []

    for (let p of participants) {
        let jid = p.jid
        let isAdmin = p.admin || p.isAdmin

        if (!jid) continue

        let user = global.db.data.users[jid]
        if (!user) continue

        if (
            typeof user.messaggi === 'number' &&
            user.messaggi >= 0 &&
            user.messaggi <= 10 &&
            !isAdmin &&
            user.whitelist !== true
        ) {
            inattivi.push({ id: jid, messaggi: user.messaggi })
        }
    }

    inattivi.sort((a, b) => b.messaggi - a.messaggi)

    if (!inattivi.length) {
        return conn.reply(m.chat, `> *𝐍𝐎 𝐈𝐍𝐀𝐓𝐓𝐈𝐕𝐈*`, m)
    }

    let numeroInattivi = inattivi.length
    let totaleMembri = participants.length

    let messaggioLista = inattivi
        .map(u => `┣➤ @${u.id.split('@')[0]} (${u.messaggi} msg)`)
        .join('\n')

    switch (command) {

        case "inattivi":
            return conn.sendMessage(m.chat, {
                text: `╭━━━━━━━━━━━━━━━━━━━╮
┃   😴 *𝐔𝐓𝐄𝐍𝐓𝐈 𝐈𝐍𝐀𝐓𝐓𝐈𝐕𝐈* 😴   ┃
╰━━━━━━━━━━━━━━━━━━━╯
> 📋 𝐓𝐨𝐭𝐚𝐥𝐞 𝐢𝐧𝐚𝐭𝐭𝐢𝐯𝐢: ${numeroInattivi} 𝐬𝐮 ${totaleMembri} 𝐦𝐞𝐦𝐛𝐫𝐢
╭━━━━━━━━━━━━━━━━━━━╮
┃          𝐓𝐫𝐚 𝟎 𝐞 𝟏𝟎 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢          ┃
┣━━━━━━━━━━━━━━━━━━━┫
${messaggioLista}
╰━━━━━━━━━━━━━━━━━━━╯`,
                mentions: inattivi.map(u => u.id)
            }, { quoted: m })

        case "viainattivi":
            await conn.sendMessage(m.chat, {
                text: `╭━━━━━━━━━━━━━━━━━━━╮
┃ 🚫 *𝐑𝐈𝐌𝐎𝐙𝐈𝐎𝐍𝐄 𝐈𝐍𝐀𝐓𝐓𝐈𝐕𝐈* 🚫
╰━━━━━━━━━━━━━━━━━━━╯
> 📋 *𝐓𝐨𝐭𝐚𝐥𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐢:* ${numeroInattivi} 𝐬𝐮 ${totaleMembri} 𝐦𝐞𝐦𝐛𝐫𝐢
╭━━━━━━━━━━━━━━━━━━━╮
${messaggioLista}
╰━━━━━━━━━━━━━━━━━━━╯`,
                mentions: inattivi.map(u => u.id)
            }, { quoted: m })

            await conn.groupParticipantsUpdate(
                m.chat,
                inattivi.map(u => u.id),
                'remove'
            )
            break
    }
}

handler.command = /^(inattivi|viainattivi)$/i
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler