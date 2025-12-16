//Plugin fatto da Axtral_WiZaRd
const time = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
  let who;
  if (m.isGroup) {
    who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
  } else {
    who = m.chat;
  }

  if (!who) return m.reply("*❗𝐃𝐞𝐯𝐢 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐪𝐮𝐚𝐥𝐜𝐮𝐧𝐨 𝐩𝐞𝐫 𝐝𝐚𝐫𝐠𝐥𝐢 𝐮𝐧 𝐰𝐚𝐫𝐧.*");

  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  if (who === ownerBot) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚 𝐢𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭.*');
  if (who === conn.user.jid) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚 𝐢𝐥 𝐛𝐨𝐭.*');
  if (who === m.sender) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.*');
  
 
if (m.isGroup) {
  let admins = groupMetadata.participants
    .filter(p => p.admin)
    .map(p => p.id)

  if (admins.includes(who)) {
    return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚𝐝 𝐮𝐧 𝐚𝐝𝐦𝐢𝐧.*')
  }
}

  if (command == 'warn' || command == "ammonisci") {
    let war = 2;

    if (!(who in global.db.data.users)) {
      global.db.data.users[who] = { warn: 0, warnReasons: [] };
    }

    let user = global.db.data.users[who];
    if (!user.warnReasons) user.warnReasons = [];

    let prova = {
      "key": {
        "participants": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo"
      },
      "message": {
        "locationMessage": {
          name: '⚠️ 𝐀𝐭𝐭𝐞𝐧𝐳𝐢𝐨𝐧𝐞 ⚠️',
          "jpegThumbnail": fs.readFileSync('./icone/warn.png'),
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      "participant": "0@s.whatsapp.net"
    };

    let cleanReason = text ? text.replace(/@[\w\d]+/g, '').trim() : '';
    let displayReason = '❓ ➤ *' + (cleanReason || '𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐨𝐭𝐢𝐯𝐨 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐭𝐨.') + '*';

    if (user.warn < war) {
      user.warn += 1;
      user.warnReasons.push(cleanReason || "Nessun motivo specificato");
      let remaining = 3 - user.warn;

      conn.reply(
        m.chat,
        `👤 ➤ @${who.split('@')[0]}\n⚠️ ➤ *${user.warn} / 3*\n${displayReason}\n\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒘𝒂𝒓𝒏 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`,
        prova,
        { mentions: [who] }
      );
    } else if (user.warn == war) {
      user.warn += 1;
      user.warnReasons.push(cleanReason || "Nessun motivo specificato");

      conn.reply(
        m.chat,
        `👤 ➤ @${who.split('@')[0]}\n⚠️ ➤ *3 / 3*\n${displayReason}\n\n> *𝑼𝒍𝒕𝒊𝒎𝒐 𝒘𝒂𝒓𝒏 𝒓𝒊𝒄𝒆𝒗𝒖𝒕𝒐. 𝑨𝒅𝒅𝒊𝒐 𝒑𝒍𝒆𝒃𝒆𝒐/𝒂.*`,
        prova,
        { mentions: [who] }
      );

      await time(1000);
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
      user.warn = 0;
      user.warnReasons = [];
    }
  }

  if (command == 'unwarn' || command == "delwarn") {
    if (!(who in global.db.data.users)) {
      global.db.data.users[who] = { warn: 0, warnReasons: [] };
    }

    let user = global.db.data.users[who];
    if (!user.warnReasons) user.warnReasons = [];

    if (user.warn > 0) {
      user.warn -= 1;
      if (user.warnReasons.length > 0) user.warnReasons.pop();

      let prova = {
        "key": {
          "participants": "0@s.whatsapp.net",
          "fromMe": false,
          "id": "Halo"
        },
        "message": {
          "locationMessage": {
            name: '𝑹𝒊𝒎𝒐𝒛𝒊𝒐𝒏𝒆 𝒘𝒂𝒓𝒏 ✓',
            "jpegThumbnail": fs.readFileSync('./icone/spunta.png'),
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
          }
        },
        "participant": "0@s.whatsapp.net"
      };

      conn.reply(
        m.chat,
        `👤 ➤ @${who.split('@')[0]}\n⚠️ ➤ *${user.warn} / 3*\n\n> *${user.warn} 𝒘𝒂𝒓𝒏 𝒓𝒊𝒎𝒂𝒏𝒆𝒏𝒕𝒊.*`,
        prova,
        { mentions: [who] }
      );
    } else {
      m.reply("*𝐋’𝐮𝐭𝐞𝐧𝐭𝐞 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐭𝐨 𝐧𝐨𝐧 𝐡𝐚 𝐰𝐚𝐫𝐧.*");
    }
  }
};

handler.help = handler.command = ['warn', 'ammonisci', 'unwarn', 'delwarn'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;