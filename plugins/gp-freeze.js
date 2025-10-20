//Plugin fatto da Axtral_WiZaRd
import fetch from 'node-fetch';

const handler = async (_0x498b4a, { conn, command, text, isAdmin }) => {
    if (!isAdmin) throw '𝑪𝒐𝒎𝒂𝒏𝒅𝒐 𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒊𝒍𝒆 𝒔𝒐𝒍𝒐 𝒑𝒆𝒓 𝒂𝒅𝒎𝒊𝒏🌟';

    if (command === 'freeze') {
        const muteDuration = parseInt(text) || 5; // Durata in minuti, default 5 minuti
        let mentionedJid = _0x498b4a.mentionedJid?.[0] || _0x498b4a.quoted?.sender;

if (!mentionedJid && text) {
  if (text.endsWith('@s.whatsapp.net') || text.endsWith('@c.us')) {
    mentionedJid = text.trim();
  } else {
    let number = text.replace(/[^0-9]/g, '');
    if (number.length >= 8 && number.length <= 15) {
      mentionedJid = number + '@s.whatsapp.net';
    }
  }
}
        if (!mentionedJid) throw '𝑴𝒂𝒏𝒄𝒂 𝒊𝒍 𝒕𝒂𝒈❗︎';

        const user = global.db.data.users[mentionedJid] || {};
        if (user.muto) throw '⚠︎ 𝑼𝒕𝒆𝒏𝒕𝒆 𝒈𝒊𝒂̀ 𝒎𝒖𝒕𝒂𝒕𝒐 ⚠︎';

        user.muto = true;

        const muteMessage = {
            text: `𝑳'𝒖𝒕𝒆𝒏𝒕𝒆 @${mentionedJid.split('@')[0]} 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒎𝒖𝒕𝒂𝒕𝒐 𝒑𝒆𝒓 ${muteDuration} 𝒎𝒊𝒏𝒖𝒕𝒊 ⏱️`,
            mentions: [mentionedJid],
        };
        await conn.sendMessage(_0x498b4a.chat, muteMessage);

        // Rimuove il muto dopo il tempo specificato
        setTimeout(() => {
            user.muto = false;
            conn.sendMessage(_0x498b4a.chat, {
                text: ` @${mentionedJid.split('@')[0]} 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒔𝒎𝒖𝒕𝒂𝒕𝒐 𝒂𝒖𝒕𝒐𝒎𝒂𝒕𝒊𝒄𝒂𝒎𝒆𝒏𝒕𝒆 ✅`,
                mentions: [mentionedJid],
            });
        }, muteDuration * 60 * 1000);
    }
};


handler.command = /^(freeze)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;