//by easter
import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {
  if (!args[0]) {
    m.reply('📱 *𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐁𝐚𝐧 𝐂𝐡𝐞𝐜𝐤*\n\n*𝐔𝐬𝐨:* .checkban <numero>\n*Formato:* 391112224444\n\n*Esempio:* .checkban 391112224444\n\n_𝐈𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐞𝐯𝐞 𝐞𝐬𝐬𝐞𝐫𝐞 𝐢𝐧 𝐟𝐨𝐫𝐦𝐚𝐭𝐨 𝐢𝐧𝐭𝐞𝐫𝐧𝐚𝐳𝐢𝐨𝐧𝐚𝐥𝐞 𝐬𝐞𝐧𝐳𝐚 + 𝐨 𝐬𝐩𝐚𝐳𝐢_');
    return;
  }

  let phoneNumber = args[0].trim();
  
  phoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
  
  if (phoneNumber.startsWith('3') && phoneNumber.length === 10) {
    phoneNumber = '39' + phoneNumber;
  }
  
  if (!/^\d+$/.test(phoneNumber)) {
    m.reply('❌ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐢𝐧𝐯𝐚𝐥𝐢𝐝𝐨. 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐬𝐨𝐥𝐨 𝐧𝐮𝐦𝐞𝐫𝐢\n\n*𝐅𝐨𝐫𝐦𝐚𝐭𝐢 𝐚𝐜𝐜𝐞𝐭𝐭𝐚𝐭𝐢:*\n→ 391112224444\n→ +391112224444\n→ 3111 222 4444');
    return;
  }

  if (phoneNumber.length < 10) {
    m.reply('❌ 𝐍𝐮𝐦𝐞𝐫𝐨 𝐭𝐫𝐨𝐩𝐩𝐨 𝐜𝐨𝐫𝐭𝐨. 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨 𝐯𝐚𝐥𝐢𝐝𝐨 (𝐚𝐥𝐦𝐞𝐧𝐨 𝟏𝟎 𝐜𝐢𝐟𝐫𝐞)');
    return;
  }

  try {
    await m.reply('🔍 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐚𝐧𝐝𝐨 𝐥𝐨 𝐬𝐭𝐚𝐭𝐨 𝐝𝐞𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐬𝐮 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩...');

    const tokenRes = await fetch('https://baron0.com/api/get-token');
    if (!tokenRes.ok) {
      m.reply(`❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐀𝐏𝐈 (token): HTTP ${tokenRes.status}`);
      return;
    }
    const { token } = await tokenRes.json();

    const response = await fetch('https://baron0.com/check-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-page-token': token,
      },
      body: JSON.stringify({ number: `+${phoneNumber}` }),
    });

    if (!response.ok) {
      m.reply(`❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐀𝐏𝐈: HTTP ${response.status}\nL'endpoint potrebbe essere non disponibile.`);
      return;
    }

    const data = await response.json();

    const isBanned = data.banned || false;
    const err = data.error || {};
    const status = err.status || 'unknown';
    const reason = err.reason || 'unknown';
    const loginNum = err.login || phoneNumber;
    const methods = Array.isArray(err.fallback_methods) && err.fallback_methods.length
      ? err.fallback_methods.join(', ')
      : 'nessuno';
    const autoconf = err.autoconf_type != null ? err.autoconf_type : 'n/a';

    let replyMsg = `📱 *𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐀𝐜𝐜𝐨𝐮𝐧𝐭 𝐒𝐭𝐚𝐭𝐮𝐬*\n\n`;
    replyMsg += `📞 *𝐍𝐮𝐦𝐞𝐫𝐨:* +${loginNum}\n`;
    replyMsg += `━━━━━━━━━━━━━━━━━\n`;

    if (isBanned) {
      replyMsg += `🔴 *𝐒𝐓𝐀𝐓𝐎: 𝐁𝐀𝐍𝐍𝐀𝐓𝐎*\n`;
      replyMsg += `❌ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐮𝐦𝐞𝐫𝐨 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐛𝐚𝐧𝐧𝐚𝐭𝐨 𝐝𝐚 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩`;
    } else {
      replyMsg += `🟢 *𝐒𝐓𝐀𝐓𝐎: 𝐀𝐓𝐓𝐈𝐕𝐎*\n`;
      replyMsg += `✅ 𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐮𝐦𝐞𝐫𝐨 𝐞̀ 𝐚𝐧𝐜𝐨𝐫𝐚 𝐚𝐭𝐭𝐢𝐯𝐨 𝐬𝐮 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩`;
    }

    replyMsg += `\n━━━━━━━━━━━━━━━━━\n`;
    replyMsg += `📊 *𝐃𝐞𝐭𝐭𝐚𝐠𝐥𝐢:*\n`;
    replyMsg += `• 𝐒𝐭𝐚𝐭𝐮𝐬: ${status}\n`;
    replyMsg += `• 𝐌𝐨𝐭𝐢𝐯𝐨: ${reason}\n`;
    replyMsg += `• 𝐌𝐞𝐭𝐨𝐝𝐢 𝐚𝐮𝐭𝐡: ${methods}\n`;
    replyMsg += `• 𝐀𝐮𝐭𝐨𝐜𝐨𝐧𝐟 𝐭𝐲𝐩𝐞: ${autoconf}\n`;
    replyMsg += `• 𝐓𝐢𝐦𝐞𝐬𝐭𝐚𝐦𝐩: ${new Date().toLocaleString('it-IT')}`;
    
    m.reply(replyMsg);

  } catch (error) {
    console.error('WhatsApp Ban Check Error:', error);
    m.reply(`❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐢 𝐜𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞: ${error.message}\n\n𝐏𝐫𝐨𝐯𝐚 𝐩𝐢𝐮̀ 𝐭𝐚𝐫𝐝𝐢 𝐨 𝐜𝐨𝐧𝐭𝐚𝐭𝐭𝐚 𝐠𝐥𝐢 𝐚𝐝𝐦𝐢𝐧 𝐬𝐞 𝐢𝐥 𝐩𝐫𝐨𝐛𝐥𝐞𝐦𝐚 𝐩𝐞𝐫𝐬𝐢𝐬𝐭𝐞.`);
  }
};

handler.help = ['checkban'];
handler.tags = ['tools'];
handler.command = /^(checkban|check-ban|controllabn|controllawhatsapp|wa-check|whatsapp-check)$/i;

export default handler;