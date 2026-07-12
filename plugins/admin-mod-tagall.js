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
    '1': ['🇺🇸🇨🇦', 'USA e Canada'],
    '1-242': ['🇧🇸', 'Bahamas'],
    '1-246': ['🇧🇧', 'Barbados'],
    '1-264': ['🇦🇮', 'Anguilla'],
    '1-268': ['🇦🇬', 'Antigua e Barbuda'],
    '1-284': ['🇻🇬', 'Isole Vergini Britanniche'],
    '1-340': ['🇻🇮', 'Isole Vergini Americane'],
    '1-345': ['🇰🇾', 'Isole Cayman'],
    '1-441': ['🇧🇲', 'Bermuda'],
    '1-473': ['🇬🇩', 'Grenada'],
    '1-649': ['🇹🇨', 'Isole Turks e Caicos'],
    '1-664': ['🇲🇸', 'Montserrat'],
    '1-671': ['🇬🇺', 'Guam'],
    '1-684': ['🇦🇸', 'Samoa Americane'],
    '1-721': ['🇸🇽', 'Sint Maarten'],
    '1-758': ['🇱🇨', 'Santa Lucia'],
    '1-767': ['🇩🇲', 'Dominica'],
    '1-784': ['🇻🇨', 'Saint Vincent e Grenadine'],
    '1-787': ['🇵🇷', 'Porto Rico'],
    '1-809': ['🇩🇴', 'Repubblica Dominicana'],
    '1-829': ['🇩🇴', 'Repubblica Dominicana'],
    '1-849': ['🇩🇴', 'Repubblica Dominicana'],
    '1-868': ['🇹🇹', 'Trinidad e Tobago'],
    '1-869': ['🇰🇳', 'Saint Kitts e Nevis'],
    '1-876': ['🇯🇲', 'Giamaica'],
    '1-939': ['🇵🇷', 'Porto Rico'],
    '7': ['🇷🇺🇰🇿', 'Russia e Kazakhstan'],
    '20': ['🇪🇬', 'Egitto'],
    '27': ['🇿🇦', 'Sudafrica'],
    '30': ['🇬🇷', 'Grecia'],
    '31': ['🇳🇱', 'Paesi Bassi'],
    '32': ['🇧🇪', 'Belgio'],
    '33': ['🇫🇷', 'Francia'],
    '34': ['🇪🇸', 'Spagna'],
    '36': ['🇭🇺', 'Ungheria'],
    '39': ['🇮🇹', 'Italia'],
    '40': ['🇷🇴', 'Romania'],
    '41': ['🇨🇭', 'Svizzera'],
    '43': ['🇦🇹', 'Austria'],
    '44': ['🇬🇧', 'Regno Unito'],
    '45': ['🇩🇰', 'Danimarca'],
    '46': ['🇸🇪', 'Svezia'],
    '47': ['🇳🇴', 'Norvegia'],
    '48': ['🇵🇱', 'Polonia'],
    '49': ['🇩🇪', 'Germania'],
    '51': ['🇵🇪', 'Perù'],
    '52': ['🇲🇽', 'Messico'],
    '53': ['🇨🇺', 'Cuba'],
    '54': ['🇦🇷', 'Argentina'],
    '55': ['🇧🇷', 'Brasile'],
    '56': ['🇨🇱', 'Cile'],
    '57': ['🇨🇴', 'Colombia'],
    '58': ['🇻🇪', 'Venezuela'],
    '60': ['🇲🇾', 'Malesia'],
    '61': ['🇦🇺', 'Australia'],
    '62': ['🇮🇩', 'Indonesia'],
    '63': ['🇵🇭', 'Filippine'],
    '64': ['🇳🇿', 'Nuova Zelanda'],
    '65': ['🇸🇬', 'Singapore'],
    '66': ['🇹🇭', 'Thailandia'],
    '81': ['🇯🇵', 'Giappone'],
    '82': ['🇰🇷', 'Corea del Sud'],
    '84': ['🇻🇳', 'Vietnam'],
    '86': ['🇨🇳', 'Cina'],
    '90': ['🇹🇷', 'Turchia'],
    '91': ['🇮🇳', 'India'],
    '92': ['🇵🇰', 'Pakistan'],
    '93': ['🇦🇫', 'Afghanistan'],
    '94': ['🇱🇰', 'Sri Lanka'],
    '95': ['🇲🇲', 'Myanmar'],
    '98': ['🇮🇷', 'Iran'],
    '211': ['🇸🇸', 'Sudan del Sud'],
    '212': ['🇲🇦', 'Marocco'],
    '213': ['🇩🇿', 'Algeria'],
    '216': ['🇹🇳', 'Tunisia'],
    '218': ['🇱🇾', 'Libia'],
    '220': ['🇬🇲', 'Gambia'],
    '221': ['🇸🇳', 'Senegal'],
    '222': ['🇲🇷', 'Mauritania'],
    '223': ['🇲🇱', 'Mali'],
    '224': ['🇬🇳', 'Guinea'],
    '225': ['🇨🇮', "Costa d'Avorio"],
    '226': ['🇧🇫', 'Burkina Faso'],
    '227': ['🇳🇪', 'Niger'],
    '228': ['🇹🇬', 'Togo'],
    '229': ['🇧🇯', 'Benin'],
    '230': ['🇲🇺', 'Mauritius'],
    '231': ['🇱🇷', 'Liberia'],
    '232': ['🇸🇱', 'Sierra Leone'],
    '233': ['🇬🇭', 'Ghana'],
    '234': ['🇳🇬', 'Nigeria'],
    '235': ['🇹🇩', 'Ciad'],
    '236': ['🇨🇫', 'Repubblica Centrafricana'],
    '237': ['🇨🇲', 'Camerun'],
    '238': ['🇨🇻', 'Capo Verde'],
    '239': ['🇸🇹', 'São Tomé e Príncipe'],
    '240': ['🇬🇶', 'Guinea Equatoriale'],
    '241': ['🇬🇦', 'Gabon'],
    '242': ['🇨🇬', 'Repubblica del Congo'],
    '243': ['🇨🇩', 'Repubblica Democratica del Congo'],
    '244': ['🇦🇴', 'Angola'],
    '245': ['🇬🇼', 'Guinea-Bissau'],
    '246': ['🇮🇴', 'Territorio Britannico Oceano Indiano'],
    '247': ['🇦🇨', 'Ascensione'],
    '248': ['🇸🇨', 'Seychelles'],
    '249': ['🇸🇩', 'Sudan'],
    '250': ['🇷🇼', 'Ruanda'],
    '251': ['🇪🇹', 'Etiopia'],
    '252': ['🇸🇴', 'Somalia'],
    '253': ['🇩🇯', 'Gibuti'],
    '254': ['🇰🇪', 'Kenya'],
    '255': ['🇹🇿', 'Tanzania'],
    '256': ['🇺🇬', 'Uganda'],
    '257': ['🇧🇮', 'Burundi'],
    '258': ['🇲🇿', 'Mozambico'],
    '260': ['🇿🇲', 'Zambia'],
    '261': ['🇲🇬', 'Madagascar'],
    '262': ['🇷🇪', 'Réunion'],
    '263': ['🇿🇼', 'Zimbabwe'],
    '264': ['🇳🇦', 'Namibia'],
    '265': ['🇲🇼', 'Malawi'],
    '266': ['🇱🇸', 'Lesotho'],
    '267': ['🇧🇼', 'Botswana'],
    '268': ['🇸🇿', 'Swaziland'],
    '269': ['🇰🇲', 'Comore'],
    '290': ['🇸🇭', "Sant'Elena"],
    '291': ['🇪🇷', 'Eritrea'],
    '297': ['🇦🇼', 'Aruba'],
    '298': ['🇫🇴', 'Isole Fær Øer'],
    '299': ['🇬🇱', 'Groenlandia'],
    '350': ['🇬🇮', 'Gibilterra'],
    '351': ['🇵🇹', 'Portogallo'],
    '352': ['🇱🇺', 'Lussemburgo'],
    '353': ['🇮🇪', 'Irlanda'],
    '354': ['🇮🇸', 'Islanda'],
    '355': ['🇦🇱', 'Albania'],
    '356': ['🇲🇹', 'Malta'],
    '357': ['🇨🇾', 'Cipro'],
    '358': ['🇫🇮', 'Finlandia'],
    '359': ['🇧🇬', 'Bulgaria'],
    '370': ['🇱🇹', 'Lituania'],
    '371': ['🇱🇻', 'Lettonia'],
    '372': ['🇪🇪', 'Estonia'],
    '373': ['🇲🇩', 'Moldavia'],
    '374': ['🇦🇲', 'Armenia'],
    '375': ['🇧🇾', 'Bielorussia'],
    '376': ['🇦🇩', 'Andorra'],
    '377': ['🇲🇨', 'Monaco'],
    '378': ['🇸🇲', 'San Marino'],
    '379': ['🇻🇦', 'Città del Vaticano'],
    '380': ['🇺🇦', 'Ucraina'],
    '381': ['🇷🇸', 'Serbia'],
    '382': ['🇲🇪', 'Montenegro'],
    '383': ['🇽🇰', 'Kosovo'],
    '385': ['🇭🇷', 'Croazia'],
    '386': ['🇸🇮', 'Slovenia'],
    '387': ['🇧🇦', 'Bosnia ed Erzegovina'],
    '389': ['🇲🇰', 'Macedonia del Nord'],
    '420': ['🇨🇿', 'Repubblica Ceca'],
    '421': ['🇸🇰', 'Slovacchia'],
    '423': ['🇱🇮', 'Liechtenstein'],
    '500': ['🇫🇰', 'Isole Falkland'],
    '501': ['🇧🇿', 'Belize'],
    '502': ['🇬🇹', 'Guatemala'],
    '503': ['🇸🇻', 'El Salvador'],
    '504': ['🇭🇳', 'Honduras'],
    '505': ['🇳🇮', 'Nicaragua'],
    '506': ['🇨🇷', 'Costa Rica'],
    '507': ['🇵🇦', 'Panama'],
    '508': ['🇵🇲', 'Saint-Pierre e Miquelon'],
    '509': ['🇭🇹', 'Haiti'],
    '590': ['🇬🇵', 'Guadalupa'],
    '591': ['🇧🇴', 'Bolivia'],
    '592': ['🇬🇾', 'Guyana'],
    '593': ['🇪🇨', 'Ecuador'],
    '594': ['🇬🇫', 'Guyana Francese'],
    '595': ['🇵🇾', 'Paraguay'],
    '596': ['🇲🇶', 'Martinica'],
    '597': ['🇸🇷', 'Suriname'],
    '598': ['🇺🇾', 'Uruguay'],
    '599': ['🇧🇶', 'Caraibi Olandesi'],
    '670': ['🇹🇱', 'Timor Est'],
    '672': ['🇦🇶', 'Antartide'],
    '673': ['🇧🇳', 'Brunei'],
    '674': ['🇳🇷', 'Nauru'],
    '675': ['🇵🇬', 'Papua Nuova Guinea'],
    '676': ['🇹🇴', 'Tonga'],
    '677': ['🇸🇧', 'Isole Salomone'],
    '678': ['🇻🇺', 'Vanuatu'],
    '679': ['🇫🇯', 'Figi'],
    '680': ['🇵🇼', 'Palau'],
    '681': ['🇼🇫', 'Wallis e Futuna'],
    '682': ['🇨🇰', 'Isole Cook'],
    '683': ['🇳🇺', 'Niue'],
    '685': ['🇼🇸', 'Samoa'],
    '686': ['🇰🇮', 'Kiribati'],
    '687': ['🇳🇨', 'Nuova Caledonia'],
    '688': ['🇹🇻', 'Tuvalu'],
    '689': ['🇵🇫', 'Polinesia Francese'],
    '690': ['🇹🇰', 'Tokelau'],
    '691': ['🇫🇲', 'Micronesia'],
    '692': ['🇲🇭', 'Isole Marshall'],
    '850': ['🇰🇵', 'Corea del Nord'],
    '852': ['🇭🇰', 'Hong Kong'],
    '853': ['🇲🇴', 'Macao'],
    '855': ['🇰🇭', 'Cambogia'],
    '856': ['🇱🇦', 'Laos'],
    '880': ['🇧🇩', 'Bangladesh'],
    '886': ['🇹🇼', 'Taiwan'],
    '960': ['🇲🇻', 'Maldive'],
    '961': ['🇱🇧', 'Libano'],
    '962': ['🇯🇴', 'Giordania'],
    '963': ['🇸🇾', 'Siria'],
    '964': ['🇮🇶', 'Iraq'],
    '965': ['🇰🇼', 'Kuwait'],
    '966': ['🇸🇦', 'Arabia Saudita'],
    '967': ['🇾🇪', 'Yemen'],
    '968': ['🇴🇲', 'Oman'],
    '970': ['🇵🇸', 'Palestina'],
    '971': ['🇦🇪', 'Emirati Arabi'],
    '972': ['🇮🇱', 'Israele'],
    '973': ['🇧🇭', 'Bahrein'],
    '974': ['🇶🇦', 'Qatar'],
    '975': ['🇧🇹', 'Bhutan'],
    '976': ['🇲🇳', 'Mongolia'],
    '977': ['🇳🇵', 'Nepal'],
    '992': ['🇹🇯', 'Tagikistan'],
    '993': ['🇹🇲', 'Turkmenistan'],
    '994': ['🇦🇿', 'Azerbaigian'],
    '995': ['🇬🇪', 'Georgia'],
    '996': ['🇰🇬', 'Kirghizistan'],
    '998': ['🇺🇿', 'Uzbekistan']
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