//Plugin fatto da Riad 
let handler = async (m, { text }) => {
  if (!text) throw `> 𝐌𝐚𝐧𝐜𝐚 𝐢𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐫𝐢𝐦𝐨𝐳𝐢𝐨𝐧𝐞!\n𝐔𝐬𝐚:\n- @user = 𝐭𝐚𝐠 𝐝𝐞𝐥𝐥'𝐮𝐭𝐞𝐧𝐭𝐞\n- @subject = 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨`
  
  global.db.data.chats[m.chat].sRemoveCustom = text
  m.reply(`𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐫𝐢𝐦𝐨𝐳𝐢𝐨𝐧𝐞 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨! ✅`)
}

handler.help = ['setremove <testo>']
handler.tags = ['group']
handler.command = ['setremove']
handler.admin = true

export default handler