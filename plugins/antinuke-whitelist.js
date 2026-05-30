//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const whitelistFile = './storage/file-json/autorizzati-antinuke.json'

const readWhitelist = () => {
  if (!fs.existsSync(whitelistFile)) return {}
  return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'))
}

const handler = async (m, { conn }) => {
  
  const whitelist = readWhitelist()
  const groupWhitelist = whitelist[m.chat]?.autorizzati || []

  if (!groupWhitelist.length) {
    return m.reply('⚠️ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐧𝐞𝐥𝐥𝐚 𝐰𝐡𝐢𝐭𝐞𝐥𝐢𝐬𝐭.')
  }

  let text = `📜 *𝐖𝐡𝐢𝐭𝐞𝐥𝐢𝐬𝐭 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨:*\n\n`

  groupWhitelist.forEach((jid, i) => {
    text += `${i + 1}. @${jid.split('@')[0]}\n`
  })

  return conn.sendMessage(
    m.chat,
    {
      text,
      mentions: groupWhitelist
    },
    { quoted: m }
  )
}

handler.command = ['whitelist']
handler.group = true
handler.admin = true

export default handler