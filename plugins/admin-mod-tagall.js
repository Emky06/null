//Plugin fatto da Axtral_WiZaRd
import fs from 'fs/promises'

let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, groupMetadata }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
    }

    let pesan = args.join(' ') || '🚨 *𝐀𝐋𝐋𝐄𝐑𝐓𝐀!* 🚨'
    let oi = `📢 ${pesan}`

    let thumbnail
    try {
        thumbnail = await fs.readFile('icone/tagall.png')
    } catch {
        thumbnail = null
    }

    let prova = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: '⚡ 𝐍𝐎𝐍 𝐒𝐈 𝐃𝐎𝐑𝐌𝐄!!! ⚡',
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    }

    function getFlagByPrefix(number) {
        const mappings = {
            '39': ['🇮🇹', 'Italia'],
            '34': ['🇪🇸', 'Spagna'],
            '33': ['🇫🇷', 'Francia'],
            '49': ['🇩🇪', 'Germania'],
            '44': ['🇬🇧', 'Regno Unito'],
            '41': ['🇨🇭', 'Svizzera'],
            '31': ['🇳🇱', 'Paesi Bassi'],
            '32': ['🇧🇪', 'Belgio'],
            '1': ['🇺🇸', 'USA'],
            '52': ['🇲🇽', 'Messico'],
            '55': ['🇧🇷', 'Brasile'],
            '91': ['🇮🇳', 'India'],
            '81': ['🇯🇵', 'Giappone'],
            '63': ['🇵🇭', 'Filippine'],
            '27': ['🇿🇦', 'Sudafrica'],
            '856': ['🇱🇦', 'Laos'],
            '357': ['🇨🇾', 'Cipro'],
            '421': ['🇸🇰', 'Slovacchia'],
            '62': ['🇮🇩', 'Indonesia'],
            '66': ['🇹🇭', 'Thailandia'],
            '57': ['🇨🇴', 'Colombia'],
            '7': ['🇷🇺', 'Russia'],
            '212': ['🇲🇦', 'Marocco'],
            '213': ['🇩🇿', 'Algeria'],
            '216': ['🇹🇳', 'Tunisia'],
            '218': ['🇱🇾', 'Libia'],
            '20': ['🇪🇬', 'Egitto'],
            '221': ['🇸🇳', 'Senegal'],
            '234': ['🇳🇬', 'Nigeria'],
            '254': ['🇰🇪', 'Kenya'],
            '255': ['🇹🇿', 'Tanzania'],
            '256': ['🇺🇬', 'Uganda'],
            '260': ['🇿🇲', 'Zambia'],
            '263': ['🇿🇼', 'Zimbabwe'],
            '880': ['🇧🇩', 'Bangladesh'],
            '90': ['🇹🇷', 'Turchia'],
            '98': ['🇮🇷', 'Iran'],
            '964': ['🇮🇶', 'Iraq'],
            '966': ['🇸🇦', 'Arabia Saudita'],
            '971': ['🇦🇪', 'Emirati Arabi'],
            '972': ['🇮🇱', 'Israele'],
            '351': ['🇵🇹', 'Portogallo'],
            '353': ['🇮🇪', 'Irlanda'],
            '354': ['🇮🇸', 'Islanda'],
            '36': ['🇭🇺', 'Ungheria'],
            '37': ['🇪🇪', 'Estonia'],
            '380': ['🇺🇦', 'Ucraina'],
            '381': ['🇷🇸', 'Serbia'],
            '385': ['🇭🇷', 'Croazia'],
            '386': ['🇸🇮', 'Slovenia'],
            '420': ['🇨🇿', 'Repubblica Ceca'],
            '43': ['🇦🇹', 'Austria'],
            '45': ['🇩🇰', 'Danimarca'],
            '46': ['🇸🇪', 'Svezia'],
            '47': ['🇳🇴', 'Norvegia'],
            '48': ['🇵🇱', 'Polonia'],
            '61': ['🇦🇺', 'Australia'],
            '64': ['🇳🇿', 'Nuova Zelanda'],
            '65': ['🇸🇬', 'Singapore'],
            '84': ['🇻🇳', 'Vietnam'],
            '86': ['🇨🇳', 'Cina'],
            '82': ['🇰🇷', 'Corea del Sud'],
            '850': ['🇰🇵', 'Corea del Nord'],
            '94': ['🇱🇰', 'Sri Lanka'],
            '92': ['🇵🇰', 'Pakistan']
        }

        const prefixes = Object.keys(mappings).sort((a, b) => b.length - a.length)
        for (let p of prefixes) if (number.startsWith(p)) return mappings[p]
        return ['🏳️', 'Sconosciuto']
    }

    let flags = {}

    for (let mem of participants) {
        let jid = mem.jid || mem.id
        if (!jid || jid === conn.user.jid) continue

        let num = jid.split('@')[0]
        let [flag, name] = getFlagByPrefix(num)
        let key = `${flag} ${name}`

        if (!flags[key]) flags[key] = []
        flags[key].push(`➤ @${num}`)
    }

    let teks = `
╔════🔱 𝐓𝐀𝐆 𝐀𝐋𝐋 🔱════╗
🏠 𝐆𝐫𝐮𝐩𝐩𝐨: ${groupMetadata.subject || 'Nessun nome'}
👥 𝐌𝐞𝐦𝐛𝐫𝐢: ${participants.length}
💬 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨: ${oi}
╚═══════════════════╝

➤ 𝐌𝐄𝐍𝐓𝐈𝐎𝐍𝐒:
`.trim()

    for (let flagName of Object.keys(flags).sort()) {
        teks += `\n${flagName}:\n`
        teks += flags[flagName].join('\n') + '\n'
    }

    teks += `\n🚀 𝐁𝐘 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 ☄️`

    conn.sendMessage(m.chat, {
        text: teks,
        mentions: participants
            .map(p => p.jid || p.id)
            .filter(j => j && j !== conn.user.jid)
    }, { quoted: prova })
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^(tagall)$/i
handler.staff = true
handler.group = true

export default handler