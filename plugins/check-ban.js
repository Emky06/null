//by easter, mod axtral
import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {

  if (!args[0]) {
    return m.reply(`
╭━〔 📱 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐁𝐀𝐍 𝐂𝐇𝐄𝐂𝐊 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 📌 *𝐔𝐬𝐨:* .checkban <numero>
┃ 🌍 *𝐅𝐨𝐫𝐦𝐚𝐭𝐨:* internazionale
┃
┃ ✅ 𝐄𝐬𝐞𝐦𝐩𝐢:
┃ • .checkban 391112224444
┃ • .checkban +39 111 222 4444
┃ • .checkban 347 968 4300
┃
┃ 🤖 𝐈𝐥 𝐛𝐨𝐭 𝐫𝐢𝐦𝐮𝐨𝐯𝐞
┃ automaticamente spazi e +
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());
  }

  let phoneNumber = args.join(' ').trim();

  phoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');

  if (phoneNumber.startsWith('3') && phoneNumber.length === 10) {
    phoneNumber = '39' + phoneNumber;
  }

  if (!/^\d+$/.test(phoneNumber)) {
    return m.reply(`
╭━〔 ❌ 𝐍𝐔𝐌𝐄𝐑𝐎 𝐈𝐍𝐕𝐀𝐋𝐈𝐃𝐎 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 📌 Inserisci solo numeri
┃
┃ ✅ 𝐅𝐨𝐫𝐦𝐚𝐭𝐢 𝐚𝐜𝐜𝐞𝐭𝐭𝐚𝐭𝐢:
┃ • 391112224444
┃ • +391112224444
┃ • 347 968 4300
┃ • +39 347 968 4300
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());
  }

  if (phoneNumber.length < 10) {
    return m.reply(`
╭━〔 ❌ 𝐍𝐔𝐌𝐄𝐑𝐎 𝐓𝐑𝐎𝐏𝐏𝐎 𝐂𝐎𝐑𝐓𝐎 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 📌 Inserisci almeno
┃ 10 cifre valide
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());
  }

  try {

    await m.reply(`
╭━〔 🔍 𝐂𝐎𝐍𝐓𝐑𝐎𝐋𝐋𝐎 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 📱 Verifica numero
┃ in corso su WhatsApp...
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());

    const tokenRes = await fetch('https://baron0.com/api/get-token');

    if (!tokenRes.ok) {
      return m.reply(`
╭━〔 ❌ 𝐄𝐑𝐑𝐎𝐑𝐄 𝐀𝐏𝐈 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ HTTP ${tokenRes.status}
┃ Token non disponibile
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());
    }

    const { token } = await tokenRes.json();

    const response = await fetch('https://baron0.com/check-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-page-token': token,
      },
      body: JSON.stringify({
        number: `+${phoneNumber}`
      }),
    });

    if (!response.ok) {
      return m.reply(`
╭━〔 ❌ 𝐄𝐑𝐑𝐎𝐑𝐄 𝐀𝐏𝐈 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ HTTP ${response.status}
┃ Endpoint non disponibile
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());
    }

    const data = await response.json();

    const isBanned = data.banned || false;
    const err = data.error || {};

    const status = err.status || 'unknown';
    const reason = err.reason || 'unknown';
    const loginNum = err.login || phoneNumber;

    const methods =
      Array.isArray(err.fallback_methods) &&
      err.fallback_methods.length
        ? err.fallback_methods.join(', ')
        : 'nessuno';

    const autoconf =
      err.autoconf_type != null
        ? err.autoconf_type
        : 'n/a';

    let replyMsg = `
╭━〔 📱 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐓𝐀𝐓𝐔𝐒 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 📞 Numero:
┃ +${loginNum}
┣━━━━━━━━━━━━━━━━━━━━
`;

    if (isBanned) {
      replyMsg += `
┃ 🔴 STATO: BANNATO
┃ ❌ Numero bannato
┃ da WhatsApp
`;
    } else {
      replyMsg += `
┃ 🟢 STATO: ATTIVO
┃ ✅ Numero attivo
┃ su WhatsApp
`;
    }

    replyMsg += `
┣━━━━━━━━━━━━━━━━━━━━
┃ 📊 DETTAGLI
┣━━━━━━━━━━━━━━━━━━━━
┃ • Status: ${status}
┃ • Motivo: ${reason}
┃ • Auth: ${methods}
┃ • Autoconf: ${autoconf}
┃ • Ora:
┃ ${new Date().toLocaleString('it-IT')}
╰━━━━━━━━━━━━━━━━━━━╯
`;

    m.reply(replyMsg.trim());

  } catch (error) {

    console.error('WhatsApp Ban Check Error:', error);

    m.reply(`
╭━〔 ❌ 𝐄𝐑𝐑𝐎𝐑𝐄 〕━╮
┣━━━━━━━━━━━━━━━━━━━━
┃ 🌐 Errore connessione
┃
┃ ${error.message}
┃
┃ 🔄 Riprova più tardi
╰━━━━━━━━━━━━━━━━━━━╯
`.trim());
  }
};

handler.help = ['checkban'];
handler.tags = ['tools'];

handler.command =
 /^(checkban|check-ban|controllabn|controllawhatsapp|wa-check|whatsapp-check)$/i;

export default handler;