//Plugin fatto da Axtral_WiZaRd
import jimp from 'jimp';

let handler = async (m, { conn }) => {
  try {
    let targetImage;
    let wantedBg = await jimp.read('./icone/wanted.png');

    if (m.quoted && m.quoted.mtype === 'imageMessage') {
      let media = await m.quoted.download();
      targetImage = await jimp.read(media);
    } else {
      let who = m.mentionedJid?.[0] || m.sender;

      let avatarUrl = await conn
        .profilePictureUrl(who, 'image')
        .catch(() => null);

      if (!avatarUrl) {
        return m.reply(
          "𝐀𝐥𝐥𝐞𝐠𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐚𝐝 𝐮𝐧'𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞 𝐨 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐜𝐨𝐧 𝐟𝐨𝐭𝐨 𝐩𝐫𝐨𝐟𝐢𝐥𝐨."
        );
      }

      targetImage = await jimp.read(avatarUrl);
    }

    const avatarWidth = 300;
    const avatarHeight = 300;
    const avatarX = (wantedBg.bitmap.width - avatarWidth) / 2;
    const avatarY = 140;

    targetImage = targetImage.resize(
      avatarWidth,
      avatarHeight
    );

    let finalImage = await wantedBg
      .composite(targetImage, avatarX, avatarY, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1
      })
      .getBufferAsync(jimp.MIME_PNG);

    await conn.sendMessage(
      m.chat,
      { image: finalImage },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    m.reply(
      '𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥𝐚 𝐜𝐫𝐞𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐥 𝐩𝐨𝐬𝐭𝐞𝐫 Wanted.'
    );
  }
};

handler.command = /^(wanted)$/i;

export default handler;