import { personaggiAnime } from './akinator-anime.js';
import { personaggiGenerali } from './akinator-generali.js';

const activeGames = new Map();
const pendingModeChoice = new Map();
const MAX_DOMANDE = 15;

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
    return m.reply('⚠️ Lista dei personaggi vuota!');
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
  if (game.index >= MAX_DOMANDE) {
    // Calcolo del personaggio più probabile
    let maxScore = -1;
    let candidato = game.characters[0];
    for (let c of game.characters) {
      let score = 0;
      for (let r of game.risposte) {
        if (c.domande.includes(r.domanda) && ['si','sì'].includes(r.risposta)) score++;
        else if (!c.domande.includes(r.domanda) && ['no'].includes(r.risposta)) score++;
        // forse e non so non cambiano lo score
      }
      if (score > maxScore) {
        maxScore = score;
        candidato = c;
      }
    }

    activeGames.delete(game.chat);
    return conn.sendMessage(game.chat, { 
      text: `🎉 Ho indovinato! È ${candidato.nome || 'Sconosciuto'} (${candidato.serie || 'Generale'})` 
    });
  }

  const p = game.characters[game.index % game.characters.length];
  const domanda = p.domande[Math.floor(Math.random()*p.domande.length)];
  await conn.sendMessage(game.chat,{
    text:`❓ Domanda ${game.index+1} di ${MAX_DOMANDE}: ${domanda}\nRispondi con: sì / no / forse / non so`
  });
}

handler.before = async (m, { conn }) => {
  const chat = m.chat;
  if (!activeGames.has(chat)) return;

  const game = activeGames.get(chat);
  if (m.sender !== game.player) return;

  const risposta = (m.text || '').toLowerCase();
  const p = game.characters[game.index % game.characters.length];

  if (!['si','sì','no','forse','probabilmente','non so','nonso'].includes(risposta)) {
    return conn.reply(game.chat,'⚠️ Risposta non valida! Rispondi con: sì / no / forse / non so');
  }

  // Salva la risposta
  game.risposte.push({ domanda: p.domande[0], risposta });

  game.index++;
  inviaDomanda(conn, game);
};

handler.help = ['akinator'];
handler.tags = ['giochi'];
handler.command = ['akinator'];

export default handler;