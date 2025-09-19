const handlerNominaHelp = async (m, { conn }) => {
  const text = (m.text || '').trim();
  if (!text.toLowerCase().startsWith('.helpnomina')) return;

  const args = text.split(/\s+/);
  if (args.length === 1) {
    // Solo .nomina senza argomenti: mostro la guida
    return conn.reply(
      m.chat,
      '✏️ Per rinominare un animale usa:\n.nomina [numero animale] [nuovo nome]\n\nEsempio:\n.nomina 1 Zeus',
      m
    );
  }
  // Se ci sono argomenti, passa il messaggio al plugin che gestisce la rinomina
};

handlerNominaHelp.command = /^helpnomina$/i;
handlerNominaHelp.exp = 0;
export default handlerNominaHelp;