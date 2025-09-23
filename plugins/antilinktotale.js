// by Riad, mod Axtral

import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const linkRegex = /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?/gi
const safeDomains = ['whatsapp.com', 'instagram.com', 'instagr.am', 'tiktok.com']
const ignoredCommands = ['.play', '.play1', '.play2']
const maxWarn = 3

// antilink caratteri invisibili
function normalizeText(text) {
    return (text || '')
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF\u2060-\u206F\u00AD\u034F\u180E\u17B4\u17B5]/g, '')
        .replace(/\s+/g, '')
}

// antilink eventi/sondaggi ecc
function extractText(msg) {
    if (!msg.message) return ''
    let result = ''
    function recurse(obj) {
        if (!obj) return
        if (typeof obj === 'string') {
            result += obj + ' '
        } else if (typeof obj === 'object') {
            for (let key in obj) {
                if (key === 'quotedMessage') continue
                recurse(obj[key])
            }
        }
    }
    recurse(msg.message)
    return result
}


async function getMediaBuffer(message) {
    try {
        const msg = message.message?.imageMessage || message.message?.videoMessage
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

// antiqr (api)
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

export async function before(m, { isAdmin, isBotAdmin, conn }) {
    if (!m.isGroup || m.isBaileys) return true

    let chat = global.db.data.chats[m.chat]
    if (!chat.antilinktotale) return true

    const lowerText = (m.text || '').toLowerCase()
    if (ignoredCommands.some(cmd => lowerText.startsWith(cmd))) return true

    let rawText = extractText(m)
    let cleanedText = normalizeText(rawText)

    if (linkRegex.test(cleanedText)) {
        let matched = cleanedText.match(linkRegex)
        let link = matched ? matched[0] : ''

        if (safeDomains.some(domain => link.includes(domain))) return true
        if (isAdmin) return true

        await handleViolation({ conn, m, reason: '𝐋𝐈𝐍𝐊 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎' })
    }

    // antiqr
    const media = await getMediaBuffer(m)
    if (media) {
        const qrData = await readQRCode(media)
        const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? ''
        if (qrData && linkRegex.test(qrText)) {
            if (isAdmin) return true
            await handleViolation({ conn, m, reason: '𝐐𝐑 𝐂𝐎𝐍 𝐋𝐈𝐍𝐊 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎' })
        }
    }

    return true
}

// warn e rimozione
async function handleViolation({ conn, m, reason }) {
    const user = global.db.data.users[m.sender]
    user.warn = user.warn || 0
    user.warn += 1

    // elimina messaggio
    await conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant || m.sender
        }
    })

    // avviso warn
    await conn.sendMessage(m.chat, {
        text: `⚠️ ${reason}\n@${m.sender.split('@')[0]} 𝐡𝐚 𝐫𝐢𝐜𝐞𝐯𝐮𝐭𝐨 𝐮𝐧 𝐰𝐚𝐫𝐧.\n> 𝐖𝐚𝐫𝐧 *${user.warn} 𝐬𝐮 ${maxWarn}*`,
        mentions: [m.sender]
    })

    if (user.warn >= maxWarn) {
        user.warn = 0
        await conn.sendMessage(m.chat, {
            text: `⛔ @${m.sender.split('@')[0]} 𝐡𝐚 𝐫𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨 ${maxWarn} 𝐰𝐚𝐫𝐧 𝐞𝐝 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.`,
            mentions: [m.sender]
        })
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }
}
