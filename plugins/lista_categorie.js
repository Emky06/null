const handler = async (m, { conn }) => {
  if (!m.isGroup) {
    return conn.sendMessage(m.chat, { text: "❌ Questo comando può essere usato solo nei gruppi." }, { quoted: m });
  }

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;
  const senderId = m.sender;

  const senderParticipant = participants.find(p => p.id === senderId);
  if (!senderParticipant) return;

  const isAdminOrHigher =
    senderParticipant.admin === "admin" ||
    senderParticipant.admin === "superadmin" ||
    senderId === groupMetadata.owner;

  if (!isAdminOrHigher) {
    return conn.sendMessage(m.chat, {
      text: "❌ Solo admin, co-owner o owner possono usare questo comando."
    }, { quoted: m });
  }

  const categorie = [
    "𝐎𝐰𝐧𝐞𝐫 👑",
    "𝐂𝐨-𝐨𝐰𝐧𝐞𝐫 ⚔️",
    "𝐂𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐨𝐫𝐞 🤝🏻",
    "𝐕𝐢𝐩 💎",
    "𝐕𝐞𝐭𝐞𝐫𝐚𝐧𝐨/𝐚 🎖️",
    "𝐋𝐮𝐝𝐨𝐩𝐚𝐭𝐢𝐜𝐨/𝐚 🎰",
    "𝐂𝐚𝐠𝐚𝐜𝐚𝐳𝐳𝐨 🙄",
    "𝐃𝐢𝐬𝐚𝐛𝐢𝐥𝐞 ♿",
    "𝐌𝐨𝐫𝐭𝐨 𝐝𝐢 𝐟𝐢𝐠𝐚 🤤",
    "𝐏𝐢𝐜𝐤 𝐦𝐞 💅🏻",
    "𝐁𝐨𝐭 🤖"
  ];

  const testo = `📂 *Categorie disponibili:*\n\n${categorie.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;

  await conn.sendMessage(m.chat, { text: testo }, { quoted: m });
};

handler.command = /^categorie$/i;
export default handler;