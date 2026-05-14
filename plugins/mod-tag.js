//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, text, participants }) => {
    let users = participants.map(u => conn.decodeJid(u.id))
    let q = m.quoted ? m.quoted : m
    let type = Object.keys(q.msg || q)[0] || ''
    let msg = q.msg?.[type] || q.msg || q
    let captionText = m.quoted?.text ? `➠ ${m.quoted.text}` : (text?.trim() ? `➠ ${text.trim()}` : `➠`)
    let mentions = [...new Set([...(m.mentionedJid || []), ...users])]

    try {
        let isPoll = m.quoted && (
            q.mtype?.includes('pollCreationMessage') ||
            q.msg?.pollCreationMessage || 
            q.msg?.pollCreationMessageV2 || 
            q.msg?.pollCreationMessageV3 || 
            q.pollCreationMessage || 
            q.msg?.pollMessage
        )
        
if (isPoll && m.quoted) {

    let optionsArray = q.msg?.options || q.options || q.msg?.pollCreationMessageV3?.options || []

    let pollValues = []

    if (Array.isArray(optionsArray) && optionsArray.length > 0) {
        pollValues = optionsArray.map(opt =>
            typeof opt === 'string' ? opt : opt.optionName
        )
    } else if (q.msg?.values && Array.isArray(q.msg.values)) {
        pollValues = q.msg.values
    }

    if (pollValues.length > 0) {

        let raw = text?.trim() || ''
        let parts = raw.split('|')

      let tagText = parts[0]?.trim()

if (!tagText) {
    tagText = '𝐕𝐨𝐭𝐚𝐭𝐞 𝐢𝐥 𝐬𝐞𝐠𝐮𝐞𝐧𝐭𝐞 𝐬𝐨𝐧𝐝𝐚𝐠𝐠𝐢𝐨 ⬇️'
}
        let pollTitle = parts[1]?.trim()

        let finalTitle =
            pollTitle
                ? `📊 ${pollTitle}`
                : m.quoted?.text?.trim()
                    ? `📊 ${m.quoted.text.trim()}`
                    : '𝐒𝐜𝐞𝐠𝐥𝐢 𝟏 𝐭𝐫𝐚 𝐥𝐞 𝐬𝐞𝐠𝐮𝐞𝐧𝐭𝐢 𝐨𝐩𝐳𝐢𝐨𝐧𝐢:'

        if (tagText) {
            await conn.sendMessage(m.chat, {
                text: `➠ ${tagText}`,
                mentions: mentions
            }, { quoted: m })
        }
        await conn.sendMessage(m.chat, {
            poll: {
                name: finalTitle,
                values: pollValues,
                selectableCount: 1
            },
            mentions: mentions
        }, { quoted: m })

        return
    }
}
        if (!m.quoted) {
            await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
            return
        }

        const traceableTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']
        let isMedia = traceableTypes.includes(type) || traceableTypes.includes(q.mtype)
        let media = isMedia ? await q.download?.().catch(() => null) : null
        
        let isViewOnce = q.msg?.viewOnce || q.viewOnce || false  
        let isGif = q.msg?.gifPlayback || q.gifPlayback || (q.mtype === 'videoMessage' && q.msg?.gifPlayback)  

        let commonOptions = {  
            mentions: mentions,  
            contextInfo: {   
                mentionedJid: mentions,  
                isForwarded: false  
            },  
            viewOnce: isViewOnce  
        }  

        if (isMedia && media) {
            if (isGif) {  
                await conn.sendMessage(m.chat, { video: media, gifPlayback: true, caption: captionText, ...commonOptions }, { quoted: m })
            } else if (q.mtype === 'imageMessage' || type === 'imageMessage') {  
                await conn.sendMessage(m.chat, { image: media, caption: captionText, ...commonOptions }, { quoted: m })
            } else if (q.mtype === 'videoMessage' || type === 'videoMessage') {  
                await conn.sendMessage(m.chat, { video: media, caption: captionText, ...commonOptions }, { quoted: m })
            } else if (q.mtype === 'audioMessage' || type === 'audioMessage') {  
                await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mp4', ptt: isViewOnce ? true : (q.msg?.ptt || false), ...commonOptions }, { quoted: m })
            } else if (q.mtype === 'stickerMessage' || type === 'stickerMessage') {  
                await conn.sendMessage(m.chat, { sticker: media, ...commonOptions }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
            }
        } else {
            await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
        }
    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { text: captionText, mentions: mentions }, { quoted: m })
    }
}

handler.command = /^(totag)$/i
handler.group = true
handler.premium = true
handler.botAdmin = true

export default handler