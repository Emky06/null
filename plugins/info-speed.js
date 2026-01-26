//Plugin fatto da Axtral_WiZaRd
import { totalmem, freemem, cpus } from 'os'
import process from 'process'
import speed from 'performance-now'

const formatBytes = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const cpu = cpus()[0].model
  .replace(/(TM|CPU|@.*?)|\(.*?\)/gi, '')
  .replace(/\s+/g, ' ')
  .trim()

let handler = async (m, { conn, usedPrefix }) => {
  try {
  
    const start = speed()
    await conn.readMessages([m.key])
    const ping = (speed() - start).toFixed(2)

    const uptime = fancyClock(process.uptime() * 1000)

    const ramtot = totalmem()
    const ramusata = ramtot - freemem()
    const ramBot = process.memoryUsage().rss
    const perc = ((ramusata / ramtot) * 100).toFixed(1)

   
    const cpuThreads = cpus().length

    const botStartTime = new Date(Date.now() - uptime)
    const activationTime = botStartTime.toLocaleString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    const message = `
╭━━━━━━•✦•━━━━━━╮
              𝑺𝑷𝑬𝑬𝑫
        𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
╰━━━━━━•✦•━━━━━━╯

𝑷𝒊𝒏𝒈: ${ping} ms
𝑼𝒑𝒕𝒊𝒎𝒆: ${uptime}
𝑨𝒗𝒗𝒊𝒐: ${activationTime}
╭━━━━━━•✦•━━━━━━╮
𝑹𝑨𝑴 𝑻𝒐𝒕𝒂𝒍𝒆: ${formatBytes(ramtot)}
𝑹𝑨𝑴 𝑼𝒔𝒂𝒕𝒂: ${formatBytes(ramusata)} (${perc}%)
𝑹𝑨𝑴 𝑩𝒐𝒕: ${formatBytes(ramBot)}

𝑪𝑷𝑼: ${cpu}
𝑻𝒉𝒓𝒆𝒂𝒅𝒔: ${cpuThreads}
╰━━━━━━•✦•━━━━━━╯
`.trim()

    await conn.sendMessage(m.chat, {
      text: message,
      footer: `𝐒𝐩𝐞𝐞𝐝 𝐓𝐞𝐬𝐭 ${nomebot}`,
      headerType: 1,
      buttons: [
        { buttonId: `${usedPrefix}speed`, buttonText: { displayText: "🔄 𝐒𝐩𝐞𝐞𝐝" }, type: 1 },
        { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "🏓 𝐏𝐢𝐧𝐠" }, type: 1 },
        { buttonId: `${usedPrefix}ds`, buttonText: { displayText: "🗑️ 𝐒𝐯𝐮𝐨𝐭𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐢" }, type: 1 },
      ]
    })

  } catch (e) {
    console.error(e)
  }
}

handler.help = ['speed']
handler.tags = ['info']
handler.command = ['speed', 'velocita', 'speedtest']

export default handler

function fancyClock(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return `${d}g ${h}h ${m}m ${s}s`
}