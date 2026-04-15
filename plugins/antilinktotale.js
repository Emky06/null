// by Riad, mod Axtral

import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const linkRegex = /\b(?:https?:\/\/|www\.)[^\s]+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,6}(?:\/[^\s]*)?\b/gi
const safeDomains = ['whatsapp.com', 'instagram.com', 'instagr.am', 'tiktok.com']
const ignoredCommands = ['.play', '.play1', '.play2']
const maxWarn = 3

function normalizeText(text) {
    return (text || '')
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF\u2060-\u206F\u00AD\u034F\u180E\u17B4\u17B5]/g, '')
        .replace(/\s+/g, '')
}

function extractText(msg) {
    if (!msg?.message) return ''
    let result = ''
    const allowedKeyNames = new Set([
        'conversation', 'text', 'displaytext', 'caption',
        'name', 'description', 'optionname', 'title', 'body',
        'label', 'selectedoptionid', 'singleSelectReply', 'selected'
    ])
    const parentTextContainers = new Set([
        'pollCreationMessage', 'pollcreationmessage', 'poll', 'options',
        'eventMessage', 'eventmessage'
    ])
    function looksLikeMime(s) {
        return /^[a-z]+\/[a-z0-9\-\+\.]+$/i.test(s)
    }
    function looksLikeShortId(s) {
        if (!s) return true
        if (s.length <= 2) return true
        if (/^[A-Za-z0-9_-]{16,}$/.test(s)) return true
        return false
    }
    function recurse(obj, path = []) {
        if (!obj) return
        if (typeof obj === 'string') {
            const key = (path[path.length - 1] || '').toLowerCase()
            const pathLower = path.map(p => String(p).toLowerCase())
            const isAllowedKey = allowedKeyNames.has(key)
            const insideParent = pathLower.some(p => parentTextContainers.has(p))
            if (isAllowedKey || insideParent) {
                const value = obj.trim()
                if (!looksLikeMime(value) && !looksLikeShortId(value)) {
                    result += value + ' '
                }
            }
        } else if (typeof obj === 'object') {
            for (let k in obj) {
                if (k === 'quotedMessage') continue
                recurse(obj[k], path.concat(k))
            }
        }
    }
    recurse(msg.message, [])
    return result.trim()
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

export async function before(m, { isAdmin, isPrems, isBotAdmin, conn }) {
    if (!m.isGroup || m.isBaileys) return true
    let chat = global.db.data.chats[m.chat]
    if (!chat.antilinktotale) return true
    const lowerText = (m.text || '').toLowerCase()
    if (ignoredCommands.some(cmd => lowerText.startsWith(cmd))) return true
    let rawText = extractText(m)
    let cleanedText = normalizeText(rawText)
    if (cleanedText && linkRegex.test(cleanedText)) {
        let matched = cleanedText.match(linkRegex)
        let link = matched ? matched[0] : ''
        if (safeDomains.some(domain => link.includes(domain))) return true
        if (isAdmin || isPrems) return true
        await handleViolation({ conn, m, reason: '𝐋𝐈𝐍𝐊 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎' })
    }
    const media = await getMediaBuffer(m)
    if (media) {
        const qrData = await readQRCode(media)
        const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? ''
        if (qrData && linkRegex.test(qrText)) {
            if (isAdmin || isPrems) return true
            await handleViolation({ conn, m, reason: '𝐐𝐑 𝐂𝐎𝐍 𝐋𝐈𝐍𝐊 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎' })
        }
    }
    return true
}

async function handleViolation({ conn, m, reason }) {
    const user = global.db.data.users[m.sender]
    user.warn = user.warn || 0
    user.warn += 1
    await conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant || m.sender
        }
    })
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
