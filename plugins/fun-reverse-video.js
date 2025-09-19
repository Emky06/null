// Plugin fatto da Axtral_WiZaRd
import { unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

let handler = async (m, { conn, args, __dirname }) => {
  try {
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || '';

    if (!/video/.test(mime)) {
      throw '❗ *Rispondi a un video con il comando .reversevid [velocità] (es: .reversevid 1.5x)*';
    }

    let speed = parseFloat(args[0]?.replace('x', '')) || 1.0;
    if (speed < 0.25 || speed > 2) {
      throw '*❗ERRORE❗* La velocità deve essere compresa tra 0.25x e 2x.';
    }

    const atempoFilters = getAtempoChain(speed);
    const inputName = getRandom('.mp4');
    const outputName = getRandom('.mp4');
    const inputPath = join(__dirname, '../tmp/', inputName);
    const outputPath = join(__dirname, '../tmp/', outputName);

    const buffer = await quoted.download();
    writeFileSync(inputPath, buffer);

    await conn.sendMessage(m.chat, { text: '*⏳Sto elaborando il video...*' }, { quoted: m });

    exec(`ffmpeg -i ${inputPath} -vf reverse,setpts=${1 / speed}*PTS -af areverse,${atempoFilters} ${outputPath}`, async (err) => {
      unlinkSync(inputPath);

      if (err) {
        unlinkSync(outputPath);
        throw '*❗ERRORE❗* Impossibile modificare il video al contrario.';
      }

      const outBuffer = readFileSync(outputPath);
      await conn.sendFile(m.chat, outBuffer, outputName, `*Video invertito con velocità ${speed}x*`, m);
      unlinkSync(outputPath);
    });

  } catch (e) {
    throw e;
  }
};

handler.help = ['reversev [velocità]'];
handler.tags = ['video'];
handler.command = /^reversevid$/i;
handler.limit = true;

export default handler;

function getRandom(ext) {
  return Math.floor(Math.random() * 10000) + ext;
}

function getAtempoChain(speed) {
  // atempo accetta solo valori tra 0.5 e 2.0, quindi li compone
  let factors = [];
  while (speed < 0.5) {
    factors.push(0.5);
    speed /= 0.5;
  }
  while (speed > 2.0) {
    factors.push(2.0);
    speed /= 2.0;
  }
  factors.push(Number(speed.toFixed(2)));
  return factors.map(f => `atempo=${f}`).join(',');
}