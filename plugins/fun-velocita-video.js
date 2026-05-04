// Plugin fatto da Axtral_WiZaRd
import { unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

let handler = async (m, { conn, args, __dirname }) => {
  try {
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || '';

    if (!/video/.test(mime)) {
      throw '❗ *Rispondi a un video con il comando .speedvideo [velocità] (es: .speedvideo 1.5x)*';
    }

    const speedArg = args[0]?.replace('x', '');
    const speed = parseFloat(speedArg) || 1;

    if (speed < 0.25 || speed > 2) {
      throw '*❗ERRORE❗* La velocità deve essere compresa tra 0.25x e 2x.';
    }

    // Calcolo della catena atempo (solo tra 0.5 e 2 per ogni filtro)
    function getAtempoChain(s) {
      if (s < 0.5) return 'atempo=0.5,atempo=' + (s / 0.5);
      if (s > 2.0) return 'atempo=2.0,atempo=' + (s / 2.0);
      return `atempo=${s}`;
    }

    const inputName = getRandom('.mp4');
    const outputName = getRandom('.mp4');
    const inputPath = join(__dirname, '../tmp/', inputName);
    const outputPath = join(__dirname, '../tmp/', outputName);

    await conn.reply(m.chat, '⏳ *Sto modificando la velocità del video...*', m);

    const buffer = await quoted.download();
    writeFileSync(inputPath, buffer);

    const atempoFilter = getAtempoChain(speed);

    const command = `ffmpeg -i ${inputPath} -filter_complex "[0:v]setpts=${1/speed}*PTS[v];[0:a]${atempoFilter}[a]" -map "[v]" -map "[a]" ${outputPath}`;

    exec(command, async (err, stdout, stderr) => {
      unlinkSync(inputPath);
      if (err) {
        console.error('Errore FFmpeg:', stderr);
        return await conn.reply(m.chat, '*❗ERRORE❗* Impossibile modificare la velocità del video.', m);
      }

      const outBuffer = readFileSync(outputPath);
      await conn.sendFile(m.chat, outBuffer, outputName, `*Ecco il video alla velocità di ${speed}x!*`, m);
      unlinkSync(outputPath);
    });

  } catch (e) {
    console.error(e);
    throw e;
  }
};

handler.help = ['speedvideo [velocità]'];
handler.tags = ['video'];
handler.command = /^speedvideo$/i;
handler.limit = true;

export default handler;

function getRandom(ext) {
  return Math.floor(Math.random() * 10000) + ext;
}