//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';
import path from 'path';


const dbPath = path.join(process.cwd(), 'storage', 'file-json', 'nukeGroups.json');

function loadDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(dbPath));
  } catch (e) {
    console.error('Errore caricamento DB:', e);
    return [];
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Errore salvataggio DB:', e);
  }
}

const handler = async (m, { command, args }) => {
  let groups = loadDB();

  switch (command) {
    case 'listnuke': {
      if (groups.length === 0) return m.reply('❌ Nessun gruppo in lista.');

      let output = ['📜 𝐋𝐈𝐒𝐓𝐀 𝐆𝐑𝐔𝐏𝐏𝐈 𝐍𝐔𝐊𝐊𝐀𝐓𝐈\n'];
      groups.forEach((g, i) => {
        output.push(`*${i + 1}* ━ *${g.name} 👤 ${g.members}*`);
      });

      m.reply(output.join('\n'));
      break;
    }

    case 'addgroup': {
      if (args.length < 2) return m.reply('❌ Usa: .addgroup <nome> <numero membri>');


      const members = parseInt(args[args.length - 1]);
      const name = args.slice(0, -1).join(' ');

      if (!name) return m.reply('❌ Nome non valido.');
      if (isNaN(members) || members <= 0) return m.reply('❌ Numero membri non valido.');

      if (groups.find(g => g.name.toLowerCase() === name.toLowerCase())) {
        return m.reply('⚠️ Gruppo già presente nella lista.');
      }

      groups.push({ name, members });
      saveDB(groups);

      m.reply(`✅ Gruppo "${name}" aggiunto con ${members} membri.`);
      break;
    }

    case 'delgroup': {
      if (args.length < 1) return m.reply('❌ Usa: .delgroup <nome>');

      const name = args.join(' ');
      const index = groups.findIndex(g => g.name.toLowerCase() === name.toLowerCase());
      if (index === -1) return m.reply('❌ Gruppo non trovato.');

      groups.splice(index, 1);
      saveDB(groups);

      m.reply(`✅ Gruppo "${name}" eliminato dalla lista.`);
      break;
    }
  }
};

handler.command = /^(listnuke|addgroup|delgroup)$/i;
handler.owner = true;

export default handler;