//Plugin fatto da Axtral_WiZaRd

import moment from 'moment-timezone'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  let pluginsDir = path.join(process.cwd(), 'plugins')

  let files = fs.readdirSync(pluginsDir)
    .filter(file => !file.endsWith('.bak'))
    .map(file => {
      let filePath = path.join(pluginsDir, file)
      let stat = fs.statSync(filePath)
      return {
        name: file,
        mtime: stat.mtime,
        size: stat.size
      }
    })

  files.sort((a, b) => b.mtime - a.mtime)
  let last = files[0]

  let totalSize = files.reduce((acc, f) => acc + f.size, 0)

  let last3 = files.slice(0, 3).map(f => `  - ${f.name} (${moment(f.mtime).format('DD/MM/YY')})`).join('\n')

  let info = '╭━━━━━━━━━━━━━━━━━━━╮\n'
  info += `✧ 𝐔𝐥𝐭𝐢𝐦𝐨 𝐩𝐥𝐮𝐠𝐢𝐧 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐭𝐨\n`
  info += `• 𝐍𝐨𝐦𝐞 : ${last.name}\n`
  info += `• 𝐀𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐨 : ${moment(last.mtime).format('DD/MM/YY - HH:mm:ss')}\n`
  info += `• 𝐃𝐢𝐦𝐞𝐧𝐬𝐢𝐨𝐧𝐞 : ${(last.size / 1024).toFixed(2)} KB\n`
  info += '┣━━━━━━━━━━━━━━━━━━━\n'
  info += `📂 𝐏𝐥𝐮𝐠𝐢𝐧𝐬\n`
  info += `• 𝐓𝐨𝐭𝐚𝐥𝐞 𝐟𝐢𝐥𝐞 : ${files.length}\n`
  info += `• 𝐃𝐢𝐦𝐞𝐧𝐬𝐢𝐨𝐧𝐞 𝐜𝐚𝐫𝐭𝐞𝐥𝐥𝐚 : ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`
  info += `• 𝐔𝐥𝐭𝐢𝐦𝐢 𝟑 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐢 :\n${last3}\n`
  info += '╰━━━━━━━━━━━━━━━━━━━╯\n'

  const thumbnailPath = './icone/infopl.png'
  const thumbnail = fs.existsSync(thumbnailPath) ? fs.readFileSync(path.resolve(thumbnailPath)) : null

  await conn.sendMessage(m.chat, {
    text: info,
    contextInfo: thumbnail ? {
      externalAdReply: {
        title: `𝐈𝐧𝐟𝐨 𝐩𝐥𝐮𝐠𝐢𝐧𝐬`,
        body: `𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕`,
        thumbnail
      }
    } : undefined
  })
}

handler.help = ['infoscript', 'infopl']
handler.tags = ['scbot']
handler.command = /^(infoscript|infopl)$/i

export default handler