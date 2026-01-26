import https from 'https';
import { Aki } from 'aki-api';

const activeGames = new Map();
const pendingModeChoice = new Map();

const agent = new https.Agent({ rejectUnauthorized: false });

let handler = async (m, { conn, args }) => {
  const chat = m.chat;
  const sender = m.sender;

  const chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛');

  if (!args[0]) {
    pendingModeChoice.set(chat, sender);
    await conn.sendMessage(chat, {
      text: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐥𝐚 𝐥𝐢𝐧𝐠𝐮𝐚 𝐝𝐢 𝐚𝐤𝐢𝐧𝐚𝐭𝐨𝐫:',
      footer: '𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐡𝐚 𝐚𝐯𝐯𝐢𝐚𝐭𝐨 𝐩𝐮𝐨̀ 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞',
      buttons: [
        { buttonId: '.akinator start it', buttonText:{ displayText:'𝐈𝐭𝐚𝐥𝐢𝐚𝐧𝐨 🇮🇹' }, type:1 },
        { buttonId: '.akinator start en', buttonText:{ displayText:'𝐈𝐧𝐠𝐥𝐞𝐬𝐞 🇬🇧' }, type:1 }
      ],
      headerType:1
    });
    return;
  }

  if (!pendingModeChoice.has(chat) || pendingModeChoice.get(chat)!==sender) {
    return m.reply('𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐡𝐚 𝐚𝐯𝐯𝐢𝐚𝐭𝐨 𝐢𝐥 𝐠𝐢𝐨𝐜𝐨 𝐩𝐮𝐨̀ 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞.');
  }

  if (args[0] === 'start') {
    const region = args[1] || 'it';
    const aki = new Aki({ region, httpsAgent: agent });

    await aki.start();
    activeGames.set(chat, { aki, sender });
    pendingModeChoice.delete(chat);

    return inviaDomanda(conn, chat, aki);
  }
};

async function inviaDomanda(conn, chat, aki) {
  const buttons = [
    { buttonId: '.akinator answer si', buttonText:{ displayText:'𝐬𝐢 ✅' }, type:1 },
    { buttonId: '.akinator answer no', buttonText:{ displayText:'𝐧𝐨 ❌' }, type:1 },
    { buttonId: '.akinator answer forse', buttonText:{ displayText:'𝐟𝐨𝐫𝐬𝐞 🤔' }, type:1 },
    { buttonId: '.akinator answer nonso', buttonText:{ displayText:'𝐧𝐨𝐧 𝐬𝐨 ❓' }, type:1 }
  ];

  await conn.sendMessage(chat, {
    text: `❓ 𝐃𝐨𝐦𝐚𝐧𝐝𝐚: ${aki.question}`,
    footer: '𝐂𝐥𝐢𝐜𝐜𝐚 𝐬𝐮 𝐮𝐧 𝐩𝐮𝐥𝐬𝐚𝐧𝐭𝐞 per rispondere',
    buttons: buttons,
    headerType:1
  });
}

handler.before = async (m, { conn, args }) => {
  const chat = m.chat;
  if (!activeGames.has(chat)) return;

  const game = activeGames.get(chat);
  if (m.sender !== game.sender) return;
  if (!args[0] || args[0] !== 'answer') return;

  const text = args[1].toLowerCase();
  const mapAnswers = { 'si':0, 'sì':0, 'no':1, 'forse':3, 'nonso':2, 'non so':2 };
  if (!(text in mapAnswers)) return;

  await game.aki.step(mapAnswers[text]);

  if (game.aki.progress >= 80 || game.aki.currentStep >= 78) {
    const guess = await game.aki.answer();
    activeGames.delete(chat);
    return conn.sendMessage(chat, { text: `🎉 𝐇𝐨 𝐢𝐧𝐝𝐨𝐯𝐢𝐧𝐚𝐭𝐨! *${guess.answers[0].name}*` });
  }

  return inviaDomanda(conn, chat, game.aki);
};

handler.help = ['akinator'];
handler.tags = ['giochi'];
handler.command = ['akinator'];

export default handler;