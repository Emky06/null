//Plugin fatto da Axtral_WiZaRd
import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'

const _fs = fs.promises

let handler = async (m, { text, usedPrefix, command, __dirname, conn }) => {
  if (!text) throw `
> Utilizzo: ${usedPrefix + command} <nome file/percorso>
Esempi:
  ${usedPrefix}getplugin menu-gruppo
  ${usedPrefix}getfile config.js
  `.trim()

  const args = text.trim().split(' ')
  let option = ''
  if (args.length > 1 && (args[args.length - 1].toLowerCase() === 'file' || args[args.length - 1].toLowerCase() === 'script')) {
    option = args.pop().toLowerCase() 
  }
  const fileArg = args.join(' ') 

  let isPlugin = /p(lugin)?/i.test(command)
  let filename, pathFile

  if (isPlugin) {
    filename = fileArg.replace(/plugin(s)?\//i, '') + (/\.js$/i.test(fileArg) ? '' : '.js')
    pathFile = path.join(__dirname, filename)
  } else {
    filename = path.basename(fileArg)
    pathFile = fileArg
  }

  const header = "//Fatto da Axtral_WiZaRd\n"

  try {
    const isJS = /\.js$/i.test(filename)
    let fileContent

    if (isJS) {
      fileContent = await _fs.readFile(pathFile, 'utf8')
    } else {
      fileContent = await _fs.readFile(pathFile)
    }

    
    if (!option) {
      await conn.sendMessage(m.chat, {
        text: `📂 Vuoi ricevere *${filename}* come file o come script?`,
        footer: 'Scegli un\'opzione:',
        buttons: [
          {
            buttonId: `${usedPrefix + command} ${fileArg} file`,
            buttonText: { displayText: '📂 File' },
            type: 1
          },
          {
            buttonId: `${usedPrefix + command} ${fileArg} script`,
            buttonText: { displayText: '📜 Script' },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: m })
      return
    }

    
    if (option === 'file') {
      const contentToSend = isJS ? header + fileContent : fileContent
      await conn.sendMessage(m.chat, {
        document: Buffer.from(contentToSend, isJS ? 'utf8' : undefined),
        mimetype: isJS ? 'application/javascript' : undefined,
        fileName: filename,
        caption: isPlugin ? `Ecco il plugin: ${filename}` : `Ecco il file: ${filename}`
      }, { quoted: m })
    } else if (option === 'script') {
      if (!isJS) throw '❌ L\'opzione script è disponibile solo per file JavaScript.'
      await m.reply(`// Codice di ${filename}\n\n${fileContent}`)
    } else {
      throw '❌ Opzione non valida! Usa "file" o "script".'
    }

    if (isJS) {
      const error = syntaxError(fileContent, filename, {
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
      })
      if (error) {
        await m.reply(`⛔️ Errore in *${filename}*:\n\n${error}`.trim())
      }
    }
  } catch (err) {
    await m.reply(`❌ Errore: Il file *${filename}* non esiste o non può essere letto.\n${err}`)
  }
}

handler.help = ['getplugin <nome file>', 'getfile <percorso file>']
handler.tags = ['owner']
handler.command = /^g(et)?(p(lugin)?|f(ile)?)$/i
handler.rowner = true

export default handler