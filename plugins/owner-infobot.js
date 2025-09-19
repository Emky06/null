import fs from 'fs';

let handler = async (_0x4955de, { conn: _0x4b9a49, usedPrefix: _0xeb2cc9 }) => {
  let _0x414c2d = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'Halo'
    },
    message: {
      locationMessage: {
        name: "𝐈𝐧𝐟𝐨𝐁𝐨𝐭",
        jpegThumbnail: fs.readFileSync('icone/logobot.png'),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  };
  
  let _0x259d4e = `
╭━━━━━━━━━━━━━━━━━━━╮
┃             🤖 *𝐈𝐧𝐟𝐨𝐁𝐨𝐭* 🤖
┃
┃➤ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐞: +62 831-8688-7127
┃
┃➤ 𝐍𝐨𝐦𝐞 𝐁𝐨𝐭: 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
┃
┃➤ 𝐒𝐭𝐚𝐭𝐨 𝐁𝐨𝐭: _Online_
┃
┃➤ 𝐂𝐫𝐞𝐚𝐭𝐨 𝐢𝐥: *10/04/2025*
┃
╰━━━━━━━━━━━━━━━━━━━╯
`.trim();
  
  let _0xf5c7c0 = global.db.data.nomedelbot || "𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕";

  _0x4b9a49.sendMessage(_0x4955de.chat, {
    text: _0x259d4e,
    contextInfo: {
      mentionedJid: _0x4b9a49.parseMention(wm),
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363402109887104@newsletter",
        serverMessageId: '',
        newsletterName: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕'
      }
    }
  }, {
    quoted: _0x414c2d
  });
};

handler.help = ["menu"];
handler.tags = ["menu"];
handler.command = /^(botinfo)$/i;
export default handler;

function clockString(_0x5dad08) {
  let _0x233c78 = Math.floor(_0x5dad08 / 3600000);
  let _0x2b10bc = Math.floor(_0x5dad08 / 60000) % 60;
  let _0x2c7d73 = Math.floor(_0x5dad08 / 1000) % 60;
  return [_0x233c78, _0x2b10bc, _0x2c7d73].map(_0x4bd0ef => _0x4bd0ef.toString().padStart(2, 0)).join(':');
}