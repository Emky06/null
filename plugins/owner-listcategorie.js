import { ROLE_IMPORTANCE } from "../lib/categorie.js";

const handler = async (m, { conn }) => {
  if (!m.isGroup)
    return conn.sendMessage(m.chat, { text: "❌ 𝐒𝐨𝐥𝐨 𝐧𝐞𝐢 𝐠𝐫𝐮𝐩𝐩𝐢." }, { quoted: m });

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  const sortedParticipants = participants.sort((a, b) => {
    const userA = global.db.data.users[a.id] || {};
    const userB = global.db.data.users[b.id] || {};

    const roleA = (userA.categoria || "nessuna categoria").toLowerCase();
    const roleB = (userB.categoria || "nessuna categoria").toLowerCase();

    const importanceA = ROLE_IMPORTANCE[roleA] || 0;
    const importanceB = ROLE_IMPORTANCE[roleB] || 0;

    return importanceB - importanceA;
  });

  let messageText = "*📋 𝐋𝐢𝐬𝐭𝐚 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚:*\n\n";

  sortedParticipants.forEach((p) => {
    const userData = global.db.data.users[p.id] || {};
    const categoria = userData.categoria || "Nessuna categoria";
    messageText += `@${p.id.split("@")[0]} - ${categoria}\n`;
  });

  await conn.sendMessage(
    m.chat,
    { text: messageText, mentions: sortedParticipants.map((p) => p.id) },
    { quoted: m }
  );
};

handler.command = /^(listacategorie)$/i;
handler.owner = true;

export default handler;