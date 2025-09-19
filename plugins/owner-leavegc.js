let handler = async (m, { conn }) => {
    await m.reply('*Addio coglioni*');
    await conn.groupLeave(m.chat);
};

handler.command = /^(byebye)$/i;
handler.group = true;
handler.owner = true;
export default handler;