import fs from 'fs';
import archiver from 'archiver';

let handler = async (m, { text, conn, usedPrefix, command, __dirname }) => {
  if (!text) return m.reply(`⚠️ Usa: ${usedPrefix + command} <nome_archivio>`);

  let archiveName = text.trim();
  let archivePath = `./${archiveName}.zip`;

  await m.reply(`🔄 Creazione del backup in corso...`);

  const output = fs.createWriteStream(archivePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', async () => {
    console.log(`Archivio creato: ${archive.pointer()} bytes`);
    await m.reply(`✅ Backup ${archiveName}.zip creato. Inviando...`);

    let fileData = fs.readFileSync(archivePath);
    await conn.sendMessage(m.chat, {
      document: fileData,
      mimetype: 'application/zip',
      fileName: `${archiveName}.zip`
    }, { quoted: m });

    fs.unlinkSync(archivePath);
  });

  archive.on('error', (err) => {
    console.error(err);
    m.reply(`❌ Errore durante la compressione: ${err.message}`);
  });

  archive.pipe(output);

  // Usa glob per includere tutti i file e cartelle tranne "node_modules" e "AxtralBotSession"
  archive.glob('**/*', {
    ignore: ['node_modules/**', 'sessioni/**']
  });

  await archive.finalize();
};

handler.command = /^zip$/i;
handler.owner = true;
export default handler;