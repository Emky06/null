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
        soloadmin: { configKey: "soloadmin", label: " *𝒔𝒐𝒍𝒐𝒂𝒅𝒎𝒊𝒏* " },
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

// Controllo owner per antinuke
if (option === 'antinuke') {
    const isOwner = global.owner.map(([number]) => number + '@s.whatsapp.net').includes(msg.sender);
    if (!isOwner) {
        return conn.sendMessage(
            msg.chat,
            { text: "❌ 𝐒𝐨𝐥𝐨 𝐥'𝐨𝐰𝐧𝐞𝐫 𝐩𝐮𝐨̀ 𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞 𝐨 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐫𝐞 𝐚𝐧𝐭𝐢𝐧𝐮𝐤𝐞." },
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