// Codice di info-user.js

//Plugin fatto da Axtral_WiZaRd
import fs from 'fs/promises';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch'; // se non già importato

const handler = async (m, { conn }) => {
  try {
    const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    if (!global.db.data.users[mention]) {
      global.db.data.users[mention] = {
        name: "Sconosciuto",
        messaggi: 0,
        warn: 0,
        warnlink: 0,
        muto: false,
        banned: false,
        command: 0,
        age: "👶🏼🍼",
        gender: "Non specificato",
        instagram: "",
        categoria: "🔘 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚",
        money: 0,
        bank: 0,
        sposato: false,
        coniuge: null,
        animali: [],
        cibo: 0,
        animaliMorti: 0,
        grado: "Pollo"
      };
    }

    const userData = global.db.data.users[mention];

    const rawNumero = mention.split("@")[0];
    const numeroObj = new PhoneNumber(rawNumero);
    let numero = numeroObj.getNumber("e164");
    if (!numero || !numeroObj.isValid()) {
      numero = "+" + rawNumero.replace(/[^0-9]/g, "").replace(/^0+/, "");
    }

    const categoria = userData.categoria || "🔘 Nessuna categoria";

    let ruolo = "Membro 🤍";
    try {
      if (m.isGroup) {
        const metadata = await conn.groupMetadata(m.chat);
        const participants = metadata.participants;
        const groupOwner = metadata.owner;
        const participant = participants.find(p => p.id === mention);

        const isAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
        const isFounder = mention === groupOwner;

        ruolo = isFounder ? 'Founder ⚜️' : isAdmin ? 'Admin 👑' : 'Membro 🤍';
      }
    } catch {
      ruolo = "Membro 🤍";
    }

    let profilo;
    try {
      profilo = await conn.profilePictureUrl(mention, 'image');
    } catch {
      try {
        profilo = await fs.readFile('icone/profilo.png');
      } catch {
        profilo = null;
      }
    }

    const instaDisplay = userData.instagram?.trim()
      ? `instagram.com/${userData.instagram.trim()}`
      : "Non impostato";

    const formatNumber = (n) => n.toLocaleString('it-IT');
    const totale = formatNumber((userData.money || 0) + (userData.bank || 0));
    const statoCivile = userData.sposato ? "💍 Sposato/a" : "🕊️ Single";

    const animaliDisponibili = ['🐶 Cane', '🐱 Gatto', '🐰 Coniglio', '🦜 Pappagallo', '🐢 Tartaruga'];
    const animaliUtente = (userData.animali || []).filter(a => animaliDisponibili.includes(a.nome));

    const animaliInfo = animaliUtente.length > 0
      ? `🐾 *𝐀𝐧𝐢𝐦𝐚𝐥𝐢:* ${animaliUtente.length}`
      : `🐾 *𝐀𝐧𝐢𝐦𝐚𝐥𝐢:* Nessuno`;

    const grado = userData.grado || "Sfavillante";

    const messaggio = `╭── 📌 *𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎* 📌 ──╮\n` +
      `🏆 *𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚:* ${categoria}\n` +
      `🔵 *𝐑𝐮𝐨𝐥𝐨:* ${ruolo}\n` + 
      `🔮 *𝐆𝐫𝐚𝐝𝐨:* ${grado}\n` +
      `📊 *𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢:* ${userData.messaggi}\n` +
      `👛 *𝐏𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨:* ${totale} €\n` +
      `❤️ *𝐒𝐭𝐚𝐭𝐨 𝐜𝐢𝐯𝐢𝐥𝐞:* ${statoCivile}\n` +
      `${animaliInfo}\n` +
      `⚠️ *𝐖𝐚𝐫𝐧:* ${userData.warn} / 3\n` +
      `📆 *𝐄𝐭𝐚̀:* ${userData.age}\n` +
      `🚻 *𝐆𝐞𝐧𝐞𝐫𝐞:* ${userData.gender}\n` +
      `🕹️ *𝐂𝐨𝐦𝐚𝐧𝐝𝐢 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐢:* ${userData.command}\n` +
      `📸 *𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦:* ${instaDisplay}\n` +
      `╰─────────────────╯`;

    const thumbnailBuffer = typeof profilo === 'string' ? await (await fetch(profilo)).buffer() : profilo;

    await conn.sendMessage(m.chat, {
      text: messaggio,
      contextInfo: {
        mentionedJid: [mention],
        externalAdReply: {
  title: userData.name || "Sconosciuto",
  body: "𝑼𝒕𝒆𝒏𝒕𝒆 𝒅𝒊 𝑨𝒙𝒕𝒓𝒂𝒍𝑩𝒐𝒕",
  sourceUrl: "https://wa.me/" + rawNumero,
  thumbnail: thumbnailBuffer
}
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Errore in USERINFO:", error);
    await conn.sendMessage(m.chat, { text: "❌ Errore nel recuperare le informazioni dell'utente." }, { quoted: m });
  }
};

handler.command = /^(info|profilo)$/i;
export default handler;