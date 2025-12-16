// Plugin fatto da Axtral_WiZaRd

// Genera un codice casuale a 4 cifre quando il bot parte
const BOT_CODE = Math.floor(1000 + Math.random() * 9000).toString();
console.log(`🔐 Codice Shadow di questo bot: ${BOT_CODE}`);

let handler = async (m, { args }) => {
    // Controlla se è stato passato un codice
    if (!args[0]) {
        return m.reply(`Per attivare Shadow, inserisci il codice a 4 cifre. Es: shadow 1234`);
    }

    // Verifica se il codice inserito corrisponde a quello del bot
    if (args[0] !== BOT_CODE) {
        return m.reply('Codice errato! Questo bot non verrà disattivato.');
    }

    // Se il codice è corretto, attiva la modalità fantasma
    global.db.data.chats[m.chat].isBanned = true
    m.reply('*✓ 𝐌𝐨𝐝𝐚𝐥𝐢𝐭𝐚̀ 𝐟𝐚𝐧𝐭𝐚𝐬𝐦𝐚 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚... 𝐧𝐨𝐧 𝐬𝐞𝐧𝐭𝐢𝐫𝐞𝐭𝐞 𝐧𝐮𝐥𝐥𝐚.*')
}

handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^shadow$/i
handler.rowner = true

export default handler