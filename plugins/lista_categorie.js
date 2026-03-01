//Plugin fatto da Axtral_WiZaRd

import { CATEGORIE } from "./categorie.js";

const handler = async (m, { conn }) => {

  const testo = `📂 *𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢:*\n\n` +
    CATEGORIE.map((c, i) => `${i + 1}. ${c.display}`).join("\n");

  await conn.sendMessage(
    m.chat,
    { text: testo },
    { quoted: m }
  );
};

handler.command = /^categorie$/i;
handler.group = true;

export default handler;