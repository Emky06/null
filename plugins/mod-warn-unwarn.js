//Plugin fatto da Axtral_WiZaRd
import fs from 'fs';

const time = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let who = m.isGroup
        ? m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
        : m.chat;

    if (!who) return m.reply("*❗𝐃𝐞𝐯𝐢 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐪𝐮𝐚𝐥𝐜𝐮𝐧𝐨 𝐩𝐞𝐫 𝐝𝐚𝐫𝐠𝐥𝐢 𝐮𝐧 𝐰𝐚𝐫𝐧.*");

    const decodedMention = conn.decodeJid(who);

    if (decodedMention === conn.user.jid) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚𝐥 𝐛𝐨𝐭.*');
    if (decodedMention === m.sender) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨.*');

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (ownerJids.includes(decodedMention)) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚𝐝 𝐮𝐧 𝐨𝐰𝐧𝐞𝐫 𝐝𝐞𝐥 𝐛𝐨𝐭.*');

    let groupMetadata;
    if (m.isGroup) {
        try {
            groupMetadata = await conn.groupMetadata(m.chat);
        } catch {
            return m.reply('❗ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐫𝐞𝐜𝐮𝐩𝐞𝐫𝐨 𝐝𝐞𝐢 𝐝𝐚𝐭𝐢 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.');
        }

        const participants = groupMetadata.participants.map(u => ({
            ...u,
            id: conn.decodeJid(u.id),
            jid: u.jid || conn.decodeJid(u.id)
        }));

        const utente = participants.find(u => u.id === decodedMention || u.jid === decodedMention);
        if (!utente) return m.reply('❗ 𝐋’𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐞̀ 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐧𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.');

        const isOwner = utente.admin === 'superadmin';
        const isAdmin = utente.admin === 'admin';

        const prems = global.db?.data?.groups?.[m.chat]?.prems || [];
        const isMod = prems.some(u => (u.includes('@s.whatsapp.net') ? u : `${u}@s.whatsapp.net`) === decodedMention);

        if (isOwner) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚𝐥 𝐜𝐫𝐞𝐚𝐭𝐨𝐫𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨.*');
        if (isAdmin) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚𝐝 𝐮𝐧 𝐚𝐝𝐦𝐢𝐧.*');
        if (isMod) return m.reply('*🚫 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐝𝐚𝐫𝐞 𝐰𝐚𝐫𝐧 𝐚𝐝 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞.*');
    }

    if (command === 'alert') {
        let war = 2;

        if (!(decodedMention in global.db.data.users)) {
            global.db.data.users[decodedMention] = { warn: 0, warnReasons: [] };
        }

        const user = global.db.data.users[decodedMention];
        if (!user.warnReasons) user.warnReasons = [];

        const cleanReason = text ? text.replace(/@[\w\d]+/g, '').trim() : '';
        const displayReason = '❓ ➤ *' + (cleanReason || '𝐍𝐞𝐬𝐬𝐮𝐧 𝐦𝐨𝐭𝐢𝐯𝐨 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐭𝐨.') + '*';

        const fake = {
            key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
            message: { locationMessage: { name: '⚠️ 𝐀𝐭𝐭𝐞𝐧𝐳𝐢𝐨𝐧𝐞 ⚠️', jpegThumbnail: fs.readFileSync('./icone/warn.png') } },
            participant: "0@s.whatsapp.net"
        };

        if (user.warn < war) {
            user.warn += 1;
            user.warnReasons.push(cleanReason || "Nessun motivo specificato");
            let remaining = 3 - user.warn;
            conn.reply(m.chat, `👤 ➤ @${decodedMention.split('@')[0]}\n⚠️ ➤ *${user.warn} / 3*\n${displayReason}\n\n> *𝑨𝒏𝒄𝒐𝒓𝒂 ${remaining} 𝒘𝒂𝒓𝒏 𝒆 𝒔𝒆𝒊 𝒇𝒖𝒐𝒓𝒊 𝒅𝒂𝒍 𝒈𝒓𝒖𝒑𝒑𝒐.*`, fake, { mentions: [decodedMention] });
        } else if (user.warn === war) {
            user.warn += 1;
            user.warnReasons.push(cleanReason || "Nessun motivo specificato");
            conn.reply(m.chat, `👤 ➤ @${decodedMention.split('@')[0]}\n⚠️ ➤ *3 / 3*\n${displayReason}\n\n> *𝑼𝒍𝒕𝒊𝒎𝒐 𝒘𝒂𝒓𝒏 𝒓𝒊𝒄𝒆𝒗𝒖𝒕𝒐. 𝑨𝒅𝒅𝒊𝒐 𝒑𝒍𝒆𝒃𝒆𝒐/𝒂.*`, fake, { mentions: [decodedMention] });
            await time(1000);
            await conn.groupParticipantsUpdate(m.chat, [decodedMention], 'remove');
            user.warn = 0;
            user.warnReasons = [];
        }
    }

    if (command === 'revoke') {
        if (!(decodedMention in global.db.data.users)) {
            global.db.data.users[decodedMention] = { warn: 0, warnReasons: [] };
        }

        const user = global.db.data.users[decodedMention];
        if (!user.warnReasons) user.warnReasons = [];

        if (user.warn > 0) {
            user.warn -= 1;
            if (user.warnReasons.length > 0) user.warnReasons.pop();
            const fake = {
                key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
                message: { locationMessage: { name: '𝑹𝒊𝒎𝒐𝒛𝒊𝒐𝒏𝒆 𝒘𝒂𝒓𝒏 ✓', jpegThumbnail: fs.readFileSync('./icone/spunta.png') } },
                participant: "0@s.whatsapp.net"
            };
            conn.reply(m.chat, `👤 ➤ @${decodedMention.split('@')[0]}\n⚠️ ➤ *${user.warn} / 3*\n\n> *${user.warn} 𝒘𝒂𝒓𝒏 𝒓𝒊𝒎𝒂𝒏𝒆𝒏𝒕𝒊.*`, fake, { mentions: [decodedMention] });
        } else {
            m.reply("*𝐋’𝐮𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐡𝐚 𝐰𝐚𝐫𝐧.*");
        }
    }
};

handler.help = handler.command = ['alert', 'revoke'];
handler.group = true;
handler.premium = true;
handler.botAdmin = true;

export default handler;