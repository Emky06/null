import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'
import NodeCache from 'node-cache'

const nameCache = new NodeCache({ stdTTL: 600 })
const groupCache = new NodeCache({ stdTTL: 300 })

const terminalImage = global.opts?.img ? require('terminal-image') : null
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
  if (!m) return

  const senderJid = conn.decodeJid(m.sender)
  const chatJid = conn.decodeJid(m.chat)
  const botJid = conn.decodeJid(conn.user?.jid)

  const getNameCached = async jid => {
    if (!jid) return ''
    let name = nameCache.get(jid)
    if (name) return name
    try {
      name = await conn.getName(jid)
    } catch {
      name = ''
    }
    nameCache.set(jid, name || '')
    return name || ''
  }

  const senderName = await getNameCached(senderJid)
  const chatName = await getNameCached(chatJid)
  const botName = conn.user?.name || 'Bot'

  const formatJid = (jid, name) => {
    if (!jid || typeof jid !== 'string') return 'Sconosciuto'
    const raw = jid.includes('@') ? jid.split('@')[0].split(':')[0] : jid
    try {
      const num = PhoneNumber('+' + raw).getNumber('international')
      return num + (name ? ` ~${name}` : '')
    } catch {
      return raw + (name ? ` ~${name}` : '')
    }
  }

  const sender = formatJid(senderJid, senderName)
  const me = formatJid(botJid, botName)

  const isGroup = chatJid?.endsWith('@g.us')
  const isOwner = Array.isArray(global.owner)
    ? global.owner.map(v => v[0]).includes(senderJid.split('@')[0])
    : global.owner === senderJid.split('@')[0]

  const isPremium = global.prems?.includes(senderJid) || false
  const isBanned = global.DATABASE?.data?.users?.[senderJid]?.banned || false

  let isAdmin = false
  let groupMeta

  if (isGroup) {
    groupMeta = groupCache.get(chatJid)
    if (!groupMeta) {
      try {
        groupMeta = await conn.groupMetadata(chatJid)
        if (groupMeta) groupCache.set(chatJid, groupMeta)
      } catch {}
    }
    isAdmin = groupMeta?.participants?.some(p => {
      const id = conn.decodeJid(p.id || p.jid)
      return id === senderJid && (p.admin === 'admin' || p.admin === 'superadmin')
    }) || false
  }

  const roles = []
  if (isOwner) roles.push(chalk.green('Owner'))
  if (isAdmin) roles.push(chalk.yellow('Admin'))
  if (isPremium) roles.push(chalk.magenta('Premium'))
  if (isBanned) roles.push(chalk.red('Banned'))

  const time = new Date().toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  let mtype = ''
  if (m.mtype) {
    mtype = m.mtype.replace(/Message$/i, '')
      .replace('audio', m.msg?.ptt ? 'PTT' : 'Audio')
      .replace(/^./, v => v.toUpperCase())
  } else if (m.message?.protocolMessage?.type === 0) {
    mtype = '🗑️ Messaggio eliminato'
  } else if (m.messageStubType === 29) {
    mtype = '🔼 Promozione admin'
  } else if (m.messageStubType === 30) {
    mtype = '🔽 Retrocessione admin'
  } else if (m.messageStubType === 27) {
    mtype = '👋 Utente entrato'
  } else if (m.messageStubType === 28) {
    mtype = '🚪 Utente uscito'
  } else if (m.messageStubType === 31 || m.message?.groupInviteMessage) {
    mtype = '📝 Richiesta ingresso gruppo'
  } else {
    mtype = 'Service'
  }

  const size =
    m.msg?.fileLength?.low ||
    m.msg?.fileLength ||
    m.text?.length ||
    m.caption?.length ||
    0

  console.log(
`╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 ${chalk.blueBright(me)}
┃ ⏰ ${chalk.cyan(time)}
┃ 👤 ${chalk.white(sender)} ${roles.length ? chalk.gray('(' + roles.join(' | ') + ')') : ''}
┃ 💬 ${chalk.blueBright(isGroup ? 'Gruppo:' : 'Chat:')} ${chalk.white(chatName || chatJid || 'Sconosciuta')}
┃ 📨 ${chalk.green(mtype)}${m.isCommand ? chalk.yellow(' • Cmd') : ''}${m.quoted ? chalk.gray(' • Reply') : ''}
${size ? `┃ 📦 ${chalk.cyan(formatSize(size))}` : ''}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
  )

  if (terminalImage && /image|sticker/i.test(m.mtype)) {
    try {
      const img = await terminalImage.buffer(await m.download())
      console.log(img.trimEnd())
    } catch {}
  }

  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    const mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```([\s\S]+?)```)(?=\S?(?:[\s\n]|$))/g
    const mdFormat = (d = 4) => (_, t, txt, mono) => {
      const map = { _: 'italic', '*': 'bold', '~': 'strikethrough' }
      const val = txt || mono
      return !map[t] || d < 1 ? val : chalk[map[t]](val.replace(mdRegex, mdFormat(d - 1)))
    }
    if (log.length < 4096) log = log.replace(urlRegex, u => chalk.blueBright(u))
    log = log.replace(mdRegex, mdFormat())
    if (m.mentionedJid) {
      for (const jid of m.mentionedJid) {
        const dj = conn.decodeJid(jid)
        const name = await getNameCached(dj)
        const num = dj.split('@')[0].split(':')[0]
        log = log.replace('@' + num, chalk.cyanBright('@' + num + (name ? ' ~' + name : '')))
      }
    }
    console.log(m.error ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
  }

  if (m.messageStubParameters) {
    const out = m.messageStubParameters.map(jid => {
      const d = conn.decodeJid(jid)
      return chalk.gray(formatJid(d, ''))
    }).join(', ')
    if (out) console.log(out)
  }

  if (/document/i.test(m.mtype)) console.log(`📄 ${m.msg?.fileName || 'Documento'}`)
  else if (/audio/i.test(m.mtype)) {
    const s = m.msg?.seconds || 0
    console.log(`🎵 ${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`)
  }

  console.log()
}

function formatSize(bytes) {
  if (!bytes) return ''
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(i ? 1 : 0) + ' ' + sizes[i]
}

watchFile(global.__filename(import.meta.url), () => {
  console.log(chalk.redBright("Update 'lib/print.js'"))
})