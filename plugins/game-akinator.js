import { personaggiAnime } from './akinator-anime.js';
import { personaggiGenerali } from './akinator-generali.js';

const activeGames = new Map();
const pendingModeChoice = new Map();
const MAX_DOMANDE = 20;

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
        { buttonId: '.akinator generale', buttonText:{ displayText:'𝐆𝐞𝐧𝐞𝐫𝐚𝐥 🎲' }, type:1 }
      ],
      headerType:1
    });
    return;
  }

  if (!pendingModeChoice.has(chat) || pendingModeChoice.get(chat)!==sender) {
    return m.reply('𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐡𝐚 𝐚𝐯𝐯𝐢𝐚𝐭𝐨 𝐩𝐮𝐨̀ 𝐠𝐢𝐨𝐜𝐚𝐫𝐞.');
  }

  const mode = args[0].toLowerCase();
  const characters = mode==='anime'? personaggiAnime : personaggiGenerali;

  if (!characters || characters.length === 0) {
    return m.reply('⚠️ 𝐋𝐢𝐬𝐭𝐚 𝐝𝐞𝐢 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐠𝐠𝐢 𝐯𝐮𝐨𝐭𝐚!');
  }

  const game = {
    player: sender,
    chat,
    characters: [...characters],
    index: 0,
    risposte: []
  };

  activeGames.set(chat, game);
  pendingModeChoice.delete(chat);

  inviaDomanda(conn, game);
};

async function inviaDomanda(conn, game) {
  const p = game.characters[game.index % game.characters.length];
  p.domandeFatete = p.domandeFatete || [];
  const domandeDisponibili = p.domande.filter(d => !p.domandeFatete.includes(d));
  let domanda;
  if (domandeDisponibili.length > 0) {
    domanda = domandeDisponibili[Math.floor(Math.random() * domandeDisponibili.length)];
    p.domandeFatete.push(domanda);
  } else {
    domanda = p.domande[Math.floor(Math.random() * p.domande.length)];
  }
  await conn.sendMessage(game.chat,{
    text:`❓ 𝐃𝐨𝐦𝐚𝐧𝐝𝐚 ${game.index+1}: ${domanda}\n𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐜𝐨𝐧: sì / no / forse / non so`
  });
}

handler.before = async (m, { conn }) => {
  const chat = m.chat;
  if (!activeGames.has(chat)) return;

  const game = activeGames.get(chat);
  if (m.sender !== game.player) return;

  const risposta = (m.text || '').toLowerCase();

  if (risposta === '.akinator indovina') {
    let maxScore = -1;
    let candidato = game.characters[0];
    for (let c of game.characters) {
      let score = 0;
      for (let r of game.risposte) {
        if (c.domande.includes(r.domanda) && ['si','sì'].includes(r.risposta)) score++;
        else if (!c.domande.includes(r.domanda) && ['no'].includes(r.risposta)) score++;
      }
      if (score > maxScore) {
        maxScore = score;
        candidato = c;
      }
    }
    activeGames.delete(chat);
    return conn.sendMessage(chat, { 
      text: `🎉 𝐇𝐨 𝐢𝐧𝐝𝐨𝐯𝐢𝐧𝐚𝐭𝐨! 𝐄̀ ${candidato.nome || 'Sconosciuto'} (${candidato.serie || 'Generale'})`
    });
  }

  if (!['si','sì','no','forse','probabilmente','non so','nonso'].includes(risposta)) {
    return conn.reply(game.chat,'⚠️ 𝐑𝐢𝐬𝐩𝐨𝐬𝐭𝐚 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚! 𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐜𝐨𝐧: sì / no / forse / non so oppure .akinator indovina');
  }

  const p = game.characters[game.index % game.characters.length];
  game.risposte.push({ domanda: p.domande[0], risposta });

  game.index++;
  inviaDomanda(conn, game);
};

handler.help = ['akinator'];
handler.tags = ['giochi'];
handler.command = ['akinator'];

export default handler;