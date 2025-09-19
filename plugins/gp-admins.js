// Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, participants, groupMetadata, args }) => {
    const botId = conn.user.jid || conn.user.id;

    const groupAdmins = participants.filter(p => p.admin && p.id !== botId);
    const listAdmin = groupAdmins
        .map((v, i) => `✧👑 ${i + 1}. @${v.id.split('@')[0]}`)
        .join('\n');

    const owner = groupMetadata.owner || 
        groupAdmins.find(p => p.admin === 'superadmin')?.id || 
        `${m.chat.split`-`[0]}@s.whatsapp.net`;

    let pesan = args.join(' ');
    let message = pesan ? pesan : '❌ Nessun messaggio fornito';

    let text = `
╭═══════════════════╮
│    ⚠️ 𝐒𝐕𝐄𝐆𝐋𝐈𝐀 𝐀𝐃𝐌𝐈𝐍 ⚠️    │
╰═══════════════════╯

✎ *Messaggio:*  
➥ ${message}

♔ *Lista Admin:*  
${listAdmin}

╭═══════════════════╮
│      ☄️ 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 ☄️     │
╰═══════════════════╯
`.trim();

    conn.reply(m.chat, text, m, { mentions: [...groupAdmins.map(v => v.id), owner] });
};

handler.command = ['admins', '@admins', 'dmins'];
handler.tags = ['group'];
handler.help = ['admins <messaggio>'];
handler.group = true;

export default handler;