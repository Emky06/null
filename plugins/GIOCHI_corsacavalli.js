//Plugin "Corsa dei cavalli" creato da Axtral_WiZaRd

let handler = async (m, { conn, command, args, usedPrefix, participants, isGroup }) => {
  if (!m.isGroup) return m.reply("❌ Questo comando funziona solo nei gruppi.");

  global.db.data.corse = global.db.data.corse || {};
  const chatId = m.chat;
  global.db.data.corse[chatId] = global.db.data.corse[chatId] || {
    squadre: {},
    cavalli: ['Pioggia', 'Tempesta', 'Furia', 'Saetta', 'Spirit'],
    cavalliScelti: {},
    puntate: {},
    ultimaCorsa: 0,
    partitaInCorso: false,
    salvataggi: {},
  };

  let corsa = global.db.data.corse[chatId];
  const user = m.sender;

  switch (command) {
case "creasquadra": { 
  let nomeMatch = m.text.match(/"([^"]+)"/); 
  if (!nomeMatch) return m.reply('❌ Specifica un nome per la squadra tra virgolette, es: .creasquadra "I Fulmini" @utente1 @utente2'); 
  let nomeSquadra = nomeMatch[1].trim(); 
  if (nomeSquadra.length > 20) return m.reply("❌ Il nome della squadra deve essere lungo al massimo 20 caratteri."); 
  let mentions = [...new Set(m.mentionedJid)]; 
  if (mentions.length === 0) mentions = []; 
  if (mentions.length > 2) return m.reply("❌ Puoi avere al massimo 2 persone nella squadra (3 membri totali)."); 
  let membri = [user, ...mentions]; 
  // Controlla che nessuno sia già in una squadra 
  for (let membro of membri) { 
    if (Object.values(corsa.squadre).some(s => s.membri.includes(membro))) { 
      return m.reply("❌ Uno dei membri è già in una squadra."); 
    } 
  } 
  if (Object.keys(corsa.squadre).length >= 3) return m.reply("❌ Sono già presenti 3 squadre."); 
  // Verifica se il nome è già usato da un altro utente 
  if (corsa.salvataggi[nomeSquadra] && corsa.salvataggi[nomeSquadra].proprietario !== user) { 
    return m.reply("❌ Questo nome squadra è stato usato da un altro giocatore e non puoi riutilizzarlo."); 
  } 
  // Usa il portafoglio salvato, anche se è 0, altrimenti 10.000 
  let portafoglio = corsa.salvataggi[nomeSquadra]?.portafoglio ?? 10000; 
  corsa.squadre[nomeSquadra] = { membri, portafoglio, cavallo: null }; 
  corsa.salvataggi[nomeSquadra] = { membri, portafoglio, proprietario: user }; 
  let portafoglioFormatted = portafoglio.toLocaleString("it-IT"); 
  let taggati;
  if (mentions.length === 0) {
    m.reply(`✅ Squadra *${nomeSquadra}* creata\n💰 Portafoglio: *${portafoglioFormatted}€*`);
  } else {
    taggati = membri 
      .filter((u, i) => membri.indexOf(u) === i) 
      .map(u => `@${u.split("@")[0]}`) 
      .join(" e "); 
    m.reply(`✅ Squadra *${nomeSquadra}* creata con ${taggati}\n💰 Portafoglio: *${portafoglioFormatted}€*`, null, { mentions: membri });
  }
  break; 
}

    case "psquadre": {
      let testo = '*Portafogli delle squadre:*\n';
      for (let [nome, s] of Object.entries(corsa.squadre)) {
        testo += `- *${nome}*: ${s.portafoglio.toLocaleString()} €\n`;
      }
      m.reply(testo);
      break;
    }

    case "squadre": {
      let testo = '*Squadre attuali:*\n';
      for (let [nome, s] of Object.entries(corsa.squadre)) {
        let membri = s.membri.map(u => `@${u.split("@")[0]}`).join(", ");
        let cavallo = s.cavallo ? s.cavallo : "(non scelto)";
        testo += `\n*${nome}* → ${membri}\nCavallo: *${cavallo}*\n`;
      }
      m.reply(testo, null, { mentions: participants.map(p => p.id) });
      break;
    }

    case "cavalli": {
  const emoji = {
    "Pioggia": "🐎🌧️",
    "Tempesta": "🐎⛈️",
    "Furia": "🐎😈",
    "Saetta": "🐎⚡",
    "Spirit": "🐎🐴"
  };

  const cavalliOccupati = Object.values(corsa.squadre).map(s => s.cavallo).filter(Boolean);
  const lista = corsa.cavalli.map(c => {
    let simbolo = emoji[c] || "🐎";
    return cavalliOccupati.includes(c) ? `- ~${simbolo} ${c}~` : `- ${simbolo} ${c}`;
  }).join("\n");

  m.reply(`*Cavalli disponibili:*\n${lista}`);
  break;
}

    case "cavallo": {
  if (args.length < 2) return m.reply("❌ Usa il comando così: .cavallo Fulmine 1000");

  let cavalloScelto = args[0].toLowerCase();
  let cavalloOriginale = corsa.cavalli.find(c => c.toLowerCase() === cavalloScelto);
  if (!cavalloOriginale) return m.reply("❌ Cavallo non valido. Usa .cavalli per vedere quelli disponibili.");

  let importo = parseInt(args[1]);
  if (isNaN(importo) || importo <= 0) return m.reply("❌ Inserisci un importo valido per la puntata.");

  let squadra = Object.values(corsa.squadre).find(s => s.membri.includes(user));
  if (!squadra) return m.reply("❌ Non fai parte di nessuna squadra.");

  if (corsa.inCorso) return m.reply("❌ La corsa è già in corso, non puoi cambiare cavallo o puntata.");

  // Controllo se il cavallo è già stato scelto da un'altra squadra
  if (Object.values(corsa.squadre).some(s => s.cavallo === cavalloOriginale && s !== squadra)) {
    return m.reply(`❌ Il cavallo *${cavalloOriginale}* è già stato scelto da un'altra squadra.`);
  }

  let vecchioCavallo = squadra.cavallo;
  let vecchiaPuntata = 0;

  // Se ha già puntato prima, rimborsa la vecchia puntata
  if (vecchioCavallo) {
    vecchiaPuntata = corsa.puntate[vecchioCavallo] || 0;
    squadra.portafoglio += vecchiaPuntata;
    corsa.puntate[vecchioCavallo] -= vecchiaPuntata;
    if (corsa.puntate[vecchioCavallo] <= 0) delete corsa.puntate[vecchioCavallo];
  }

  // Restituisce i soldi delle puntate precedenti se sono stati azzerati
  if (Object.keys(corsa.puntate).length === 0) {
    // Se tutte le puntate sono azzerate, restituisce i soldi alle squadre
    Object.entries(corsa.squadre).forEach(([nomeSquadra, squadraRestituita]) => {
      if (squadraRestituita.cavallo) {
        squadraRestituita.portafoglio += corsa.puntate[squadraRestituita.cavallo] || 0;
      }
    });
  }

  // Controlla se ha soldi sufficienti dopo il rimborso
  if (squadra.portafoglio < importo) return m.reply("❌ La tua squadra non ha abbastanza soldi per questa puntata.");

  squadra.cavallo = cavalloOriginale;
  squadra.portafoglio -= importo;
  corsa.puntate[cavalloOriginale] = (corsa.puntate[cavalloOriginale] || 0) + importo;

  // Se la squadra ha cambiato cavallo, mostra il messaggio di "Puntata aggiornata"
  let risposta = vecchioCavallo && vecchioCavallo !== cavalloOriginale
    ? `✅ Puntata aggiornata sul cavallo *${cavalloOriginale}* a *${importo.toLocaleString()} €*.`
    : `✅ La tua squadra ha scelto il cavallo *${cavalloOriginale}* e puntato *${importo.toLocaleString()} €*.`;

  m.reply(risposta);
  break;
}
    
    case "puntate": {
  if (Object.keys(corsa.puntate).length === 0) return m.reply("🎲 Nessuna puntata effettuata.");

  let testo = "*Puntate attuali:*\n";
  for (let cavallo of corsa.cavalli) {
    let totale = corsa.puntate[cavallo] || 0;
    testo += `- ${cavallo}: ${totale.toLocaleString()} €\n`;
  }
  m.reply(testo);
  break;
}

    case "avviacorsa": {
    // Controlla che l'utente sia admin
const isAdmin = participants.some(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'));

if (!isAdmin) {
  return m.reply("❌ Solo gli admin possono usare questo comando.");
}
  if (corsa.partitaInCorso) return m.reply("⚠️ Una partita è già in corso!");

  // Controllo che sia passato almeno 60 minuti (1 ora) dall'ultima corsa
  if (new Date().getTime() - corsa.ultimaCorsa < 3600000) {
    let tempoRimanente = Math.ceil((3600000 - (new Date().getTime() - corsa.ultimaCorsa)) / 1000);
    let minutiRimanenti = Math.floor(tempoRimanente / 60);
    let secondiRimanenti = tempoRimanente % 60;

    return m.reply(`❌ Devi aspettare ancora ${minutiRimanente} minuti e ${secondiRimanenti} secondi prima di poter avviare un'altra gara.`);
  }

  if (Object.values(corsa.squadre).some(s => !s.cavallo)) return m.reply("❌ Tutte le squadre devono scegliere un cavallo.");

  corsa.partitaInCorso = true;
  corsa.ultimaCorsa = new Date().getTime();

  m.reply("🏁🏇🏻 La corsa sta per iniziare... La gara durerà 10 secondi!");

  // Frasi di telecronaca per ogni fase
  const telecronaca = {
    2000: [
      "📣 I cavalli scattano dalla linea di partenza!",
      "🏇🏻 Partiti! Tutti i cavalli sembrano agguerriti!",
      "🔥 È subito bagarre in pista!"
    ],
    4000: [
      "💨 Alcuni cavalli prendono velocità!",
      "🎯 Corsa serrata, nessuno molla un centimetro!",
      "⚔️ È una lotta punto a punto!"
    ],
    6000: [
      "⚡️ Un cavallo tenta il sorpasso!",
      "🚀 Che sprint! Si stacca dal gruppo!",
      "🤯 Pubblico in delirio per questa corsa incredibile!"
    ],
    8000: [
      "🥵 Ultimi metri! Chi taglierà il traguardo per primo?!",
      "😱 È un testa a testa mozzafiato!",
      "🏁 Tutto si deciderà all'ultimo secondo!"
    ]
  };

  // Funzione per scegliere una frase casuale
  function fraseCasuale(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  // Invia messaggi di telecronaca in momenti diversi
  for (let tempo in telecronaca) {
    setTimeout(() => {
      m.reply(fraseCasuale(telecronaca[tempo]));
    }, Number(tempo));
  }

  // Timer di 10 secondi per il risultato finale
  setTimeout(() => {
    // Genera una classifica casuale dei cavalli
    let classifica = [...corsa.cavalli];
    for (let i = classifica.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [classifica[i], classifica[j]] = [classifica[j], classifica[i]];
    }

    let vincitore = classifica[0];
    let squadraVincente = Object.entries(corsa.squadre).find(([_, s]) => s.cavallo === vincitore);

    if (squadraVincente) {
      let soldiVinti = Object.values(corsa.puntate).reduce((a, b) => a + b, 0);
      squadraVincente[1].portafoglio += soldiVinti;
      m.reply(`✨ Il cavallo 🐎 *${vincitore}* ha vinto! La squadra *${squadraVincente[0]}* guadagna ${soldiVinti.toLocaleString()} €💶!`);
    } else {
      m.reply(`☠️ Il cavallo 🐎 *${vincitore}* ha vinto ma nessuna squadra l'aveva scelto. Tutte le squadre perdono la scommessa.`);
    }

    // Mostra la classifica finale
    let messaggioClassifica = "📊 Classifica finale:\n";
    classifica.forEach((cavallo, index) => {
      const posizioni = ["🥇", "🥈", "🥉"];
      const posizione = posizioni[index] || `${index + 1}º`;
      messaggioClassifica += `${posizione} ${cavallo}\n`;
    });
    m.reply(messaggioClassifica);

    // Reset della corsa
    corsa.partitaInCorso = false;
    corsa.puntate = {};
    for (let s of Object.values(corsa.squadre)) s.cavallo = null;
  }, 10000); // 10 secondi

  break;
}

case "azzerasquadre": {
// Controlla che l'utente sia admin
const isAdmin = participants.some(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'));

if (!isAdmin) {
  return m.reply("❌ Solo gli admin possono usare questo comando.");
}
  // Azzeriamo solo le squadre, ma non i salvataggi
  for (let nomeSquadra of Object.keys(corsa.squadre)) {
    let squadra = corsa.squadre[nomeSquadra];
    
    // Se il salvataggio esiste già, mantieni il proprietario
    let proprietario = corsa.salvataggi[nomeSquadra]?.proprietario || squadra.membri[0];

    corsa.salvataggi[nomeSquadra] = {
      membri: squadra.membri,
      portafoglio: squadra.portafoglio,
      proprietario
    };
  }

  corsa.squadre = {};
  m.reply("✅ Tutte le squadre sono state azzerate. Puoi crearne di nuove.");
  break;
}

case "resetcorsa": {
// Controlla che l'utente sia admin
const isAdmin = participants.some(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'));

if (!isAdmin) {
  return m.reply("❌ Solo gli admin possono usare questo comando.");
}
  
  delete global.db.data.corse[chatId];
  m.reply("✅ Corsa resettata. Ora i nuovi cavalli sono attivi.");
  break;
}

   case "azzerapuntate": {
  // Controlla che l'utente sia admin
const isAdmin = participants.some(p => p.id === m.sender && (p.admin === 'admin' || p.admin === 'superadmin'));

if (!isAdmin) {
  return m.reply("❌ Solo gli admin possono usare questo comando.");
}

  // Azzerare le puntate e restituire i soldi alle squadre
  for (let [cavallo, puntata] of Object.entries(corsa.puntate)) {
    // Restituire i soldi alle squadre che avevano puntato
    for (let [nomeSquadra, squadra] of Object.entries(corsa.squadre)) {
      if (squadra.cavallo === cavallo) {
        squadra.portafoglio += puntata;  // Aggiungi la puntata al portafoglio della squadra
        break;  // Esci dal ciclo una volta che trovi la squadra che ha puntato
      }
    }
  }

  // Azzerare le puntate
  corsa.puntate = {};

  m.reply("✅ Le puntate sono state azzerate e i soldi sono stati restituiti alle squadre.");
  break;
}

     case "cavallisquadre": {
      let testo = '*Cavalli scelti dalle squadre:*\n';
      for (let [nome, s] of Object.entries(corsa.squadre)) {
        let cavallo = s.cavallo ? s.cavallo : "(non scelto)";
        testo += `\n*${nome}* → Cavallo: *${cavallo}*\n`;
      }
      m.reply(testo);
      break;
    }

    case "lav": {
  let squadra = Object.values(corsa.squadre).find(s => s.membri.includes(user));
  if (!squadra) return m.reply("❌ Non fai parte di nessuna squadra.");

  const now = Date.now();
  const cooldown = 10 * 60 * 1000; // 10 minuti in millisecondi

  if (!corsa.ultimiLavori) corsa.ultimiLavori = {};
  const ultimoLavoro = corsa.ultimiLavori[user] || 0;

  const tempoRimanente = cooldown - (now - ultimoLavoro);
  if (tempoRimanente > 0) {
    let minuti = Math.floor(tempoRimanente / 60000);
    let secondi = Math.floor((tempoRimanente % 60000) / 1000);
    return m.reply(`⏳ Devi aspettare ancora ${minuti}m ${secondi}s prima di fare un altro lavoro.`);
  }

  corsa.ultimiLavori[user] = now;
  squadra.portafoglio += 1500;
  m.reply(`💼 Hai lavorato duramente e guadagnato 1.500 €!\nPortafoglio attuale: ${squadra.portafoglio.toLocaleString()} €.`);
  break;
}

    default:
      m.reply("❓ Comando non riconosciuto.");
  }
};

function arrayUguali(a1, a2) {
  return JSON.stringify(a1) === JSON.stringify(a2);
}

handler.command = /^(creasquadra|psquadre|puntate|squadre|cavalli|cavallo|avviacorsa|azzerasquadre|cavallisquadre|resetcorsa|azzerapuntate|lav)$/i;
handler.group = true;

export default handler;