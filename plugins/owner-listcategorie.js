const handler = async (m, { conn }) => {
  if (!m.isGroup)
    return conn.sendMessage(m.chat, { text: "❌ Questo comando può essere usato solo nei gruppi." }, { quoted: m });

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  const roleImportance = {
    '𝐨𝐰𝐧𝐞𝐫 👑': 13,
    '𝐜𝐨-𝐨𝐰𝐧𝐞𝐫 ⚔️': 12,
    '𝐜𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐨𝐫𝐞 🤝🏻': 11,
    '𝐯𝐢𝐩 💎': 10,
    '𝐯𝐞𝐭𝐞𝐫𝐚𝐧𝐨 🎖️': 9,
    '𝐯𝐞𝐭𝐞𝐫𝐚𝐧𝐚 🎖️': 8,
    '𝐝𝐢𝐬𝐚𝐛𝐢𝐥𝐞 ♿': 7,
    '𝐜𝐚𝐠𝐚𝐜𝐚𝐳𝐳𝐨 🙄': 6,
    '𝐥𝐮𝐝𝐨𝐩𝐭𝐢𝐜𝐨 🎰': 5,
    '𝐥𝐮𝐝𝐨𝐩𝐚𝐭𝐢𝐜𝐚 🎰': 4,
    '𝐦𝐨𝐫𝐭𝐨 𝐝𝐢 𝐟𝐢𝐠𝐚 🤤': 3,
    '𝐏𝐢𝐜𝐤 𝐦𝐞 💅🏻': 2,
    '𝐛𝐨𝐭 🤖': 1,
    'nessuna categoria': 0
  };

  const sortedParticipants = participants.sort((a, b) => {
    const userA = global.db.data.users[a.id] || {};
    const userB = global.db.data.users[b.id] || {};

    const roleA = (userA.categoria || "nessuna categoria").toLowerCase();
    const roleB = (userB.categoria || "nessuna categoria").toLowerCase();

    const importanceA = roleImportance[roleA] || 0;
    const importanceB = roleImportance[roleB] || 0;

    return importanceB - importanceA;
  });

  let messageText = "*📋 Lista utenti con categoria:*\n\n";

  sortedParticipants.forEach((p) => {
    const userId = p.id;
    const userData = global.db.data.users[userId] || {};
    const categoria = userData.categoria || "Nessuna categoria";
    messageText += `@${userId.split("@")[0]} - ${categoria}\n`;
  });

  await conn.sendMessage(
    m.chat,
    { text: messageText, mentions: sortedParticipants.map((p) => p.id) },
    { quoted: m }
  );
};

handler.command = /^(listacategorie)$/i;
handler.owner = true;  // <-- solo owner può usarlo
export default handler;