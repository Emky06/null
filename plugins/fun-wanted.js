import jimp from 'jimp';

let handler = async (m, { conn }) => {
  try {
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    let avatarUrl;
    try {
      avatarUrl = await conn.profilePictureUrl(who, 'image');
    } catch {
      return conn.sendMessage(m.chat, {
        text: `𝐋'𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 ✖`
      }, { quoted: m });
    }

    let img = await jimp.read('./icone/wanted.png');

    let avatar = await jimp.read(avatarUrl);

 
    const avatarWidth = 240;   // larghezza avatar
    const avatarHeight = 240;  // altezza avatar
    const avatarX = (img.bitmap.width - avatarWidth) / 2;   // centrato orizzontalmente
    const avatarY = 190; // posizionato in verticale

    avatar = avatar.resize(avatarWidth, avatarHeight);

    let finalImage = await img.composite(avatar, avatarX, avatarY, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    }).getBufferAsync(jimp.MIME_PNG);

    await conn.sendMessage(m.chat, { image: finalImage }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('Errore durante la creazione del poster Wanted.');
  }
};

handler.command = /^(wanted)$/i;

export default handler;