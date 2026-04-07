//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

const whitelistFile = './autorizzati-antinuke.json'

if (!fs.existsSync(whitelistFile)) {
  fs.writeFileSync(whitelistFile, '{}', 'utf-8')
}

const readWhitelist = () => {
  return JSON.parse(fs.readFileSync(whitelistFile, 'utf-8'))
}

const writeWhitelist = data => {
  fs.writeFileSync(whitelistFile, JSON.stringify(data, null, 2), 'utf-8')
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!m.isGroup) return

  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
  const sender = m.key?.participant || m.participant || m.sender

  const whitelist = readWhitelist()
  if (!whitelist[m.chat]) whitelist[m.chat] = { autorizzati: [] }

  let targetJid = null

  if (m.quoted?.sender) targetJid = m.quoted.sender
  else if (m.mentionedJid?.length) targetJid = m.mentionedJid[0]
  else if (args[0]) {
  const numberInput = args.join('') 
  targetJid = numberInput.replace(/\D/g, '') + '@s.whatsapp.net'
}
  else return m.reply(
`❌ 𝐔𝐬𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐢𝐧 𝐮𝐧𝐨 𝐝𝐞𝐢 𝐬𝐞𝐠𝐮𝐞𝐧𝐭𝐢 𝐦𝐨𝐝𝐢:

1️⃣ 𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐧𝐝𝐨 𝐚𝐝 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐞𝐥𝐥'𝐮𝐭𝐞𝐧𝐭𝐞:
${usedPrefix}${command} (𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐧𝐝𝐨 𝐚𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨) 

2️⃣ 𝐓𝐚𝐠𝐠𝐚𝐧𝐝𝐨 𝐥'𝐮𝐭𝐞𝐧𝐭𝐞:
${usedPrefix}${command} @username

3️⃣ 𝐈𝐧𝐬𝐞𝐫𝐞𝐧𝐝𝐨 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐢𝐫𝐞𝐭𝐭𝐚𝐦𝐞𝐧𝐭𝐞:
${usedPrefix}${command} +39 333 123 4567`
)

  if (command === 'addwhitelist') {
    if (whitelist[m.chat].autorizzati.includes(targetJid)) {
      return m.reply('⚠️ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐠𝐢𝐚̀ 𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞 𝐧𝐞𝐥𝐥𝐚 𝐰𝐡𝐢𝐭𝐞𝐥𝐢𝐬𝐭.')
    }

    whitelist[m.chat].autorizzati.push(targetJid)
    writeWhitelist(whitelist)

    return conn.sendMessage(
  m.chat,
  {
    text: `✅ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐚𝐠𝐠𝐢𝐮𝐧𝐭𝐨 𝐚𝐥𝐥𝐚 𝐰𝐡𝐢𝐭𝐞𝐥𝐢𝐬𝐭:\n@${targetJid.split('@')[0]}`,
    mentions: [targetJid]
  },
  { quoted: m }
)
  }

  if (command === 'delwhitelist') {
    whitelist[m.chat].autorizzati =
      whitelist[m.chat].autorizzati.filter(jid => jid !== targetJid)

    writeWhitelist(whitelist)

    return conn.sendMessage(
  m.chat,
  {
    text: `❌ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐚𝐥𝐥𝐚 𝐰𝐡𝐢𝐭𝐞𝐥𝐢𝐬𝐭:\n@${targetJid.split('@')[0]}`,
    mentions: [targetJid]
  },
  { quoted: m }
)
  }
}

handler.before = async function (m, { conn, participants, isBotAdmin }) {
  if (!m.isGroup || !isBotAdmin) return

  const whitelist = readWhitelist()
  const groupWhitelist = whitelist[m.chat]?.autorizzati || []
  const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net')
  const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
  const sender = m.key?.participant || m.participant || m.sender

  let founderJid = null
  try {
    const metadata = await conn.groupMetadata(m.chat)
    founderJid = metadata.owner
  } catch {}

  const isAuthorized = jid =>
    groupWhitelist.includes(jid) ||
    ownerJids.includes(jid) ||
    jid === botJid ||
    jid === founderJid

  const cleanAdmins = async () => {
    const chat = global.db.data.chats[m.chat];
    if (!chat?.antinuke) return;

    const usersToDemote = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botJid &&
            !ownerJids.includes(jid) &&
            !groupWhitelist.includes(jid) &&
            jid !== founderJid
        );

    if (!usersToDemote.length) return;

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToDemote, 'demote');
        await conn.groupSettingUpdate(m.chat, 'announcement');

        const sender = m.key?.participant || m.participant || m.sender;

        if ([29, 30].includes(m.messageStubType)) {
            const targetUser = m.messageStubParameters[0];
            const actionText = m.messageStubType === 29 ? '𝐡𝐚 𝐩𝐫𝐨𝐦𝐨𝐬𝐬𝐨' : '𝐡𝐚 𝐫𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐨';

            const text = `🚨 𝐀𝐍𝐓𝐈-𝐍𝐔𝐊𝐄 𝐀𝐓𝐓𝐈𝐕𝐎
👤 @${sender.split('@')[0]} ${actionText} @${targetUser.split('@')[0]} 𝐬𝐞𝐧𝐳𝐚 𝐚𝐮𝐭𝐨𝐫𝐢𝐳𝐳𝐚𝐳𝐢𝐨𝐧𝐞.
🔒 𝐆𝐫𝐮𝐩𝐩𝐨 𝐜𝐡𝐢𝐮𝐬𝐨 𝐩𝐞𝐫 𝐬𝐢𝐜𝐮𝐫𝐞𝐳𝐳𝐚.`;

            await conn.sendMessage(m.chat, { text, mentions: [sender, targetUser] });
        } else {
            const actionText = m.messageStubType === 28 ? '𝐡𝐚 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐮𝐧 𝐦𝐞𝐦𝐛𝐫𝐨' : '𝐡𝐚 𝐜𝐚𝐦𝐛𝐢𝐚𝐭𝐨 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐩𝐨';

            const text = `🚨 𝐀𝐍𝐓𝐈-𝐍𝐔𝐊𝐄 𝐀𝐓𝐓𝐈𝐕𝐎
👤 @${sender.split('@')[0]} ${actionText} 𝐬𝐞𝐧𝐳𝐚 𝐚𝐮𝐭𝐨𝐫𝐢𝐳𝐳𝐚𝐳𝐢𝐨𝐧𝐞.
🔒 𝐆𝐫𝐮𝐩𝐩𝐨 𝐜𝐡𝐢𝐮𝐬𝐨 𝐩𝐞𝐫 𝐬𝐢𝐜𝐮𝐫𝐞𝐳𝐳𝐚.`;

            await conn.sendMessage(m.chat, { text, mentions: [sender] });
        }

        console.log('[ANTINUKE] Retrocessi e chat chiusa:', usersToDemote);
    } catch (e) {
        console.error('[ANTINUKE] Errore:', e);
    }
};

  if (m.messageStubType === 29) {
    // Promozione
    if (!isAuthorized(sender)) await cleanAdmins()
  } else if (m.messageStubType === 30) {
    // Retrocessione
    if (!isAuthorized(sender)) await cleanAdmins()
  } else if (m.messageStubType === 28) {
    // Rimozione membro
    if (!isAuthorized(sender)) {
        // await cleanAdmins()
    }
  } else if (m.messageStubType === 21) {
    // Cambio nome gruppo 
    if (!isAuthorized(sender)) await cleanAdmins()
  }
}

handler.command = ['addwhitelist', 'delwhitelist']
handler.group = true
handler.owner = true

export default handler