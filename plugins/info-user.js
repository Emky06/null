//Plugin fatto da Axtral_WiZaRd
import fs from 'fs/promises';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  try {
    const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    if (!global.db.data.users[mention]) {
      global.db.data.users[mention] = {
        messaggi: 0,
        warn: 0,
        command: 0,
        age: "👶🏼🍼",
        gender: "Non specificato",
        instagram: "",
        categoria: "🔘 𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚",
        money: 0,
        bank: 0,
        sposato: false,
        animali: [],
        grado: "Pollo",
        fuochi: 0
      };
    }

    const userData = global.db.data.users[mention];
    let nomeUtente = "Sconosciuto";
    try {
      nomeUtente = await conn.getName(mention);
      if (!nomeUtente) nomeUtente = "Sconosciuto";
    } catch {
      nomeUtente = "Sconosciuto";
    }

    const categoria = userData.categoria || "🔘 Nessuna categoria";

let ruolo = "Membro 🤍"

if (m.isGroup) {
  try {
    const metadata = await conn.groupMetadata(m.chat)

    const userJid = conn.decodeJid(mention)
    const ownerJid = conn.decodeJid(metadata.owner)

    const groupPrems = global.db?.data?.groups?.[m.chat]?.prems || []

    const isFounder = ownerJid === userJid

    const isAdmin = metadata.participants.some(p => {
      const pid = conn.decodeJid(p.jid || p.id)
      return pid === userJid && (p.admin === 'admin' || p.admin === 'superadmin')
    })

    const isPremium =
      groupPrems.includes(userJid) ||
      groupPrems.includes(userJid.split('@')[0])

    if (isFounder) ruolo = "Founder ⚜️"
    else if (isAdmin) ruolo = "Admin 🛡️"
    else if (isPremium) ruolo = "Moderatore 👮🏻‍♂️"

  } catch (e) {
    ruolo = "Membro 🤍"
  }
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

    const animaliCount = (userData.animali || []).length;

const animaliInfo = animaliCount > 0
  ? `🐾 *𝐀𝐧𝐢𝐦𝐚𝐥𝐢:* ${animaliCount}`
  : `🐾 *𝐀𝐧𝐢𝐦𝐚𝐥𝐢:* Nessuno`;

    const grado = userData.grado || "Sfavillante";

    const messaggio = `╭── 📌 *𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎* 📌 ──╮\n` +
      `👤 *𝐔𝐭𝐞𝐧𝐭𝐞:* ${nomeUtente}\n` +
      /*`🏆 *𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚:* ${categoria}\n` +*/
      `🔵 *𝐑𝐮𝐨𝐥𝐨:* ${ruolo}\n` + 
      `🔮 *𝐆𝐫𝐚𝐝𝐨:* ${grado}\n` +
      `📊 *𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢:* ${userData.messaggi}\n` +
      `🔥 *𝐅𝐮𝐨𝐜𝐡𝐢:* ${userData.fuochi || 0}\n` +
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
        /*externalAdReply: {
          title: nomeUtente,
          body: "𝑼𝒕𝒆𝒏𝒕𝒆 𝒅𝒊 𝑨𝒙𝒕𝒓𝒂𝒍_𝑾𝒊𝒁𝒂𝑹𝒅",
          mediaType: 1,
          thumbnail: thumbnailBuffer,
          renderLargerThumbnail: false
        }*/
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Errore in USERINFO:", error);
    await conn.sendMessage(m.chat, { text: "❌ Errore nel recuperare le informazioni dell'utente." }, { quoted: m });
  }
};

handler.command = /^(info|profilo)$/i;
export default handler;
