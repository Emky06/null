// Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command }) => {
  if (command === 'corsacavalli') {
    let messaggio = `
*🏇Gioco "Corsa dei Cavalli"🏇🏻*
━━━━━━━━━━━━━━━━━━━━━
•👥🔁 *.creasquadra "Nome" @utente1 @utente2*  
  Crea una squadra con 1-3 membri. Se non tagghi nessuno, sarai da solo nella squadra.
━━━━━━━━━━━━━━━━━━━━━
•👥 *.squadre*  
  Mostra le squadre create e i membri con il cavallo scelto.
━━━━━━━━━━━━━━━━━━━━━
•👛👥 *.psquadre*  
  Mostra i portafogli delle squadre.
━━━━━━━━━━━━━━━━━━━━━
•🐎 *.cavalli*  
  Elenca i cavalli disponibili con le emoji (se presenti).
━━━━━━━━━━━━━━━━━━━━━
•🐎💰 *.cavallo Nome Importo*  
  Scegli un cavallo e piazza una scommessa (es: .cavallo Saetta 1000).
━━━━━━━━━━━━━━━━━━━━━
•💶 *.puntate*  
  Mostra tutte le scommesse effettuate sui cavalli.
━━━━━━━━━━━━━━━━━━━━━
•🐎👥 *.cavallisquadre*  
  Mostra quale cavallo ha scelto ogni squadra.
━━━━━━━━━━━━━━━━━━━━━
•🏁 *.avviacorsa* (admin)
  Avvia la gara (una ogni 60 minuti). Il cavallo vincente sarà scelto casualmente.
━━━━━━━━━━━━━━━━━━━━━
•⚒️ *.lav*  
  Guadagna 1500€ per la tua squadra (una volta ogni 10 minuti).
━━━━━━━━━━━━━━━━━━━━━
•🔄 *.azzerasquadre* (admin)
  Elimina tutte le squadre (ma NON il portafoglio salvato).
  ━━━━━━━━━━━━━━━━━━━━
•🔄 *.azzerapuntate* (admin)
  Elimina tutte le puntate e ritorna i soldi alle squadre.
  ━━━━━━━━━━━━━━━━━━━━
•🔄 *.resetcorsa* (admin)
  Elimina tutti i dati salvati (squadre e soldi).

`.trim();

    m.reply(messaggio);
  }
};

handler.command = /^(corsacavalli)$/i;

export default handler;