import { tmpdir } from 'os'
import path, { join } from 'path'
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  rmSync
} from 'fs'

let handler = async (m, { conn, __dirname }) => {

  conn.reply(m.chat, '𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨 ✓', m)

  const tmp = [tmpdir(), join(__dirname, '../tmp')]

  tmp.forEach(dirname => {
    if (!existsSync(dirname)) return

    readdirSync(dirname).forEach(file => {
      const fullPath = join(dirname, file)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        rmSync(fullPath, { recursive: true, force: true })
      } else {
        unlinkSync(fullPath)
      }
    })
  })
}

handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp|cleartemp)$/i
handler.rowner = true

export default handler