//Plugin fatto da Axtral_WiZaRd
import { CATEGORIE } from "./categorie.js";

const handler = async (m, { conn, args }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender;
  const inputCategoria = args.slice(1).join(" ").toLowerCase();

  if (!mention)
    return conn.sendMessage(
      m.chat,
      { text: "❌ 𝐔𝐬𝐚: .setcategoria @utente categoria" },
      { quoted: m }
    );

  const categoriaObj = CATEGORIE.find(
    (c) => c.key === inputCategoria
  );

  if (!categoriaObj)
    return conn.sendMessage(
      m.chat,
      { text: "❌ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚. 𝐔𝐬𝐚 .categorie 𝐩𝐞𝐫 𝐯𝐞𝐝𝐞𝐫𝐞 𝐪𝐮𝐞𝐥𝐥𝐞 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢." },
      { quoted: m }
    );

  if (!global.db.data.users[mention])
    global.db.data.users[mention] = {};

  global.db.data.users[mention].categoria = categoriaObj.label;

  await conn.sendMessage(
    m.chat,
    {
      text: `✅ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚 𝐝𝐢 @${mention.split("@")[0]} 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐚 𝐬𝐮 *${categoriaObj.label}*`,
      mentions: [mention]
    },
    { quoted: m }
  );
};

handler.command = /^(setcategoria)$/i;
handler.owner = true;

export default handler;