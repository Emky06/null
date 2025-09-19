//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn, command, text }) => {
    // Se non c'è testo né risposta, chiedi di taggare qualcuno
    if (!text && !m.quoted && !m.mentionedJid?.length) 
        return m.reply("𝑫𝒆𝒗𝒊 𝒕𝒂𝒈𝒈𝒂𝒓𝒆 𝒖𝒏𝒂 𝒑𝒆𝒓𝒔𝒐𝒏𝒂 𝒊𝒏𝒔𝒊𝒆𝒎𝒆 𝒂𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐!");

    // Ottieni l'utente taggato o quello a cui si risponde
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) return m.reply("𝑻𝒂𝒈𝒈𝒂 𝒐 𝒓𝒊𝒔𝒑𝒐𝒏𝒅𝒊 𝒂 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐!");

    // Prendi il nome da text o dal nome contatto
    let name = text || (await conn.getName(user));

    let segheAlGiorno = Math.floor(Math.random() * 21); // Da 0 a 20
    let response;

    let segheWord = segheAlGiorno === 1 ? '𝐜𝐚𝐳𝐳𝐨' : '𝐜𝐚𝐳𝐳𝐢';

    if (segheAlGiorno === 0) {
        response = "> 𝑳𝒂 𝑽𝒆𝒓𝒈𝒊𝒏𝒆 𝑴𝒂𝒓𝒊𝒂 👸🏻";
    } else if (segheAlGiorno <= 6) {
        response = "> 𝒃𝒐𝒄𝒄𝒂 𝒄𝒖𝒍𝒐 𝒇𝒊𝒈𝒂 𝒂 𝒒𝒖𝒂𝒏𝒕𝒐? 😂";
    } else if (segheAlGiorno <= 11) {
        response = "> 𝒍𝒂 𝒕𝒖𝒂 𝒃𝒐𝒄𝒄𝒂 𝒆̀ 𝒖𝒏 𝒑𝒂𝒓𝒄𝒉𝒆𝒈𝒈𝒊𝒐 𝒑𝒖𝒃𝒃𝒍𝒊𝒄𝒐 💩";
    } else {
        response = "> 𝑺𝒆 𝒕𝒊 𝒅𝒊𝒄𝒐𝒏𝒐 𝒅𝒊 𝒔𝒑𝒖𝒕𝒂𝒓𝒆 𝒅𝒐𝒑𝒐 𝒖𝒏 𝒑𝒐𝒎𝒑𝒊𝒏𝒐, 𝒕𝒊 𝒐𝒇𝒇𝒆𝒏𝒅𝒊 💀";
    }

    let segaioloMessage = `◥ ━━━━━ 👄 ━━━━━ ◤\n *𝐕𝐞𝐝𝐢𝐚𝐦𝐨 𝐪𝐮𝐚𝐧𝐭𝐨 𝐞̀ 𝐩𝐨𝐦𝐩𝐢𝐧𝐚𝐫𝐚 @${user.split('@')[0]}:* \n\n➥ @${user.split('@')[0]} 𝐬𝐮𝐜𝐜𝐡𝐢𝐚 ${segheAlGiorno} ${segheWord} 𝐨𝐠𝐧𝐢 𝐬𝐞𝐫𝐚. \n${response}\n◥ ━━━━━ 👄 ━━━━━ ◤`.trim();

    m.reply(segaioloMessage, null, { mentions: [user] });
}

handler.help = ['segaiolo'];
handler.tags = ['fun'];
handler.command = /^(pompinara)$/i;

export default handler;