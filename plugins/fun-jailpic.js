import jimp from 'jimp';

let handler = async (m, { conn }) => {
  try {
    let targetImage;
    let jailOverlay = await jimp.read('./icone/jail.png'); 

    if (m.quoted && m.quoted.mtype === 'imageMessage') {
      let media = await m.quoted.download();
      targetImage = await jimp.read(media);
    } else {
      let who = m.mentionedJid?.[0] || m.sender;
      let avatarUrl = await conn.profilePictureUrl(who, 'image').catch(() => null);
      if (!avatarUrl) return m.reply('𝐀𝐥𝐥𝐞𝐠𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐚𝐝 𝐮𝐧`𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞.');
      targetImage = await jimp.read(avatarUrl);
    }

    targetImage = targetImage.resize(jailOverlay.bitmap.width, jailOverlay.bitmap.height);

    let finalImage = await targetImage.composite(jailOverlay, 0, 0, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacitySource: 1,
      opacityDest: 1
    }).getBufferAsync(jimp.MIME_PNG);

    await conn.sendMessage(m.chat, { image: finalImage }, { quoted: m });

  } catch (e) {
    console.error('Errore:', e);
    m.reply('𝐄𝐫𝐫𝐨𝐫𝐞 𝐞𝐥𝐚𝐛𝐨𝐫𝐚𝐳𝐢𝐨𝐧𝐞 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞.');
  }
};

handler.command = /^(jailpic)$/i;
export default handler;