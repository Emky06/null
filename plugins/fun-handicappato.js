let handler = async (m, { conn, text }) => {
    let user;
    let name;

    if (m.quoted) {
        user = m.quoted.sender;
        name = await conn.getName(user);
    } else if (m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
        name = await conn.getName(user);
    } else {
        user = m.sender;
        name = await conn.getName(user);
    }

    let genere = "handicappato/a";
    let percentuale = Math.floor(Math.random() * 101);

    let frase;
    if (percentuale < 25) {
        frase = "*Sei quasi normale, non preoccuparti!*";
    } else if (percentuale < 50) {
        frase = "*Un po' di disabilità rende la vita interessante!*";
    } else if (percentuale < 75) {
        frase = "*Beh, qui si sente davvero il peso!*";
    } else {
        frase = "*Sei il campione indiscusso di handicap!*";
    }

    let love = `
━━━━━━━━━━━━━━━━━━━━━
*CALCOLATORE DI HANDICAP🌀*
━━━━━━━━━━━━━━━━━━━━━
🤔 *@${user.split('@')[0]} è ${genere} al ${percentuale}%!*
━━━━━━━━━━━━━━━━━━━━━
${frase} 🤣 
`.trim();

    m.reply(love, null, {
        mentions: [user]
    });
};

handler.command = /^(104)$/i;
export default handler;