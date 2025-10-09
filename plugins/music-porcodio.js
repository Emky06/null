//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
  try {
    // Percorso del file musicale
    let audioPath = './storage/mp3/germanomosconi.mp3';

    // Invia il file audio come messaggio nel gruppo
    await conn.sendMessage(m.chat, { 
  audio: { url: audioPath }, 
  mimetype: 'audio/mpeg' 
});
  } catch (err) {
    console.error('𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨❗', err);
    await m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞');
  }
};

handler.command = /porcodio/i;  // Comando 
handler.group = true;  // Funziona solo nei gruppi
handler.admin = true;  // Solo per amministratori
handler.botAdmin = true;  // Il bot deve essere admin nel gruppo

export default handler;