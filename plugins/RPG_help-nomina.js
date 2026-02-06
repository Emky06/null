const handler = async (m, { conn }) => {
  const text = (m.text || '').trim();
  if (!text.toLowerCase().startsWith('.helpnomina')) return;

  const args = text.split(/\s+/);
  if (args.length === 1) {
    
    return conn.reply(
      m.chat,
      '✏️ 𝐏𝐞𝐫 𝐫𝐢𝐧𝐨𝐦𝐢𝐧𝐚𝐫𝐞 𝐮𝐧 𝐚𝐧𝐢𝐦𝐚𝐥𝐞 𝐮𝐬𝐚:\n.nomina [numero animale] [nuovo nome]\n\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨:\n.nomina 1 Zeus',
      m
    );
  }
 
};

handler.command = /^helpnomina$/i;
handler.group = true

export default handler;