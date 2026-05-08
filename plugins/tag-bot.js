//Plugin fatto da Axtral_WiZaRd
let handler = m => m;

handler.all = async function (m) {
  try {
    if (m.sender === conn.user.jid) return;

    const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    const responses = {
      [botNumber]: '𝐂𝐇𝐄 𝐂𝐀𝐙𝐙𝐎 𝐕𝐔𝐎𝐈?',
    };

    let mentioned = m.mentionedJid || [];
    let taggedNumbers = mentioned.filter(jid => responses[jid]);

    if (taggedNumbers.length === 0 || m.fromMe) return;

    if (taggedNumbers.length === 1) {
      let responseMessage = responses[taggedNumbers[0]];
      await conn.reply(m.chat, responseMessage, m, { quoted: m });
    }

  } catch (error) {
    console.error('𝐄𝐫𝐫𝐨𝐫𝐞 ⚠️', error);
  }

  return !0;
};

export default handler;