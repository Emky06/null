import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'
import { fileURLToPath } from 'url'
import { WAMessageStubType } from '@whiskeysockets/baileys'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })


const nameCache = new Map()
const CACHE_TTL = 300000

async function getCachedName(conn, jid) {
  if (!jid) return null
  const cached = nameCache.get(jid)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.name

  try {
    const name = await Promise.race([
      conn.getName(jid),
      new Promise(r => setTimeout(() => r(null), 100))
    ])
    nameCache.set(jid, { name, timestamp: Date.now() })
    return name
  } catch {
    return null
  }
}


export default async function (m, conn = { user: {} }) {
  try {

    let sender = m.key?.participant || m.sender
    sender = conn.decodeJid ? conn.decodeJid(sender) : sender

    if (/@lid/.test(sender) && m.key?.senderPn) sender = m.key.senderPn
    if (sender === conn.user?.jid) return

    const [senderName, chatName] = await Promise.all([
      getCachedName(conn, sender),
      getCachedName(conn, m.chat)
    ])

    const senderDisplay =
      PhoneNumber('+' + sender.replace('@s.whatsapp.net', '').replace('@lid', '')).getNumber('international') +
      (senderName ? ' ~' + senderName : '')

    const me =
      PhoneNumber('+' + (conn.user?.jid || '').replace('@s.whatsapp.net', '')).getNumber('international')

    const oraItaliana = new Date().toLocaleString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const filesize =
      m.msg?.fileLength?.low ||
      m.msg?.fileLength ||
      m.msg?.vcard?.length ||
      m.text?.length ||
      0

    const fileUnit =
      filesize === 0
        ? '0 B'
        : (filesize / 1000 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1) +
          ' ' +
          ['B', 'KB', 'MB', 'GB', 'TB'][Math.floor(Math.log(filesize) / Math.log(1000))]


    let img
    try {
      if (global.opts['img'] && /sticker|image/i.test(m.mtype)) {
        img = await terminalImage.buffer(await m.download())
      }
    } catch {}


    console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃🟢  ${chalk.black(chalk.bgBlueBright(me + ' ~' + conn.user.name))}
┃⏰  ${chalk.blueBright(oraItaliana)}
┃📑  ${chalk.blueBright(WAMessageStubType[m.messageStubType] || 'Messaggio')}
┃📊  ${chalk.blueBright(fileUnit)}
┃🗣  ${chalk.white(senderDisplay)}
┃🌐  ${chalk.blueBright(m.isGroup ? 'Gruppo: ' + chatName : 'Chat privata: ' + chatName)}
┃📝  ${chalk.blueBright(
      m.mtype
        ?.replace(/message$/i, '')
        .replace('audio', m.msg?.ptt ? 'PTT' : 'audio')
        .replace(/^./, v => v.toUpperCase())
    )}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim())

    if (img) console.log(img.trimEnd())


    if (typeof m.text === 'string' && m.text) {
      let text = m.text.replace(/\u200e+/g, '')

      if (text.length < 4096) {
        text = text.replace(urlRegex, url => chalk.blueBright(url))
      }

      if (m.mentionedJid?.length) {
        for (const jid of m.mentionedJid) {
          let rjid = conn.decodeJid ? conn.decodeJid(jid) : jid
          let name = await getCachedName(conn, rjid)
          const num = rjid.split('@')[0].replace(':', '')
          text = text.replace('@' + num, chalk.cyanBright('@' + num + (name ? ' ~' + name : '')))
        }
      }

      console.log(
        m.error
          ? chalk.red(text)
          : m.isCommand
          ? chalk.yellow(text)
          : chalk.white(text)
      )
    }


    if (m.messageStubParameters?.length) {
      const users = await Promise.all(
        m.messageStubParameters.map(async jid => {
          jid = conn.decodeJid ? conn.decodeJid(jid) : jid
          const name = await getCachedName(conn, jid)
          return chalk.gray(
            '+' + jid.replace('@s.whatsapp.net', '').replace('@lid', '') + (name ? ' ~' + name : '')
          )
        })
      )
      console.log(users.join(', '))
    }

    if (/document/i.test(m.mtype)) console.log(`📄 ${m.msg.fileName || 'Documento'}`)
    else if (/contact/i.test(m.mtype)) console.log(`📇 ${m.msg.displayName || 'Contatto'}`)
    else if (/audio/i.test(m.mtype)) {
      const d = m.msg.seconds || 0
      console.log(
        `${m.msg.ptt ? '🎤 (PTT' : '🎵 ('}AUDIO) ${String(Math.floor(d / 60)).padStart(2, 0)}:${String(d % 60).padStart(2, 0)}`
      )
    }

    console.log()
  } catch {}
}


const __filename = fileURLToPath(import.meta.url)
watchFile(__filename, () => {
  console.log(chalk.redBright("Aggiornamento 'lib/print.js'"))
})