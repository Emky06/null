//Plugin fatto da Axtral_WiZaRd
let handler = async (m) => {
global.db.data.chats[m.chat].isBanned = true
m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚...𝐧𝐨𝐧 𝐬𝐞𝐧𝐭𝐢𝐫𝐞𝐭𝐞 𝐧𝐮𝐥𝐥𝐚.*')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^shadow$/i
handler.rowner = true
export default handler