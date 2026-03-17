//Plugin fatto da Axtral_WiZaRd
import { Buffer } from 'buffer';

let handler = async (m, { conn }) => {
    if (!m.quoted) {
        throw '𝐑𝐈𝐒𝐏𝐎𝐍𝐃𝐈 𝐀𝐋 𝐌𝐄𝐒𝐒𝐀𝐆𝐆𝐈𝐎 ×𝟏 𝐃𝐀 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐑𝐄.';
    }

    let q = m.quoted;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/image|video|audio/g.test(mime)) {
        throw `𝐓𝐈 𝐒𝐄𝐌𝐁𝐑𝐀 𝐔𝐍 𝐌𝐄𝐃𝐈𝐀 ×1?`;
    }

    let isViewOnce = false;
    let originalMsgType = '';
    try {
        originalMsgType = Object.keys(q.message || {})[0];
        if (originalMsgType === 'viewOnceMessageV2' || originalMsgType === 'viewOnceMessageV2Extension') {
            isViewOnce = true;
        }
    } catch (e) {
        console.error("𝐄𝐑𝐑:", e);
    }

    if (isViewOnce) {
        console.log(`𝐈𝐍𝐅𝐎: 𝐌𝐄𝐒𝐒𝐀𝐆𝐆𝐈𝐎 ${q.id.id} 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 (${originalMsgType}). 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃.`);
    }

    try {
        let buffer = await q.download?.();

        if (!buffer) {
             throw '𝐄𝐑𝐑𝐎𝐑𝐄.';
        }

        let caption = '';

try {
    if (!q?.message || typeof q.message !== 'object') {
        caption = '';
    } else {
        const msg = q.message;
        const type = originalMsgType || Object.keys(msg)[0];

        if (!type || !msg[type]) {
            caption = '';
        } else {
            const content = msg[type];

            if (typeof content === 'object' && content.caption) {
                caption = content.caption;
            } else if (
                content?.message &&
                typeof content.message === 'object'
            ) {
                const innerType = Object.keys(content.message)[0];
                caption = content.message?.[innerType]?.caption || '';
            }
        }
    }
} catch (e) {
    caption = '';
}

        if (/video/g.test(mime)) {
    await conn.sendMessage(m.chat, {
        video: buffer,
        caption: caption || ''
    }, { quoted: m });

} else if (/image/g.test(mime)) {
    await conn.sendMessage(m.chat, {
        image: buffer,
        caption: caption || ''
    }, { quoted: m });

} else if (/audio/g.test(mime)) {
    await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: mime
    }, { quoted: m });
}

    } catch (e) {
        console.error(e);
        if (e.message === '𝐄𝐑𝐑𝐎𝐑𝐄.') {
             throw '𝐈𝐌𝐏𝐎𝐒𝐒𝐈𝐁𝐈𝐋𝐄 𝐏𝐑𝐎𝐂𝐄𝐃𝐄𝐑𝐄 𝐂𝐎𝐍 𝐈𝐋 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃.';
        } else {
            throw `𝐄𝐑𝐑𝐎𝐑𝐄: ${e.message || e}`;
        }
    }
};

handler.help = ['rivela'];
handler.tags = ['tools'];
handler.command = ['view', 'nocap', 'rivela', 'getmedia'];
handler.admin = true;

export default handler;