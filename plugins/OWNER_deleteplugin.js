import { join } from 'path'
import { unlinkSync, readFileSync } from 'fs'

let handler = async (m, { conn, __dirname, args, text }) => {
  let ar = Object.keys(plugins)
  let ar1 = ar.map(v => v.replace('.js', ''))

  if (!text) throw `📌 *_Esempio uso:_*\n*#deleteplugin Menu-official*`
  if (!ar1.includes(args[0])) return m.reply(`*🗃️ non esiste questo plugin!*\n\n${ar1.map((v, i) => `${i + 1}. ${v}`).join('\n')}`)

  const file = join(__dirname, '../plugins/' + args[0] + '.js')
  unlinkSync(file)

  // Usa solo file locale
  const thumbnail = readFileSync('icone/delplugin.png')

  const prova = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: '𝐏𝐥𝐮𝐠𝐢𝐧 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨 ✓',
        jpegThumbnail: thumbnail,
        vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  conn.reply(m.chat, `_plugins/${args[0]}.js_`, prova, m)
}

handler.help = ['deleteplugin <nombre>']
handler.tags = ['owner']
handler.command = /^(deleteplugin|dp)$/i
handler.owner = true

export default handler