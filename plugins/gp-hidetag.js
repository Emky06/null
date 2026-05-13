import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, text, participants }) => {
    let users = (participants || []).map(p => conn.decodeJid(p.id || p.jid)).filter(Boolean)
    let q = m.quoted ? m.quoted : m
    let type = Object.keys(q.msg || q)[0] || ''
    let msg = q.msg?.[type] || q.msg || q

    let captionText =
        m.quoted?.text
            ? `➠ ${m.quoted.text}`
            : (text?.trim()
                ? `➠ ${text.trim()}`
                : `➠`)

    let mentions = [...new Set([...(m.mentionedJid || []), ...users])].filter(Boolean)

    try {
        let isPoll = m.quoted && (
            q.mtype?.includes('pollCreationMessage') ||
            q.msg?.pollCreationMessage ||
            q.msg?.pollCreationMessageV2 ||
            q.msg?.pollCreationMessageV3
        )

        if (isPoll) {
            let pollData =
                q.msg?.pollCreationMessageV3 ||
                q.msg?.pollCreationMessageV2 ||
                q.msg?.pollCreationMessage ||
                q.msg

            let pollName =
                pollData?.name ||
                pollData?.title ||
                'Sondaggio'

            let optionsArray =
                pollData?.options ||
                pollData?.values ||
                pollData?.pollValues ||
                []

            let pollValues = []

            if (Array.isArray(optionsArray)) {
                pollValues = optionsArray.map(opt =>
                    typeof opt === 'string'
                        ? opt
                        : opt?.optionName || opt?.name || opt
                ).filter(Boolean)
            }

            if (pollValues.length > 0) {
                await conn.sendMessage(m.chat, {
                    poll: {
                        name: pollName,
                        values: pollValues,
                        selectableCount: pollData?.selectableOptionsCount || pollData?.selectableCount || 1
                    }
                }, { quoted: m })
                return
            }
        }

        if (!m.quoted) {
            await conn.sendMessage(
                m.chat,
                { text: captionText, mentions },
                { quoted: m }
            )
            return
        }

        const traceableTypes = [
            'imageMessage',
            'videoMessage',
            'audioMessage',
            'stickerMessage',
            'documentMessage'
        ]

        let isMedia =
            traceableTypes.includes(type) ||
            traceableTypes.includes(q.mtype)

        let media = isMedia ? await q.download?.().catch(() => null) : null

        let isViewOnce = q.msg?.viewOnce || q.viewOnce || false
        let isGif =
            q.msg?.gifPlayback ||
            q.gifPlayback ||
            q.mtype === 'videoMessage'

        let commonOptions = {
            contextInfo: {
                mentionedJid: mentions,
                isForwarded: false
            },
            viewOnce: isViewOnce
        }

        if (isMedia && media) {
            if (isGif) {
                await conn.sendMessage(
                    m.chat,
                    { video: media, gifPlayback: true, caption: captionText, ...commonOptions },
                    { quoted: m }
                )
            } else if (q.mtype === 'imageMessage' || type === 'imageMessage') {
                await conn.sendMessage(
                    m.chat,
                    { image: media, caption: captionText, ...commonOptions },
                    { quoted: m }
                )
            } else if (q.mtype === 'videoMessage' || type === 'videoMessage') {
                await conn.sendMessage(
                    m.chat,
                    { video: media, caption: captionText, ...commonOptions },
                    { quoted: m }
                )
            } else if (q.mtype === 'audioMessage' || type === 'audioMessage') {
                await conn.sendMessage(
                    m.chat,
                    {
                        audio: media,
                        mimetype: 'audio/mp4',
                        ptt: q.msg?.ptt || false,
                        ...commonOptions
                    },
                    { quoted: m }
                )
            } else if (q.mtype === 'stickerMessage' || type === 'stickerMessage') {
                await conn.sendMessage(
                    m.chat,
                    { sticker: media, ...commonOptions },
                    { quoted: m }
                )
            } else {
                await conn.sendMessage(
                    m.chat,
                    { text: captionText, mentions },
                    { quoted: m }
                )
            }
        } else {
            await conn.sendMessage(
                m.chat,
                { text: captionText, mentions },
                { quoted: m }
            )
        }
    } catch (e) {
        console.error(e)
        await conn.sendMessage(
            m.chat,
            { text: captionText, mentions },
            { quoted: m }
        )
    }
}

handler.command = /^(hidetag|tag)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler