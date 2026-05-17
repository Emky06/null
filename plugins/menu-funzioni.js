// Plugin fatto da Axtral_WiZaRd
const handler = async (m, { conn, usedPrefix }) => {
    const chatData = global.db.data.chats[m.chat];

    const funzioni = {
        detect: '𝐝𝐞𝐭𝐞𝐜𝐭',
        benvenuto: '𝐛𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨',
        bestemmiometro: '𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨',
        cinema: '𝐜𝐢𝐧𝐞𝐦𝐚',
        level: '𝐥𝐞𝐯𝐞𝐥',
        solostaff: '𝐬𝐨𝐥𝐨𝐬𝐭𝐚𝐟𝐟',
        soloviewonce: '𝐬𝐨𝐥𝐨𝐯𝐢𝐞𝐰𝐨𝐧𝐜𝐞',
        antispam: '𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦',
        antisondaggi: '𝐚𝐧𝐭𝐢𝐬𝐨𝐧𝐝𝐚𝐠𝐠𝐢',
        antigiochi: '𝐚𝐧𝐭𝐢𝐠𝐢𝐨𝐜𝐡𝐢',
        antitrava: '𝐚𝐧𝐭𝐢𝐭𝐫𝐚𝐯𝐚',
        antinuke: '𝐚𝐧𝐭𝐢𝐧𝐮𝐤𝐞',
        antivoip: '𝐚𝐧𝐭𝐢𝐯𝐨𝐢𝐩',
        antilink: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤',
        antilinktotale: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐭𝐨𝐭𝐚𝐥𝐞',
        antiinsta: '𝐚𝐧𝐭𝐢𝐢𝐧𝐬𝐭𝐚',
        antitiktok: '𝐚𝐧𝐭𝐢𝐭𝐢𝐤𝐭𝐨𝐤',
        antitelegram: '𝐚𝐧𝐭𝐢𝐭𝐞𝐥𝐞𝐠𝐫𝐚𝐦'
    };

    const lines = Object.entries(funzioni).map(([key, name]) => {
        const stato = chatData?.[key];
        return `┃ ${stato ? '🟢' : '🔴'} » ${name}`;
    });

    const menuText = `
╭━━〔 *𝐌𝐄𝐍𝐔 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈* 〕━━╮
${lines.join('\n')}
╰━━━━━━━━━━━━━━━━━━━╯
╭━━━━━━━━━━━━━━━━━━━╮
┃ⓘ 𝐈𝐧𝐟𝐨 𝐬𝐮𝐥𝐥𝐞 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢:
┃🟢 » 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚
┃🔴 » 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚
┣━━━━━━━━━━━━━━━━━━━┫
┃ⓘ 𝐔𝐬𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
┃${usedPrefix}𝐚𝐭𝐭𝐢𝐯𝐚/𝟏 <𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐞>
┃${usedPrefix}𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐢𝐭𝐚/𝟎 <𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐞>
╰━━━━━━━━━━━━━━━━━━━╯`.trim();

    await conn.sendMessage(
        m.chat,
        {
            text: menuText,
            footer: '𝐒𝐜𝐞𝐠𝐥𝐢 𝐮𝐧 𝐦𝐞𝐧𝐮̀:',
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 𝐌𝐞𝐧𝐮̀ 𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥𝐞" }, type: 1 },
                { buttonId: `${usedPrefix}admin`, buttonText: { displayText: "🛡️ 𝐌𝐞𝐧𝐮̀ 𝐀𝐝𝐦𝐢𝐧" }, type: 1 },
                { buttonId: `${usedPrefix}mod`, buttonText: { displayText: "👮🏻‍♂️ 𝐌𝐞𝐧𝐮̀ 𝐌𝐨𝐝" }, type: 1 },
                { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "🔱 𝐌𝐞𝐧𝐮̀ 𝐎𝐰𝐧𝐞𝐫" }, type: 1 },
                { buttonId: `${usedPrefix}gruppo`, buttonText: { displayText: "👥 𝐌𝐞𝐧𝐮̀ 𝐆𝐫𝐮𝐩𝐩𝐨" }, type: 1 },
                { buttonId: `${usedPrefix}giochi`, buttonText: { displayText: "🎮 𝐌𝐞𝐧𝐮̀ 𝐆𝐢𝐨𝐜𝐡𝐢" }, type: 1 },
            ]
        },
        { quoted: m }
    );
};

handler.help = ["funzioni"];
handler.tags = ["menu"];
handler.command = /^(funzioni)$/i;

export default handler;