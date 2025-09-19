const livelli = [
  { nome: "Pollo", soglia: 0 },
  { nome: "Apprendista", soglia: 1000 },
  { nome: "Allievo", soglia: 2000 },
  { nome: "Incantatore", soglia: 5000 },
  { nome: "Maestro Runico", soglia: 8000 },
  { nome: "Custode del Sigillo", soglia: 12000 },
  { nome: "Dominatore", soglia: 18000 },
  { nome: "Veggente Cosmico", soglia: 25000 },
  { nome: "Eterno", soglia: 30000 },
  { nome: "Divino", soglia: 35000 },
  { nome: "Creatore dei mondi", soglia: 40000 },
  { nome: "Astrale", soglia: 50000 }
];

function getGrado(messaggi) {
  return livelli.findLast(l => messaggi >= l.soglia) || livelli[0];
}

export async function before(m) {
  const user = global.db.data.users[m.sender];
  if (!user) return;

  if (user.messaggi == null) user.messaggi = 0;
  if (user.money == null) user.money = 0;
  if (user.grado == null) user.grado = "Pollo";

  user.messaggi += 1;

  const gradoAttuale = livelli.find(l => l.nome === user.grado) || livelli[0];
  const nuovoGrado = getGrado(user.messaggi);

  if (gradoAttuale.nome !== nuovoGrado.nome) {
    const reward = Math.floor(nuovoGrado.soglia / 2);
    user.money += reward;
    user.grado = nuovoGrado.nome;

    let milestoneMessage = {
      key: {
        participants: "0@s.whatsapp.net",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: `🎉 𝐍𝐮𝐨𝐯𝐨 𝐨𝐛𝐛𝐢𝐞𝐭𝐭𝐢𝐯𝐨`,
          jpegThumbnail: await (await import('fs').then(fs => fs.promises.readFile('icone/gradi.png'))),
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: "0@s.whatsapp.net"
    };

    conn.reply(
      m.chat,
      `🎉 *@${m.sender.split('@')[0]}*\nHai raggiunto il grado *${nuovoGrado.nome}* con *${user.messaggi}* messaggi.\n💰 Hai ottenuto *${reward}€*!`,
      milestoneMessage,
      { mentions: [m.sender] }
    );
  }
}