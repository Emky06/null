//Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db)
    global.db = {
      data: {
        users: {},
        chats: {},
        prems: {},
        groups: {}
      }
    };

  if (!global.db.data)
    global.db.data = {
      users: {},
      chats: {},
      prems: {},
      groups: {}
    };

  if (!global.db.data.groups)
    global.db.data.groups = {};
}

let handler = async (m, { command, text, usedPrefix }) => {
  ensureDB();

  const groups = global.db.data.groups;

  switch (command) {

    case 'listgp': {

      if (!Object.keys(groups).length) {
        return m.reply('❌ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨 𝐬𝐚𝐥𝐯𝐚𝐭𝐨 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.');
      }

      let txt = `╭━━━━━━━━━━━━━━━━━━━╮
┃  📂 𝐃𝐀𝐓𝐀𝐁𝐀𝐒𝐄 𝐆𝐑𝐔𝐏𝐏𝐈  📂 ┃
╰━━━━━━━━━━━━━━━━━━━╯\n\n`;

      for (let groupId in groups) {
        let data = groups[groupId];
        let mods = data.prems || [];

        txt += `━━━━━━━━━━━━━━━━━━━\n`;
        txt += `📌 \`𝐈𝐃 𝐆𝐫𝐮𝐩𝐩𝐨:\`\n${groupId}\n`;

        if (mods.length) {
          txt += `👮🏿‍♂️ \`𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢:\`\n`;
          txt += mods.map(v => `● wa.me/${v}`).join('\n');
        } else {
          txt += '❌ 𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞';
        }

        txt += '\n\n';
      }

      return m.reply(txt);
    }

    case 'delgp': {

      if (!text) {
        return m.reply(
          `❌ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐥'𝐈𝐃 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.\n\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨:\n${usedPrefix + command} 1203630xxxxx@g.us`
        );
      }

      let groupId = text.trim();

      if (!groups[groupId]) {
        return m.reply('❌ 𝐆𝐫𝐮𝐩𝐩𝐨 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.');
      }

      let removedMods = groups[groupId].prems || [];

      delete groups[groupId];

      return m.reply(
        `✅ 𝐆𝐫𝐮𝐩𝐩𝐨 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨 𝐝𝐚𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞.\n\n📌 𝐈𝐃:\n${groupId}\n\n👮🏽‍♂️ 𝐌𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 𝐫𝐢𝐦𝐨𝐬𝐬𝐢: ${removedMods.length}`
      );
    }
  }
};

handler.help = ['listgp', 'delgp <idgruppo>'];
handler.command = /^(listgp|delgp)$/i;
handler.owner = true;

export default handler;