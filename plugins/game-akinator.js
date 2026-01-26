import { personaggiAnime } from './anime.js';
import { personaggiGenerali } from './generale.js';

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
      text: 'Scegli la modalità di gioco:',
      footer: 'Solo chi ha avviato può rispondere',
      buttons: [
        { buttonId: '.akinator anime', buttonText:{ displayText:'Anime' }, type:1 },
        { buttonId: '.akinator generale', buttonText:{ displayText:'Generale' }, type:1 }
      ],
      headerType:1
    });
    return;
  }

  if (!pendingModeChoice.has(chat) || pendingModeChoice.get(chat)!==sender) {
    return m.reply('Solo chi ha avviato può giocare.');
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
    return conn.sendMessage(game.chat,{ text:`Ho indovinato! È ${cand.nome} (${cand.serie||'Generale'})` });
  }

  const p = game.characters[game.index];
  const domanda = p.domande[Math.floor(Math.random()*p.domande.length)];
  await conn.sendMessage(game.chat,{
    text:`Domanda: ${domanda}\nRispondi: sì / no / forse / non so`
  });
}

handler.before = async (m, { conn }) => {
  const chat = m.chat;
  if (!activeGames.has(chat)) return;

  const game = activeGames.get(chat);
  if (m.sender !== game.player) return;

  const risposta = (m.text||'').toLowerCase();
  const p = game.characters[game.index];

  if (['sì','si'].includes(risposta)) {
    game.characters = game.characters.filter(c => c.domande.includes(p.domande[0]));
  } else if (['no'].includes(risposta)) {
    game.characters = game.characters.filter(c => !c.domande.includes(p.domande[0]));
  }

  game.index++;
  inviaDomanda(conn, game);
};

handler.help = ['akinator'];
handler.tags = ['giochi'];
handler.command = ['akinator'];
handler.register = false;

export default handler;