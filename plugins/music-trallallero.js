//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
  try {
    
    let audioPath = './storage/mp3/trallalero.mp3';

    
    await conn.sendMessage(m.chat, { 
  audio: { url: audioPath }, 
  mimetype: 'audio/mpeg' 
});
  } catch (err) {
    console.error('𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨❗', err);
    await m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞');
  }
};

handler.command = /trallallero/i;  
handler.group = true;  
handler.premium = true;  
handler.botAdmin = true;  

export default handler;