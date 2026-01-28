// Plugin fatto da Axtral_WiZaRd
import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

// Canali permessi
let allowedChannels = [
    'https://whatsapp.com/channel/0029VbAS02hBadmeRQCfCu2R',
]

let warnLinks = [
    { name: '𝐆𝐑𝐔𝐏𝐏𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏', regex: /chat.whatsapp.com\/[0-9A-Za-z]{20,24}/i },
    { name: '𝐂𝐀𝐍𝐀𝐋𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏', regex: /(?:www.)?whatsapp.com\/channel\/[0-9A-Za-z]+/i },
    { name: '𝐒𝐇𝐎𝐑𝐓-𝐋𝐈𝐍𝐊', regex: /(?:https?:\/\/)?(?:www.)?short-link.me\/[^\s]+/i },
    { name: '𝐏𝐎𝐑𝐍𝐇𝐔𝐁', regex: /(?:https?:\/\/)?(?:www.)?(pornhub.com)/i },
    { name: '𝐎𝐍𝐋𝐘𝐅𝐀𝐍𝐒', regex: /(?:https?:\/\/)?(?:www.)?(onlyfans.com)/i },

    { name: '𝐈𝐌𝐌𝐀𝐆𝐈𝐍𝐄', regex: /(?:https?:\/\/)?(?:www\.)?(imgur\.com|i\.imgur\.com|imgbb\.com|ibb\.co|postimg\.cc|prnt\.sc)\/[^\s]+/i },
]

const linkRegex = /\bchat[\s.\u200B\u200C\u200D\uFEFF]*whatsapp[\s.\u200B\u200C\u200D\uFEFF]*com\/([0-9A-Za-z]{20,24})/i
const channelRegex = /\bwhatsapp[\s.\u200B\u200C\u200D\uFEFF]*com\/channel\/([0-9A-Za-z]{20,24})/i

const imagePath = './icone/link.png'
const thumbnail = fs.readFileSync(imagePath)

function normalizeText(text) {
    return text
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF\u2060-\u206F\u00AD\u034F\u180E\u17B4\u17B5]/g, '')
        .replace(/\s+/g, '')
}

function extractText(msg) {
    if (!msg.message) return ''
    let result = ''
    function recurse(obj, parentKey = '') {
        if (!obj) return
        if (typeof obj === 'string') {
            result += obj + ' '
        } else if (typeof obj === 'object') {
            for (let key in obj) {
                if (key === 'quotedMessage') continue 
                recurse(obj[key], key)
            }
        }
    }
    recurse(msg.message)
    return result
}

async function getMediaBuffer(message) {
  try {
    const msg =
      message.message?.imageMessage ||
      message.message?.videoMessage

    if (!msg) return null
    const type = msg.mimetype?.startsWith('video') ? 'video' : 'image'
    const stream = await downloadContentFromMessage(msg, type)

    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
  } catch (e) {
    console.error('Errore nel download media:', e)
    return null
  }
}

async function readQRCode(imageBuffer) {
    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const formData = new FormData()
        formData.append('file', imageBuffer, 'image.jpg')

        const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        })

        clearTimeout(timeout)
        const data = await response.json()
        return data?.[0]?.symbol?.[0]?.data || null
    } catch (e) {
        console.error('Errore lettura QR:', e)
        return null
    }
}

export async function before(msg, { isAdmin, isBotAdmin, isPrems, conn }) {
    if (msg.isBaileys || msg.fromMe) return true
    if (!msg.isGroup) return false

    let chatData = global.db.data.chats[msg.chat]
    let sender = msg.key.participant
    let messageId = msg.key.id
    let botSettings = global.db.data.settings[this.user.jid] || {}

    if (!chatData.antilink) return true

    let rawText = extractText(msg)
    let cleanedText = normalizeText(rawText)

    for (let site of warnLinks) {
        if (site.regex.test(cleanedText)) {
            if (isAdmin || isPrems || !isBotAdmin || !botSettings.restrict) return true

            if (site.name === '𝐆𝐑𝐔𝐏𝐏𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏') {
                const groupLink = 'https://chat.whatsapp.com/' + (await conn.groupInviteCode(msg.chat))
                if (cleanedText.includes(normalizeText(groupLink))) return true
            }

            if (
                site.name === '𝐂𝐀𝐍𝐀𝐋𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏' &&
                allowedChannels.some(link => cleanedText.includes(normalizeText(link)))
            ) {
                return true
            }

            const violation =
    site.name === '𝐈𝐌𝐌𝐀𝐆𝐈𝐍𝐄'
        ? '𝐋𝐈𝐍𝐊 𝐈𝐌𝐌𝐀𝐆𝐈𝐍𝐄\n𝐏𝐎𝐒𝐒𝐈𝐁𝐈𝐋𝐄 𝐐𝐑 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏'
        : `𝐋𝐈𝐍𝐊 𝐃𝐈 ${site.name} 𝐍𝐎𝐍 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐎`

           
            if (
                site.name === '𝐆𝐑𝐔𝐏𝐏𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏' ||
                site.name === '𝐂𝐀𝐍𝐀𝐋𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏' ||
                site.name === '𝐒𝐇𝐎𝐑𝐓-𝐋𝐈𝐍𝐊'
            ) {
                await handleKick({ conn, msg, sender, messageId, violation })
                return false
            }

            await handleWarn({ conn, msg, sender, messageId, violation })
            return false
        }
    }

    const media = await getMediaBuffer(msg)
    if (media) {
        const qrData = await readQRCode(media)
        const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? ''

        if (qrData && (linkRegex.test(qrText) || channelRegex.test(qrText))) {
            if (isAdmin || isPrems || !isBotAdmin || !botSettings.restrict) return true

           
            await handleKick({
                conn,
                msg,
                sender,
                messageId,
                violation: '𝐐𝐑 𝐂𝐎𝐍 𝐋𝐈𝐍𝐊 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐍𝐎𝐍 𝐂𝐎𝐍𝐒𝐄𝐍𝐓𝐈𝐓𝐎'
            })
            return false
        }
    }

    return true
}

async function handleWarn({ conn, msg, sender, messageId, violation }) {
    const vcardMessage = {
        key: {
            participants: '0@s.whatsapp.net',
            fromMe: false,
            id: 'vcardlink1'
        },
        message: {
            locationMessage: {
                name: '⚠️ 𝐀𝐧𝐭𝐢-𝐋𝐢𝐧𝐤 𝐚𝐭𝐭𝐢𝐯𝐨 ⚠️',
                jpegThumbnail: thumbnail,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;AntiLink;;;
FN:AntiLink
ORG:AntiLink System
TITLE:
item1.TEL;waid=10000000000:+1 000 000 0000
item1.X-ABLabel:AntiLink Bot
X-WA-BIZ-DESCRIPTION:Protezione automatica da link non autorizzati
X-WA-BIZ-NAME:AntiLink
END:VCARD`
            }
        },
        participant: '0@s.whatsapp.net'
    }

    let user = global.db.data.users[msg.sender]
    user.warn = (user.warn || 0) + 1
    user.warnReasons = user.warnReasons || []
    user.warnReasons.push(`Violazione: ${violation}`)

    await conn.sendMessage(msg.chat, {
        delete: {
            remoteJid: msg.chat,
            fromMe: false,
            id: messageId,
            participant: sender,
        },
    })

    let warnLimit = 3
    let warnCount = user.warn
    if (warnCount < warnLimit) {
        let remaining = warnLimit - warnCount
        await conn.sendMessage(msg.chat, {
            text: `${violation}\n*${warnCount}° 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎*\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒍𝒊𝒏𝒌 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`
        }, { quoted: vcardMessage })
    } else {
        user.warn = 0
        user.warnReasons = []
        await conn.sendMessage(msg.chat, { 
            text: '⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈' 
        })
        await conn.groupParticipantsUpdate(msg.chat, [msg.sender], 'remove')
    }
}

async function handleKick({ conn, msg, sender, messageId, violation }) {
    await conn.sendMessage(msg.chat, {
        delete: {
            remoteJid: msg.chat,
            fromMe: false,
            id: messageId,
            participant: sender,
        },
    })

    await conn.sendMessage(msg.chat, {
        text: `⛔ *𝐑𝐈𝐌𝐎𝐙𝐈𝐎𝐍𝐄 𝐈𝐌𝐌𝐄𝐃𝐈𝐀𝐓𝐀*\n${violation}`
    })

    await conn.groupParticipantsUpdate(msg.chat, [msg.sender], 'remove')
}