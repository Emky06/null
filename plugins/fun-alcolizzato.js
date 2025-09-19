let handler = async (m, { conn, command, text }) => {
    // Calcolo in base alla volontà di Youns
    let width = Math.floor(Math.random() * 31);

    // Frase finale basata sulla misura
    let finalPhrase = width >= 8 
        ?"👮 *il ragazzo/a è astemio/a*"
        : "😅 *il bro è calato in depressione*";

    // Messaggio 🥵
    let message = `
━━━━━━━━━━━━━━━━━━━━━
*MOMENTO DEL TEST DELL'ALCOL!🍷* 
━━━━━━━━━━━━━━━━━━━━━
 *${text} è alcolizzato del *${width}%🍷!* 
━━━━━━━━━━━━━━━━━━━━━
${finalPhrase}
`.trim();

    m.reply(message, null, { mentions: conn.parseMention(message) });
};

handler.command = /^(alcolizzato)$/i;

export default handler;