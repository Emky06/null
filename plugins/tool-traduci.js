import translate from '@vitalets/google-translate-api'
import fetch from 'node-fetch'

let handler = async (m, { args, usedPrefix, command }) => {

  let msg = `Uso corretto: ${usedPrefix + command} [lingua] testo`
  if (!args || !args[0]) return m.reply(msg)

  let lang = args[0]
  let text = args.slice(1).join(' ')

  const defaultLang = 'it'

  if (!lang || lang.length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }

  if (!text && m.quoted?.text) text = m.quoted.text

  if (!text) return m.reply('Inserisci del testo da tradurre.')

  try {
    let result = await translate(text, {
      to: lang,
      autoCorrect: true
    })

    let output = result?.text || result?.[0]

    if (!output) throw new Error()

    return m.reply('Traduzione:\n' + output)

  } catch (e) {
    try {
      let apiUrl = `https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${encodeURIComponent(text)}`
      let res = await fetch(apiUrl)
      let json = await res.json()

      let output = json?.result?.translated

      if (!output) return m.reply('Errore traduzione')

      return m.reply('Traduzione:\n' + output)

    } catch (e2) {
      return m.reply('Errore durante la traduzione.')
    }
  }
}

handler.command = /^(translate|traducir|trad)$/i
export default handler