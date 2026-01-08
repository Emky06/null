// Codice di tools-immagine.js

import { googleImage } from '@bochilteam/scraper'
import { existsSync } from 'fs'
import axios from 'axios'

const paroleproibite = [
  'sangue', 'gore', 'decapitazione', 'omicidio', 'suicidio', 'cadavere', 'corpo morto',
  'autolesionismo', 'arma', 'sparare', 'mutilazione',
  'porno', 'sessuale', 'nudo', 'nuda', 'nudità', 'sex', 'xxx', 'hardcore', 'orgia',
  'tette', 'seni', 'pene', 'vagina', 'culo', 'anale', 'masturbazione', 'fellatio',
  '69', 'sesso', 'gay sex', 'lesbica', 'incesto', 'fetish', 'bdsm',
  'nazista', 'hitler', 'razzismo', 'omofobia', 'islamofobia', 'antisemitismo',
  'terrorismo', 'pedofilia', 'necrofili',
  'droga', 'eroina', 'cocaina', 'stupefacenti', 'pedopornografia', 'bestialità',
  'stupri', 'stupro', 'violentare', 'tortura', 'traffico di organi', 'snuff',
  'deepfake', 'fake nudes', 'fake porno', 'modifica porno',
  'impiccarsi', 'tagliarsi', 'soffocare', 'morire', 'uccidersi', 'suicidarsi',
  'sexy', 'sensuale', 'hot girl', 'hot boy', 'cam girl', 'webcam sex', 'striptease'
]

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  

  const input = text || m.quoted?.text
  if (!input) return conn.reply(m.chat, `> ⓘ Uso del comando:\n> ${usedPrefix + command} <parola chiave>`, m)

  const filtroGPT = `
Controlla se nel seguente testo è presente un termine inappropriato o ostile, in qualsiasi lingua:

"${input}"

Se contiene contenuti sessuali, violenti, razzisti, illegali, deepfake, o simili, rispondi solo con "vietato", altrimenti rispondi "ok".
`

  try {
    const filtro = await axios.post("https://luminai.my.id", {
      content: filtroGPT,
      user: m.pushName || "utente",
      prompt: `Rispondi con una singola parola.`,
      webSearchMode: false
    })

    const out = filtro.data?.result?.toLowerCase()
    if (out.includes('vietato')) {
      return conn.reply(m.chat, '⚠️ Contenuto non permesso.', m)
    }
  } catch (err) {
    console.log('Filtro GPT fallito, fallback su lista manuale.')
    if (paroleproibite.some(word => input.toLowerCase().includes(word))) {
      return conn.reply(m.chat, '⚠️ Questo contenuto non è permesso.', m)
    }
  }

  const randomOffset = Math.floor(Math.random() * 10)
  const query = `${input} ${randomOffset}`
  const res = await googleImage(query)
  if (!res || res.length === 0) return conn.reply(m.chat, '𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞 𝐭𝐫𝐨𝐯𝐚𝐭𝐚 😢', m)

  shuffle(res)
  const images = res.slice(0, 5)

  const cards = images.map((img, i) => ({
    image: { url: img },
    title: `𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞 #${i + 1}`,
    body: `𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐨 𝐩𝐞𝐫: ${input}`,
    footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
    buttons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '𝐀𝐩𝐫𝐢 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐞',
          url: img
        })
      }
    ]
  }))

  await conn.sendMessage(
    m.chat,
    {
      text: `🔍 𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐢 𝐩𝐞𝐫: ${input}`,
      title: `𝐑𝐢𝐬𝐮𝐥𝐭𝐚𝐭𝐢 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐢`,
      subtitle: `𝐄𝐜𝐜𝐨 𝐥𝐞 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐢 𝐭𝐫𝐨𝐯𝐚𝐭𝐞 𝐬𝐮 𝐆𝐨𝐨𝐠𝐥𝐞`,
      footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
      cards
    },
    { quoted: m }
  )

  await conn.sendMessage(
    m.chat,
    {
      text: '🔄 𝐕𝐮𝐨𝐢 𝐜𝐞𝐫𝐜𝐚𝐫𝐞 𝐚𝐥𝐭𝐫𝐞 𝐢𝐦𝐦𝐚𝐠𝐢𝐧𝐢 𝐜𝐨𝐧 𝐥𝐨 𝐬𝐭𝐞𝐬𝐬𝐨 𝐭𝐞𝐫𝐦𝐢𝐧𝐞?',
      footer: '𝐁𝐲 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕',
      buttons: [
        {
          buttonId: `${usedPrefix}cercaimmagine ${input}`,
          buttonText: { displayText: '𝐂𝐞𝐫𝐜𝐚 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨' },
          type: 1
        }
      ],
      headerType: 1
    },
    { quoted: m }
  )
}

handler.command = ['cercaimmagine', 'ci']
export default handler