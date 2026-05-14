//Crediti: Onix, di Riad
let handler = async (m, { conn }) => {
    
    let groupMetadata = await conn.groupMetadata(m.chat);
    let groupName = groupMetadata.subject; 
    let groupDescription = groupMetadata.desc || '𝐃𝐞𝐬𝐜𝐫𝐢𝐳𝐢𝐨𝐧𝐞 𝐢𝐧𝐞𝐬𝐢𝐬𝐭𝐞𝐧𝐭𝐞 ⁉️'; 

    let infoMessage = `
🟠 *𝐍𝐨𝐦𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨:*
 ➪  ${groupName} \n
🟡 *𝐃𝐞𝐬𝐜𝐫𝐢𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨:*
 ➪  ${groupDescription}
    `;

    await conn.sendMessage(m.chat, { text: infoMessage }, { quoted: m });
};

handler.command = /^(rules)$/i; 
handler.staff = true;
handler.group = true; 

export default handler;