//tag Axtral

let handler = m => m;

handler.all = async function (m) {
  try {
   
    if (m.sender === conn.user.jid) return;

    const responses = {
      '573161874043@s.whatsapp.net': '𝐀𝐧𝐜𝐨𝐫𝐚 𝐜𝐡𝐞 𝐫𝐨𝐦𝐩𝐢 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐚𝐝 𝐀𝐱𝐭𝐫𝐚𝐥?',
      '35796261367@s.whatsapp.net': '𝐀𝐧𝐜𝐨𝐫𝐚 𝐜𝐡𝐞 𝐫𝐨𝐦𝐩𝐢 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐚𝐝 𝐀𝐱𝐭𝐫𝐚𝐥?',
      '35795191323@s.whatsapp.net': '𝐀𝐧𝐜𝐨𝐫𝐚 𝐜𝐡𝐞 𝐫𝐨𝐦𝐩𝐢 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐚𝐝 𝐀𝐱𝐭𝐫𝐚𝐥?',
      '393755435365@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚𝐥𝐨 𝐬𝐭𝐚𝐫𝐞, 𝐬𝐭𝐚𝐫𝐚̀ 𝐩𝐚𝐫𝐥𝐚𝐧𝐝𝐨 𝐜𝐨𝐧 𝐕𝐞𝐫𝐨𝐧𝐢𝐜𝐚.',
      '393926119886@s.whatsapp.net': '𝐍𝐨𝐧 𝐫𝐨𝐦𝐩𝐞𝐫𝐞 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨, 𝐥𝐚𝐬𝐜𝐢𝐚𝐥𝐚 𝐩𝐚𝐫𝐥𝐚𝐫𝐞 𝐜𝐨𝐧 𝐀𝐱𝐭𝐫𝐚𝐥.',
      '393279507049@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚 𝐬𝐭𝐚𝐫𝐞 𝐏𝐚𝐭𝐫𝐢𝐜𝐢𝐚, 𝐬𝐭𝐚𝐫𝐚̀ 𝐬𝐜𝐨𝐩𝐚𝐧𝐝𝐨 𝐜𝐨𝐧 𝐄𝐬𝐭𝐞𝐫.',
      '393715266173@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚 𝐬𝐭𝐚𝐫𝐞 𝐄𝐬𝐭𝐞𝐫, 𝐬𝐭𝐚𝐫𝐚̀ 𝐬𝐜𝐨𝐩𝐚𝐧𝐝𝐨 𝐜𝐨𝐧 𝐏𝐚𝐭𝐫𝐢𝐜𝐢𝐚.',
      '380687704317@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚𝐥𝐨 𝐬𝐭𝐚𝐫𝐞, 𝐞̀ 𝐨𝐜𝐜𝐮𝐩𝐚𝐭𝐨 𝐚 𝐟𝐚𝐫 𝐚𝐛𝐛𝐚𝐢𝐚𝐫𝐞 𝐢 𝐫𝐚𝐧𝐝𝐨𝐦𝐢𝐧𝐢.', 
      '393534610929@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚𝐥𝐨 𝐬𝐭𝐚𝐫𝐞, 𝐬𝐚𝐫𝐚̀ 𝐢𝐦𝐩𝐞𝐠𝐧𝐚𝐭𝐨 𝐚 𝐬𝐮𝐜𝐜𝐡𝐢𝐚𝐫𝐞 𝐢𝐥 3𝐚𝐬𝐛𝐚 𝐝𝐢 𝐀𝐱𝐭𝐫𝐚𝐥.',//arno
      '393792829288@s.whatsapp.net': '𝐍𝐨𝐧 𝐜𝐚𝐠𝐚𝐫𝐞 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐚 𝐑𝐞𝐨, 𝐟𝐮𝐨𝐫𝐢 𝐝𝐚𝐥𝐥𝐞 𝐩𝐚𝐥𝐥𝐞.',
      '393517983435@s.whatsapp.net': '𝐅𝐢𝐠𝐥𝐢𝐚𝐜𝐜𝐢𝐨 𝐝𝐢 𝐩𝐮𝐭𝐭𝐚𝐧𝐚, 𝐥𝐚𝐬𝐜𝐢𝐚 𝐬𝐭𝐚𝐫𝐞 𝐓𝐫𝐢𝐱𝐞𝐝, 𝐬𝐭𝐚𝐫𝐚̀ 𝐝𝐨𝐫𝐦𝐞𝐧𝐝𝐨 𝐦𝐞𝐧𝐭𝐫𝐞 𝐬𝐨𝐠𝐧𝐚 𝐀𝐱𝐭𝐫𝐚𝐥.',
      '393896244214@s.whatsapp.net': '𝐃𝐢𝐨 𝐛𝐚𝐬𝐭𝐚𝐫𝐝𝐨, 𝐜𝐡𝐞 𝐬𝐭𝐫𝐚 𝐜𝐚𝐳𝐳𝐨 𝐯𝐮𝐨𝐢? 𝐍𝐨𝐧 𝐥𝐞 𝐫𝐨𝐦𝐩𝐞𝐫𝐞 𝐥𝐞 𝐩𝐚𝐥𝐥𝐞 𝐝𝐚𝐢',//antonella
      '393897857433@s.whatsapp.net': '𝐃𝐢𝐨 𝐛𝐚𝐬𝐭𝐚𝐫𝐝𝐨, 𝐥𝐞𝐯𝐚𝐭𝐢 𝐝𝐚𝐢 𝐜𝐨𝐠𝐥𝐢𝐨𝐧𝐢.',//dar
      '393515261912@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚 𝐬𝐭𝐚𝐫𝐞 𝐢𝐥 𝐝𝐢𝐭𝐭𝐚𝐭𝐨𝐫𝐞 𝐆𝐢𝐮𝐥𝐢𝐨 𝐂𝐞𝐬𝐚𝐫𝐞!!',
      '639107484127@s.whatsapp.net': '𝐒𝐭𝐚𝐢 𝐫𝐨𝐦𝐩𝐞𝐧𝐝𝐨 𝐮𝐧 𝐩𝐨` 𝐭𝐫𝐨𝐩𝐩𝐨 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐚 𝐑𝐢𝐚𝐝, 𝐧𝐨𝐧 𝐜𝐫𝐞𝐝𝐢?',
      '393513348007@s.whatsapp.net': '𝐋𝐚𝐬𝐜𝐢𝐚𝐥𝐚 𝐬𝐭𝐚𝐫𝐞, 𝐬𝐭𝐚𝐫𝐚̀ 𝐝𝐨𝐫𝐦𝐞𝐧𝐝𝐨.',
    };

  
    let mentioned = m.mentionedJid || [];

    
    if (mentioned.includes(conn.user.jid)) {
      return; 
    }

    
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