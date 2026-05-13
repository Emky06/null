import * as baileys from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
  let [, code] =
    text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []

  if (!code) throw '𝐈𝐍𝐒𝐄𝐑𝐈𝐑𝐄 𝐈𝐋 𝐋𝐈𝐍𝐊 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎'

  let res = await conn.query({
    tag: 'iq',
    attrs: {
      type: 'get',
      xmlns: 'w:g2',
      to: '@g.us'
    },
    content: [
      {
        tag: 'invite',
        attrs: { code }
      }
    ]
  })

  let data = extractGroupMetadata(res)

  let txt = `*INFORMAZIONI GRUPPO*\n`
  txt += `➣ *ID*: ${data.id}\n`
  txt += `➣ *Nome*: ${data.subject}\n`
  txt += `➣ *Creato il*: ${data.creation}\n`
  txt += `➣ *Creatore*: @${data.ownerNumber}\n`
  txt += `➣ *Numero membri*: ${data.size}\n`
  txt += `➣ *Amministratori*: ${data.adminText}\n`
  txt += `➣ *Descrizione*: ${data.desc || 'Nessuna descrizione'}\n`

  let pp = await conn.profilePictureUrl(data.id, 'image').catch(() => null)

  let mentions = [
    ...data.adminMentions,
    data.ownerJid
  ].filter(Boolean)

  if (pp) {
    return conn.sendMessage(
      m.chat,
      {
        image: { url: pp },
        caption: txt,
        mentions
      },
      { quoted: m }
    )
  }

  await conn.sendMessage(
    m.chat,
    {
      text: txt,
      mentions
    },
    { quoted: m }
  )
}

handler.command = /^(ispeziona)$/i
handler.rowner = true

export default handler

const extractGroupMetadata = (result) => {
  const group = baileys.getBinaryNodeChild(result, 'group')

  const descChild = baileys.getBinaryNodeChild(group, 'description')

  let desc =
    descChild
      ? baileys.getBinaryNodeChild(descChild, 'body')?.content
      : null

  const participants =
    baileys.getBinaryNodeChildren(group, 'participant') || []

  const adminParticipants = participants.filter(
    p =>
      p.attrs.type === 'admin' ||
      p.attrs.type === 'superadmin'
  )

  const admins = adminParticipants.map(p => {
    const jid = p.attrs.jid || p.attrs.id || ''
    return {
      jid,
      number: jid.split('@')[0]
    }
  })

  let ownerJid =
    adminParticipants[0]?.attrs?.jid ||
    adminParticipants[0]?.attrs?.id ||
    participants[0]?.attrs?.jid ||
    participants[0]?.attrs?.id ||
    ''

  const ownerNumber = ownerJid
    ? ownerJid.split('@')[0]
    : 'sconosciuto'

  const adminText = admins.length
    ? admins.map(a => `@${a.number}`).join(', ')
    : 'Nessuno'

  const size =
    Number(group.attrs.size) ||
    Number(group.attrs.participants) ||
    participants.length ||
    0

  return {
    id: group.attrs.id.includes('@')
      ? group.attrs.id
      : baileys.jidEncode(group.attrs.id, 'g.us'),

    subject: group.attrs.subject || 'Sconosciuto',

    creation: new Date(
      +group.attrs.creation * 1000
    ).toLocaleString('it-IT', {
      timeZone: 'Europe/Rome'
    }),

    ownerJid,

    ownerNumber,

    desc,

    size,

    adminText,

    adminMentions: admins.map(a => a.jid)
  }
}