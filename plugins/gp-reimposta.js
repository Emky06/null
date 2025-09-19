let handler = async(m, { conn }) => {
let revoke = await conn.groupRevokeInvite(m.chat)
await conn.reply(m.chat, `𝐋𝐢𝐧𝐤 𝐫𝐞𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨`, m)}
handler.command = ['reimposta']
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler