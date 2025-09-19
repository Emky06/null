const formatHandler = async (m, { conn, command, args }) => {
  const jid = m.chat
  const index = parseInt(args[0])
  const videos = conn.ytCache?.[jid]

  if (!videos || isNaN(index) || index < 0 || index >= videos.length) {
    return m.reply('❌ Video non trovato. Ricerca prima con .play', m)
  }

  const video = videos[index]

  const buttons = [
    { buttonId: `.play1 ${video.url}`, buttonText: { displayText: '🎵 Audio' }, type: 1 },
    { buttonId: `.play2 ${video.url}`, buttonText: { displayText: '🎬 Video' }, type: 1 }
  ]

  await conn.sendMessage(jid, {
    text: `*${index + 1}. ${video.title}*\n\nScegli il formato da scaricare:`,
    footer: '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫',
    buttons,
    headerType: 1
  }, { quoted: m })
}

formatHandler.command = ['ytformat']
export default formatHandler