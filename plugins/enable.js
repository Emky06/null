// enable decriptato by Onix, di Riad 
import fs from 'fs'; 
import fetch from 'node-fetch';

let handler = async (msg, { conn, usedPrefix, command, args }) => { 
    let chatConfig = global.db.data.chats[msg.chat] || {};
    let botConfig = global.db.data.settings[conn.user.jid] || {};

    // Funzioni per chat
    const toggleOptions = {
        antitelegram: { configKey: "antitelegram", label: " *𝒂𝒏𝒕𝒊𝒕𝒆𝒍𝒆𝒈𝒓𝒂𝒎* " },
        benvenuto: { configKey: "benvenuto", label: " *𝒃𝒆𝒏𝒗𝒆𝒏𝒖𝒕𝒐* " },
        solostaff: { configKey: "solostaff", label: " *𝒔𝒐𝒍𝒐𝒔𝒕𝒂𝒇𝒇* " },
        soloviewonce: { configKey: "soloviewonce", label: " *𝒔𝒐𝒍𝒐𝒗𝒊𝒆𝒘𝒐𝒏𝒄𝒆* " },
        antilink: { configKey: "antilink", label: " *𝒂𝒏𝒕𝒊𝒍𝒊𝒏𝒌* " },
        antilinktotale: { configKey: "antilinktotale", label: " *𝒂𝒏𝒕𝒊𝒍𝒊𝒏𝒌𝒕𝒐𝒕𝒂𝒍𝒆* " },
        antiinsta: { configKey: "antiinsta", label: " *𝒂𝒏𝒕𝒊𝒊𝒏𝒔𝒕𝒂* " },
        antitrava: { configKey: "antitrava", label: " *𝒂𝒏𝒕𝒊𝒕𝒓𝒂𝒗𝒂* " },
        antisondaggi: { configKey: "antisondaggi", label: " *𝒂𝒏𝒕𝒊𝒔𝒐𝒏𝒅𝒂𝒈𝒈𝒊* " },
        antitiktok: { configKey: "antitiktok", label: " *𝒂𝒏𝒕𝒊𝒕𝒊𝒌𝒕𝒐𝒌* " },
        antispam: { configKey: "antispam", label: " *𝒂𝒏𝒕𝒊𝒔𝒑𝒂𝒎* " },
        antivoip: { configKey: "antivoip", label: " *𝒂𝒏𝒕𝒊𝒗𝒐𝒊𝒑* " },
        bestemmiometro: { configKey: "bestemmiometro", label: " *𝒃𝒆𝒔𝒕𝒆𝒎𝒎𝒊𝒐𝒎𝒆𝒕𝒓𝒐* " },
        antigiochi: { configKey: "antigiochi", label: " *𝒂𝒏𝒕𝒊𝒈𝒊𝒐𝒄𝒉𝒊* " },
        detect: { configKey: "detect", label: " *𝒅𝒆𝒕𝒆𝒄𝒕* " },
        antinuke: { configKey: "antinuke", label: " *𝒂𝒏𝒕𝒊𝒏𝒖𝒌𝒆* " },
        level: { configKey: "level", label: " *𝒍𝒆𝒗𝒆𝒍* " },
        cinema: { configKey: "cinema", label: " *𝒂𝒃𝒔𝒐𝒍𝒖𝒕𝒆𝒄𝒊𝒏𝒆𝒎𝒂* " },
        chatbot: { configKey: "chatbot", label: " *𝒄𝒉𝒂𝒕𝒃𝒐𝒕* " },
        antitag: { configKey: "antitag", label: " *𝒂𝒏𝒕𝒊𝒕𝒂𝒈* " },
    };

    // Funzioni settings
    const toggleGlobalOptions = {
        antiprivato: { configKey: "antiprivato", label: " *𝒂𝒏𝒕𝒊𝒑𝒓𝒊𝒗𝒂𝒕𝒐* " },
        anticall: { configKey: "anticall", label: " *𝒂𝒏𝒕𝒊𝒄𝒂𝒍𝒍* " },
        
    };

    let enable = /true|enable|attiva|(turn)?on|1/i.test(command);
    let option = (args[0] || "").toLowerCase();

    if (!option) {
        let menuText = "❔️ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐢𝐧𝐞𝐬𝐢𝐬𝐭𝐞𝐧𝐭𝐞 \n> 𝑫𝒊𝒈𝒊𝒕𝒂 .𝒇𝒖𝒏𝒛𝒊𝒐𝒏𝒊 𝒑𝒆𝒓 𝒔𝒂𝒑𝒆𝒓𝒆 𝒍𝒆 𝒇𝒖𝒏𝒛𝒊𝒐𝒏𝒊 𝒂𝒕𝒕𝒊𝒗𝒂𝒃𝒊𝒍𝒊 𝒆 𝒅𝒊𝒔𝒂𝒕𝒕𝒊𝒗𝒂𝒃𝒊𝒍𝒊.";
        return conn.sendMessage(msg.chat, { text: menuText }, { quoted: msg });
    }

    let targetConfig, opt;

    if (toggleOptions.hasOwnProperty(option)) {
        targetConfig = chatConfig;
        opt = toggleOptions[option];
    } else if (toggleGlobalOptions.hasOwnProperty(option)) {
        targetConfig = botConfig;
        opt = toggleGlobalOptions[option];
    } else {
        return conn.sendMessage(
            msg.chat,
            { text: "❔️ 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 𝐢𝐧𝐞𝐬𝐢𝐬𝐭𝐞𝐧𝐭𝐞 \n> 𝑫𝒊𝒈𝒊𝒕𝒂 .𝒇𝒖𝒏𝒛𝒊𝒐𝒏𝒊 𝒑𝒆𝒓 𝒔𝒂𝒑𝒆𝒓𝒆 𝒍𝒆 𝒇𝒖𝒏𝒛𝒊𝒐𝒏𝒊 𝒂𝒕𝒕𝒊𝒗𝒂𝒃𝒊𝒍𝒊 𝒆 𝒅𝒊𝒔𝒂𝒕𝒕𝒊𝒗𝒂𝒃𝒊𝒍𝒊." },
            { quoted: msg }
        );
    }

// Controllo owner/bot per antinuke
if (option === 'antinuke') {
    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!ownerJids.includes(msg.sender) && msg.sender !== botJid) {
        return conn.sendMessage(
            msg.chat,
            { text: "❌ 𝐒𝐨𝐥𝐨 𝐥'𝐨𝐰𝐧𝐞𝐫 𝐨 𝐢𝐥 𝐛𝐨𝐭 𝐩𝐨𝐬𝐬𝐨𝐧𝐨 𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞/𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞 𝐚𝐧𝐭𝐢𝐧𝐮𝐤𝐞." },
            { quoted: msg }
        );
    }
}

    if (!(opt.configKey in targetConfig)) {
        targetConfig[opt.configKey] = false;
    }
    

    targetConfig[opt.configKey] = enable;

    let stateText = enable ? "*𝑶𝑵* 🟢" : "*𝑶𝑭𝑭* 🔴";
    return conn.sendMessage(
        msg.chat,
        {
            text: `> ✯ ${opt.label} ➼ ${stateText}`,
            buttons: [
                { buttonId: '.funzioni', buttonText: { displayText: '🔧 𝐌𝐞𝐧𝐮 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢' }, type: 1 }
            ],
        },
        { quoted: msg }
    );
};

handler.help = ["toggle <opzione> [stato]"]; 
handler.tags = ["config"]; 
handler.admin = true;
handler.command = /^((attiva|disabilita)|(turn)?[01])$/i;

export default handler;
