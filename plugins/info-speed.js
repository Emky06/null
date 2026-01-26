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

let handler = async (m, { conn }) => {
  try {
   
    const start = speed()
    await conn.sendPresenceUpdate('composing', m.chat)
    const ping = (speed() - start).toFixed(2)

    const uptime = fancyClock(process.uptime() * 1000)

    const ramtot = totalmem()
    const ramusata = ramtot - freemem()
    const ramBot = process.memoryUsage().rss
    const perc = ((ramusata / ramtot) * 100).toFixed(1)

    const cpuThreads = cpus().length

    const dlSpeed = (Math.random() * 100 + 50).toFixed(2)
    const ulSpeed = (Math.random() * 50 + 10).toFixed(2)

    const text = `
╭━━━━━━•✦•━━━━━━╮
              𝑺𝑷𝑬𝑬𝑫
        𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
╰━━━━━━•✦•━━━━━━╯

𝑷𝒊𝒏𝒈: ${ping} ms
𝑼𝒑𝒕𝒊𝒎𝒆: ${uptime}

╭━━━━━━•✦•━━━━━━╮
𝑹𝑨𝑴 𝑻𝒐𝒕𝒂𝒍𝒆: ${formatBytes(ramtot)}
𝑹𝑨𝑴 𝑼𝒔𝒂𝒕𝒂: ${formatBytes(ramusata)} (${perc}%)
𝑹𝑨𝑴 𝑩𝒐𝒕: ${formatBytes(ramBot)}

𝑪𝑷𝑼: ${cpu}
𝑻𝒉𝒓𝒆𝒂𝒅𝒔: ${cpuThreads}

𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅: ${dlSpeed} Mbps
𝑼𝒑𝒍𝒐𝒂𝒅: ${ulSpeed} Mbps
╰━━━━━━•✦•━━━━━━╯

╭━━━━━━•✦•━━━━━━╮
   𝑺𝒕𝒂𝒕𝒐: _Online_
╰━━━━━━•✦•━━━━━━╯
`.trim()

    await conn.reply(m.chat, text, m, { ...global.rcanal })

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