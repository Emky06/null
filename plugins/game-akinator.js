import { personaggiAnime } from './akinator-anime.js';
import { personaggiGenerali } from './akinator-generali.js';

const activeGames = new Map();
const pendingModeChoice = new Map();

let handler = async (m, { conn, args }) => {
  const chat = m.chat;
  const sender = m.sender;

  const chatConfig = global.db.data.chats[m.chat] || {};
  if (chatConfig.antigiochi) return m.reply('> 📛 𝐀𝐍𝐓𝐈𝐆𝐈𝐎𝐂𝐇𝐈 𝐀𝐓𝐓𝐈𝐕𝐎 📛');

  if (!args[0]) {
    pendingModeChoice.set(chat, sender);
    await conn.sendMessage(chat, {
      text: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐥𝐚 𝐦𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐝𝐢 𝐠𝐢𝐨𝐜𝐨:',
      footer: '𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐡𝐚 𝐚𝐯𝐯𝐢𝐚𝐭𝐨 𝐩𝐮𝐨̀ 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞',
      buttons: [
        { buttonId: '.akinator anime', buttonText:{ displayText:'𝐀𝐧𝐢𝐦𝐞 🌀' }, type:1 },
        { buttonId: '.akinator generale', buttonText:{ displayText:'𝐆𝐞𝐧𝐞𝐫𝐚𝐥𝐞 🎲' }, type:1 }
      ],
      headerType:1
    });
    return;
  }

  if (!pendingModeChoice.has(chat) || pendingModeChoice.get(chat)!==sender) {
    return m.reply('𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐡𝐚 𝐚𝐯𝐯𝐢𝐚𝐭𝐨 𝐩𝐮𝐨̀ 𝐠𝐢𝐨𝐜𝐚𝐫𝐞.');
  }

  const mode = args[0];
  const characters = mode==='anime'? personaggiAnime : personaggiGenerali;

  const game = {
    player: sender,
    chat,
    characters,
    index: 0
  };

  activeGames.set(chat, game);
  pendingModeChoice.delete(chat);

  inviaDomanda(conn, game);
};

async function inviaDomanda(conn, game) {
  if (game.index >= game.characters.length) {
    const cand = game.characters[Math.floor(Math.random()*game.characters.length)];
    activeGames.delete(game.chat);
    return conn.sendMessage(game.chat,{ text:`𝐇𝐨 𝐢𝐧𝐝𝐨𝐯𝐢𝐧𝐚𝐭𝐨 🎉 𝐄̀ ${cand.nome} (${cand.serie||'Generale'})` });
  }

  const p = game.characters[game.index];
  const domanda = p.domande[Math.floor(Math.random()*p.domande.length)];
  await conn.sendMessage(game.chat,{
    text:`❓ 𝐃𝐨𝐦𝐚𝐧𝐝𝐚: ${domanda}\n𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐜𝐨𝐧: 𝐬𝐢 / 𝐧𝐨 / 𝐟𝐨𝐫𝐬𝐞 / 𝐧𝐨𝐧 𝐬𝐨`
  });
}

handler.before = async (m, { conn }) => {
  const chat = m.chat;
  if (!activeGames.has(chat)) return;

  const game = activeGames.get(chat);
  if (m.sender !== game.player) return;

  const risposta = (m.text||'').toLowerCase();
  const p = game.characters[game.index];

  if (['Si','si'].includes(risposta)) {
    game.characters = game.characters.filter(c => c.domande.includes(p.domande[0]));
  } else if (['No','no'].includes(risposta)) {
    game.characters = game.characters.filter(c => !c.domande.includes(p.domande[0]));
  }

  game.index++;
  inviaDomanda(conn, game);
};

handler.help = ['akinator'];
handler.tags = ['giochi'];
handler.command = ['akinator'];

export default handler;