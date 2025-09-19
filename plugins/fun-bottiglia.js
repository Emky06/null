let user = a => '@' + a.split('@')[0]; // Per taggare l'utente

let handler = async (m, { conn, command, groupMetadata }) => {
  const members = groupMetadata.participants.map(u => u.id);

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const obblighi = [
    'Fai una dichiarazione d\'amore esagerata a un membro a tua scelta.',
    'Manda un vocale in cui canti una canzone stonando apposta.',
    'Scrivi una poesia improvvisata per la persona che ti taggheremo.',
    'Manda una foto buffa presa dalla tua galleria.',
    'Fingi di essere un influencer e promuovi una banana come se fosse il prodotto dell\'anno.',
    'Fai una finta proposta di matrimonio a qualcuno del gruppo.',
    'Mima un animale a scelta in vocale per 30 secondi.',
    'Racconta una barzelletta terribile e ridici da solo/a.',
    'Scrivi un messaggio romantico... ma solo usando emoji.',
    'Simula un pianto disperato in vocale come se avessi perso il tuo peluche preferito.'
  ];

  const verità = [
    'Chi è il tuo segreto crush del gruppo (se ce l\'hai)?',
    'Qual è stata la figuraccia più grande che hai fatto?',
    'Hai mai mandato un messaggio imbarazzante alla persona sbagliata? Racconta.',
    'Se potessi scambiare la vita con qualcuno del gruppo per un giorno, chi sarebbe?',
    'Qual è la cosa più strana che hai cercato su Google?',
    'Hai mai inventato una scusa assurda per non uscire? Racconta.',
    'Qual è il soprannome più assurdo che ti hanno dato?',
    'Se dovessi partire per un\'isola deserta con uno del gruppo, chi sceglieresti?',
    'Qual è il talento inutile di cui vai più fiero?',
    'Se potessi essere invisibile per un giorno, cosa faresti per primo?'
  ];

  const scelto = pickRandom(members);
  
  if (command === 'bottiglia') {
    const scelta = pickRandom(['obbligo', 'verità']);
    const contenuto = scelta === 'obbligo' ? pickRandom(obblighi) : pickRandom(verità);

    conn.reply(
      m.chat,
      `🎉 *Gioco della Bottiglia* 🎉\n\nLa bottiglia punta a ${user(scelto)}!\n\n🔹 Tipo: *${scelta.toUpperCase()}*\n🔸 Obbligo/Verità: ${contenuto}`,
      null,
      { mentions: [scelto] }
    );
  }
};

handler.command = ['bottiglia'];
handler.group = true;
export default handler;