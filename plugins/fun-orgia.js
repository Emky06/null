let toM = (a) => '@' + a.split('@')[0];

function handler(m, { groupMetadata, conn }) {
    let ps = groupMetadata.participants
        .map((v) => v.id)
        .filter((id) => id !== conn.user.jid); // Escludi il bot

    // Controllo che ci siano almeno 6 partecipanti
    if (ps.length < 6) {
        m.reply("𝐏𝐚𝐫𝐭𝐞𝐜𝐢𝐩𝐚𝐧𝐭𝐢 𝐢𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭𝐢 𝐩𝐞𝐫 𝐢𝐥 𝐠𝐢𝐨𝐜𝐨.");
        return;
    }

    // Randomizza i partecipanti
    let shuffled = ps.sort(() => 0.5 - Math.random());

    // Seleziona casualmente due per ogni ruolo
    let inculano = shuffled.slice(0, 2); // I primi due
    let inculati = shuffled.slice(2, 4); // I successivi due
    let spettatori = shuffled.slice(4, 6); // I successivi due

    // Crea il messaggio
    let message = `💦 *𝕆ℝ𝔾𝕀𝔸 𝔻𝔼𝕃 𝕄𝕆𝕄𝔼ℕ𝕋𝕆* 💦\n\n`;
    message += `━━━━━━━━━━♕︎━━━━━━━━━━\n👑 ${toM(inculano[0])} 𝐞 ${toM(inculano[1])} *𝐢𝐧𝐜𝐮𝐥𝐞𝐫𝐚𝐧𝐧𝐨*.\n`;
    message += `━━━━━━━━━━☠︎︎━━━━━━━━━━\n💀 𝐈𝐧𝐯𝐞𝐜𝐞 ${toM(inculati[0])} 𝐞 ${toM(inculati[1])} *𝐯𝐞𝐫𝐫𝐚𝐧𝐧𝐨 𝐢𝐧𝐜𝐮𝐥𝐚𝐭𝐢*.\n`;
    message += `━━━━━━━━━━シ︎━━━━━━━━━━\n😏 𝐈𝐧𝐟𝐢𝐧𝐞 ${toM(spettatori[0])} 𝐞 ${toM(spettatori[1])} 𝐬𝐚𝐫𝐚𝐧𝐧𝐨 𝐠𝐥𝐢 *𝐬𝐩𝐞𝐭𝐭𝐚𝐭𝐨𝐫𝐢* 𝐦𝐚𝐥𝐚𝐭𝐢.\n\n`;
    message += `> 𝐁𝐮𝐨𝐧 𝐝𝐢𝐯𝐞𝐫𝐭𝐢𝐦𝐞𝐧𝐭𝐨😈`;

    // Invia il messaggio con i tag
    m.reply(message, null, {
        mentions: [...inculano, ...inculati, ...spettatori],
    });
}

handler.help = ['orgia'];
handler.tags = ['fun'];
handler.command = /^orgia$/i;
handler.group = true;

export default handler;