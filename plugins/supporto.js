import fs from 'fs';

let handler = async (_0x4955de, { conn: _0x4b9a49, usedPrefix: _0xeb2cc9 }) => {
  try {
    // Prendi il primo owner dal config globale
    let owners = global.owner.filter(([id]) => id).map(([id]) => id);
    let ownerNumber = owners[0]; // prende solo il primo owner

    // Trasforma in JID WhatsApp valido
    let ownerJid = ownerNumber.replace(/\D/g, '') + "@s.whatsapp.net";

    let _0x414c2d = {
      key: {
        participants: "0@s.whatsapp.net",
        fromMe: false,
        id: 'Halo'
      },
      message: {
        locationMessage: {
          name: "𝑺𝒖𝒑𝒑𝒐𝒓𝒕𝒐 𝑩𝒐𝒕",
          jpegThumbnail: fs.readFileSync('icone/logobot.png'),
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=${ownerNumber}:+${ownerNumber}\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD`
        }
      },
      participant: "0@s.whatsapp.net"
    };

    // Messaggio con numero trasformato in link wa.me
    let _0x259d4e = `
═════════════════════
👑 *𝑺𝒖𝒑𝒑𝒐𝒓𝒕𝒐 𝑩𝒐𝒕* 👑

 ➤ 𝐏𝐞𝐫 𝐪𝐮𝐚𝐥𝐬𝐢𝐚𝐬𝐢 𝐩𝐫𝐨𝐛𝐥𝐞𝐦𝐚 𝐫𝐢𝐬𝐜𝐨𝐧𝐭𝐫𝐚𝐭𝐨 𝐜𝐨𝐧 𝐢𝐥 𝐛𝐨𝐭, 𝐜𝐨𝐧𝐭𝐚𝐭𝐭𝐚 𝐢𝐥 𝐩𝐫𝐨𝐩𝐫𝐢𝐞𝐭𝐚𝐫𝐢𝐨 cliccando qui:
📞 https://wa.me/${ownerNumber.replace(/\D/g, '')}

𝑩𝒀 ${nomebot}
═════════════════════
`.trim();

    await _0x4b9a49.sendMessage(_0x4955de.chat, {
      text: _0x259d4e,
      contextInfo: {
        mentionedJid: [ownerJid],
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
  } catch (e) {
    console.error("Errore in supporto:", e);
    _0x4b9a49.sendMessage(_0x4955de.chat, { text: "❌ Errore nel mostrare il supporto." });
  }
};

handler.help = ["supporto"];
handler.tags = ["supporto"];
handler.command = /^(supporto)$/i;
export default handler;