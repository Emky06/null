//Plugin fatto da Axtral_WiZaRd
let Reg = /^\s*(Maschio|Femmina|Altro)\s+(\d{1,2})$/i

let handler = async function (m, { conn, text, args, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]

  // ===== COMANDO: .reg =====
  if (['reg', 'verify', 'register', 'registrar'].includes(command)) {
    if (user.registered === true) {
      throw `✳️ *Sei già registrato!*\n\n🔄 Vuoi annullare la registrazione?\n📌 Usa:\n*${usedPrefix}unreg*`
    }

    let usage = `🔹 *Uso del comando:* *${usedPrefix + command} Genere Età*\n\n📌 *Esempio:*\n  ${usedPrefix + command} Maschio 18\n\n🔹 *Generi disponibili:*\n  - Maschio\n  - Femmina\n  - Altro`

    if (!Reg.test(text)) throw usage

    let [_, gender, ageStr] = text.match(Reg)
    let age = parseInt(ageStr)

    if (age > 80) throw `👴🏻 *Sei troppo vecchio per registrarti!*`
    if (age < 10) throw `⚠️ *Sei troppo piccolo per registrarti!*`

    let genStr = gender.toLowerCase() === 'maschio' ? `Maschio` :
                gender.toLowerCase() === 'femmina' ? `Femmina` :
                gender.toLowerCase() === 'altro' ? `Non binario` : null

    if (!genStr) throw `⚠️ *Genere non valido.* Usa uno di questi:\n- Maschio\n- Femmina\n- Altro`

    user.name = conn.getName(m.sender)
    user.age = age
    user.gender = genStr
    user.regTime = +new Date()
    user.registered = true

    let confirmation = `✅ *Registrazione completata!*\n\n▢ *Nome:* ${user.name}\n▢ *Genere:* ${genStr}\n▢ *Età:* ${age}\n\n📌 Usa *${usedPrefix}unreg* per annullare la registrazione.`
    return conn.reply(m.chat, confirmation, m)
  }

  // ===== COMANDO: .unreg =====
  if (['unreg', 'unregister'].includes(command)) {
    if (!user.registered) {
      throw `❌ *Non sei registrato.*\n📌 Usa *${usedPrefix}reg Maschio 18* per registrarti.`
    }

    user.registered = false
    user.name = ''
    user.age = -1
    user.gender = ''
    user.regTime = 0

    return conn.reply(m.chat, `✅ *Registrazione annullata con successo!*`, m)
  }
}

handler.help = ['reg <genere età>', 'unreg']
handler.tags = ['rg']
handler.command = ['verify', 'reg', 'register', 'registrar', 'unreg', 'unregister']

export default handler