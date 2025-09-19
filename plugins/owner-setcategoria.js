const handler = async (m, { conn, args }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender;
  const newCategoria = args.slice(1).join(" ").toLowerCase();

  const CATEGORIE = {
    "veterano": "𝐕𝐞𝐭𝐞𝐫𝐚𝐧𝐨 🎖️",
    "veterana": "𝐕𝐞𝐭𝐞𝐫𝐚𝐧𝐚 🎖️",
    "vip": "𝐕𝐢𝐩 💎",
    "owner": "𝐎𝐰𝐧𝐞𝐫 👑",
    "disabile": "𝐃𝐢𝐬𝐚𝐛𝐢𝐥𝐞 ♿",
    "cagacazzo": "𝐂𝐚𝐠𝐚𝐜𝐚𝐳𝐳𝐨 🙄",
    "ludopatico": "𝐋𝐮𝐝𝐨𝐩𝐚𝐭𝐢𝐜𝐨 🎰",
    "ludopatica": "𝐋𝐮𝐝𝐨𝐩𝐚𝐭𝐢𝐜𝐚 🎰",
    "morto di figa": "𝐌𝐨𝐫𝐭𝐨 𝐝𝐢 𝐟𝐢𝐠𝐚 🤤",
    "pick me": "𝐏𝐢𝐜𝐤 𝐦𝐞 💅🏻",
    "co-owner": "𝐂𝐨-𝐎𝐰𝐧𝐞𝐫 ⚔️",
    "collaboratore": "𝐂𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐨𝐫𝐞 🤝🏻",
    "bot": "𝐁𝐨𝐭 🤖"
  };

  if (!mention) {
    return conn.sendMessage(m.chat, { text: `❌ Usa: .setcategoria @utente nome categoria` }, { quoted: m });
  }

  if (!CATEGORIE[newCategoria]) {
    return conn.sendMessage(m.chat, { text: `❌ Categoria non valida.\nUsa il comando .categorie per vedere quelle disponibili.` }, { quoted: m });
  }

  if (!global.db.data.users[mention]) {
    global.db.data.users[mention] = {};
  }

  global.db.data.users[mention].categoria = CATEGORIE[newCategoria];

  await conn.sendMessage(m.chat, { text: `✅ Categoria di @${mention.split("@")[0]} impostata su *${CATEGORIE[newCategoria]}*.`, mentions: [mention] }, { quoted: m });
};

handler.command = /^(setcategoria)$/i;
handler.owner = true;  // solo owner può usarlo
export default handler;