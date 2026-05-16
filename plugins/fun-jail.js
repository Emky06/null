import jimp from 'jimp';

let handler = async (m, { conn, text }) => {
  try {
    let who;

    if (text) {
      let number = text.replace(/[^\d]/g, '');
      who = number + '@s.whatsapp.net';
    } else {
      who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    }

    let avatarUrl;
    try {
      avatarUrl = await conn.profilePictureUrl(who, 'image');
    } catch (e) {
      return conn.sendMessage(m.chat, {
        text: `𝐋'𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨 ✖`
      }, { quoted: m });
    }

    let img = await jimp.read('./icone/jail.png'); 
    let avatar = await jimp.read(avatarUrl);

    const avatarSize = 500;
    avatar = avatar.resize(avatarSize, avatarSize);

    const imgWidth = img.bitmap.width;
    const imgHeight = img.bitmap.height;
    const avatarX = (imgWidth - avatarSize) / 2; 
    const avatarY = (imgHeight - avatarSize) / 2; 

    let finalImage = await img.composite(avatar, avatarX, avatarY, {
      mode: 'dstOver',
      opacitySource: 1,
      opacityDest: 1
    }).getBufferAsync('image/png');

    await conn.sendMessage(m.chat, { image: finalImage }, { quoted: m });

  } catch (e) {
    console.error(e)
  }
};

handler.command = /^(jail)$/i;

export default handler;