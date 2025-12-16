let BOT_CODE = Math.floor(1000 + Math.random() * 9000).toString();

let handler = async (m, { args }) => {
    console.log(`🔐 Codice Shadow di questo bot: ${BOT_CODE}`); // Stampa qui quando esegui il comando

    if (!args[0]) return m.reply(`Per attivare Shadow, inserisci il codice a 4 cifre. Es: shadow 1234`);

    if (args[0] !== BOT_CODE) return m.reply('Codice errato! Questo bot non verrà disattivato.');

    global.db.data.chats[m.chat].isBanned = true
    m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚... 𝐧𝐨𝐧 𝐬𝐞𝐧𝐭𝐢𝐫𝐞𝐭𝐞 𝐧𝐮𝐥𝐥𝐚.*')
}

handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^shadow$/i
handler.rowner = true

export default handler