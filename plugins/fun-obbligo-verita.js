//Plugin fatto da Axtral_WiZaRd
let user = a => '@' + a.split('@')[0];

let handler = async (m, { conn, command }) => {
  const pickRandom = list => list[Math.floor(Math.random() * list.length)];
  let mentionedJid = m.mentionedJid?.[0];

  if (!mentionedJid) {
    return conn.reply(m.chat, 'Devi taggare una persona per usare questo comando.', m);
  }

  let obblighi = [
    'Fai 10 flessioni e manda il video.',
    'Manda un audio cantando una canzone a caso a squarciagola.',
    'Fai una foto con il miglior sorriso finto che riesci a fare.',
    'Dichiara il tuo amore eterno a qualcuno del gruppo a caso.',
    'Scrivi nel gruppo usando solo maiuscole per 5 minuti.',
    'Racconta una barzelletta terribile.',
    'Fai finta di essere un venditore e prova a vendere qualcosa di assurdo.',
    'Cambia la tua foto profilo con una foto buffa per 1 ora.',
    'Metti un nickname ridicolo a te stesso nel gruppo per 1 ora.',
    'Imita un animale a scelta in vocale.',
    'Manda una foto facendo una posa da modello/a.',
    'Rispondi a ogni messaggio solo con emoji per 10 minuti.',
    'Recita una poesia inventata sul momento in vocale.',
    'Fai la dichiarazione più romantica che ti viene in mente a un membro casuale.',
    'Scrivi nel gruppo un tuo segreto (non troppo serio!).',
    'Fai un selfie con un oggetto strano in mano.',
    'Fingi di essere una celebrità per 5 minuti.',
    'Manda una foto di quello che hai ai piedi in questo momento.',
    'Prova a parlare senza vocali per 5 messaggi consecutivi.',
    'Manda un audio dove parli come un robot.',
    'Invita qualcuno a una finta cena romantica nel gruppo.',
    'Canta l\'inno nazionale in vocale come se fossi ubriaco.',
    'Fai una dichiarazione di guerra a un membro a caso (in modo scherzoso).',
    'Descrivi la tua ultima foto della galleria senza mostrarla.',
    'Scrivi una frase in cui ogni parola comincia con la stessa lettera.',
    'Manda una foto con il primo oggetto che hai sulla scrivania.',
    'Canta una canzone usando solo versi di animali.',
    'Scrivi nel gruppo come se fossi un personaggio medievale per 10 minuti.',
    'Fai il tuo miglior urlo da film horror in vocale.',
    'Manda una foto facendo la faccia più buffa che puoi.'
  ];

  let verita = [
    'Qual è stato il tuo momento più imbarazzante di sempre?',
    'Hai mai detto una bugia importante? Quale?',
    'Chi è il tuo crush famoso?',
    'Qual è la cosa più strana che sai fare?',
    'Se potessi essere invisibile per un giorno, cosa faresti?',
    'Hai mai fatto qualcosa di stupido per impressionare qualcuno?',
    'Qual è il tuo talento nascosto?',
    'Se potessi mangiare solo un cibo per il resto della tua vita, quale sarebbe?',
    'Qual è il sogno più strano che hai mai fatto?',
    'Qual è stata la tua figuraccia più epica?',
    'Hai mai preso una cotta per un professore o una professoressa?',
    'Se potessi viaggiare nel tempo, in che epoca andresti?',
    'Qual è la bugia più assurda che hai detto ai tuoi genitori?',
    'Qual è la cosa più coraggiosa che hai fatto?',
    'Hai mai mandato un messaggio alla persona sbagliata? Racconta!',
    'Qual è l\'ultima cosa che hai cercato su Google?',
    'Qual è un obiettivo che vuoi assolutamente raggiungere?',
    'Se potessi scambiare vita con qualcuno per un giorno, chi sarebbe?',
    'Qual è stato il tuo più grande fail in cucina?',
    'Se vincessi alla lotteria oggi, qual è la prima cosa che compreresti?',
    'Qual è il posto più strano dove ti sei addormentato?',
    'Se potessi essere un animale per un giorno, quale saresti?',
    'Cosa ti imbarazza di più in pubblico?',
    'Hai mai fatto finta di essere malato per evitare qualcosa?',
    'Qual è il tuo più grande sogno segreto?',
    'Hai mai avuto un colpo di fulmine?',
    'Qual è una cosa che nessuno sa di te?',
    'Chi è la persona del gruppo che ti fa più ridere?',
    'Se potessi scegliere un superpotere, quale vorresti?',
    'Qual è la cosa più folle che faresti per soldi?'
  ];

  let testo = command === 'obbligo' ? pickRandom(obblighi) : pickRandom(verita);

  let messaggio = `════════ ೋೋ ════════
*${command.charAt(0).toUpperCase() + command.slice(1)} per ${user(mentionedJid)}:*
${testo}
════════ ೋೋ ════════`;

  await conn.sendMessage(m.chat, {
    text: messaggio,
    mentions: [mentionedJid]
  }, { quoted: m });
};

handler.command = ['obbligo', 'verita'];
handler.group = true;

export default handler;