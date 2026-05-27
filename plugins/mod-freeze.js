//Plugin fatto da Axtral_WiZaRd
const handler = async (_0x498b4a, { conn, text }) => {

    const muteDuration = parseInt(text) || 5; 
    const mentionedJid =
        _0x498b4a.mentionedJid?.[0] ||
        _0x498b4a.quoted?.sender;

    if (!mentionedJid)
        throw '𝑴𝒂𝒏𝒄𝒂 𝒊𝒍 𝒕𝒂𝒈❗︎';

    const chatId = _0x498b4a.chat;
    const botNumber = conn.user.jid;
    const groupMetadata = await conn.groupMetadata(chatId);
    const groupOwner =
        groupMetadata.owner ||
        chatId.split('-')[0] + '@s.whatsapp.net';
    const ownerJids = global.owner.map(
        o => o[0] + '@s.whatsapp.net'
    );

    if (mentionedJid === groupOwner)
        throw '𝐈𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨 𝐧𝐨𝐧 𝐩𝐮𝐨̀ 𝐞𝐬𝐬𝐞𝐫𝐞 𝐦𝐮𝐭𝐚𝐭𝐨 ✘';
    if (mentionedJid === botNumber)
        throw '𝐇𝐚𝐢 𝐚𝐩𝐩𝐞𝐧𝐚 𝐜𝐞𝐫𝐜𝐚𝐭𝐨 𝐝𝐊 𝐦𝐮𝐭𝐚𝐫𝐦𝐢? 𝐒𝐞𝐫𝐢𝐚𝐦𝐞𝐧𝐭𝐞? 🤡';
    if (ownerJids.includes(mentionedJid))
        throw '𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐦𝐮𝐭𝐚𝐫𝐞 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫 ✘';

    const user = global.db.data.users[mentionedJid] || {};

    if (user.muto)
        throw '⚠︎ 𝑼𝒕𝒆𝒏𝒕𝒆 𝒈𝒊𝒂̀ 𝒎𝒖𝒕𝒂𝒕𝒐 ⚠︎';

    user.muto = true;

    await conn.sendMessage(chatId, {
        text: `𝑳'𝒖𝒕𝒆𝒏𝒕𝒆 @${mentionedJid.split('@')[0]} 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒎𝒖𝒕𝒂𝒕𝒐 𝒑𝒆𝒓 ${muteDuration} 𝒎𝒊𝒏𝒖𝒕𝒊 ⏱️`,
        mentions: [mentionedJid],
    });

    setTimeout(() => {
        user.muto = false;

        conn.sendMessage(chatId, {
            text: `@${mentionedJid.split('@')[0]} 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒔𝒎𝒖𝒕𝒂𝒕𝒐 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒎𝒆𝒏𝒕𝒆 ✅`,
            mentions: [mentionedJid],
        });
    }, muteDuration * 60 * 1000);
};

handler.command = /^(silence)$/i;
handler.botAdmin = true;
handler.group = true;
handler.premium = true;

export default handler;