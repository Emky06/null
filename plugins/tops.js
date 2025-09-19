import util from 'util'
import path from 'path'
let user = a => '@' + a.split('@')[0]

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function handler(m, { groupMetadata, command, conn, participants }) {
    let ps = groupMetadata.participants.map(v => v.id)

    if (ps.length < 10) {
        return m.reply('Il gruppo deve avere almeno 10 partecipanti.')
    }

    if (command == 'topgays') {
        let [a, b, c, d, e, f, g, h, i, j] = shuffle([...ps]).slice(0, 10)
        let top = `*🌈𝐓𝐎𝐏 𝟏𝟎 𝐋𝐆𝐁𝐓🌈*

*1-➤* ${user(a)}
*2-➤* ${user(b)}
*3-➤* ${user(c)}
*4-➤* ${user(d)}
*5-➤* ${user(e)}
*6-➤* ${user(f)}
*7-➤* ${user(g)}
*8-➤* ${user(h)}
*9-➤* ${user(i)}
*10-➤* ${user(j)}`
        m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j] })
    }

    if (command == 'topnazi') {
        let [a, b, c, d, e, f, g, h, i, j] = shuffle([...ps]).slice(0, 10)
        let top = `*࿖𝐓𝐎𝐏 𝟏𝟎 𝐍𝐀𝐙𝐈࿖*

*1-➤* ${user(a)}
*2-➤* ${user(b)}
*3-➤* ${user(c)}
*4-➤* ${user(d)}
*5-➤* ${user(e)}
*6-➤* ${user(f)}
*7-➤* ${user(g)}
*8-➤* ${user(h)}
*9-➤* ${user(i)}
*10-➤* ${user(j)}`
        m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j] })
    }

    if (command == 'topsexy') {
        let [a, b, c, d, e, f, g, h, i, j] = shuffle([...ps]).slice(0, 10)
        let top = `*😏𝐓𝐨𝐩 𝟏𝟎 𝐒𝐄𝐗𝐘😏*

*1-➤* ${user(a)}
*2-➤* ${user(b)}
*3-➤* ${user(c)}
*4-➤* ${user(d)}
*5-➤* ${user(e)}
*6-➤* ${user(f)}
*7-➤* ${user(g)}
*8-➤* ${user(h)}
*9-➤* ${user(i)}
*10-➤* ${user(j)}`
        m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j] })
    }

    if (command == 'toptroie') {
        let [a, b, c, d, e, f, g, h, i, j] = shuffle([...ps]).slice(0, 10)
        let top = `*𝐓𝐨𝐩 𝟏𝟎 𝐓𝐑𝐎𝐈𝐄*

*1-➤* ${user(a)}
*2-➤* ${user(b)}
*3-➤* ${user(c)}
*4-➤* ${user(d)}
*5-➤* ${user(e)}
*6-➤* ${user(f)}
*7-➤* ${user(g)}
*8-➤* ${user(h)}
*9-➤* ${user(i)}
*10-➤* ${user(j)}`
        m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j] })
    }
}

handler.help = handler.command = ['topgays','topnazi', 'topsexy','toptroie']
handler.tags = ['games']
handler.group = true
handler.admin = true
export default handler