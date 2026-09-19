//Fatto da Axtral_WiZaRd
import { generateWAMessageFromContent } from "@axtral_wizard/baileys"
import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'

const { proto } = (await import('@axtral_wizard/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

// Inizializzazione sistema anti-spam globale
global.groupSpam = global.groupSpam || {}

export async function handler(chatUpdate) {
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return

        try {
          
          let user = global.db.data.users[m.sender]
          if (typeof user !== 'object')
              global.db.data.users[m.sender] = {}
          if (user) {
              if (!('registered' in user)) user.registered = false
if (!user.registered) {
if (!('name' in user)) user.name = m.name
if (!isNumber(user.age)) user.age = '👶🏼🍼'
if (!('gender' in user)) user.gender = ''
if (!isNumber(user.regTime)) user.regTime = -1
}
              if (!isNumber(user.messaggi)) user.messaggi = 0
              if (!isNumber(user.warn)) user.warn = 0
              if (!isNumber(user.command)) user.command = 0
              if (!isNumber(user.money)) user.money = 0 
              if (!isNumber(user.bank)) user.bank = 0
              if (!isNumber(user.ultimoprelievo)) user.ultimoprelievo = 0
              if (!isNumber(user.ultimodeposito)) user.ultimodeposito = 0
                if (!('sposato' in user)) user.sposato = false
                if (!('coniuge' in user)) user.coniuge = ""
                if (!('ex' in user)) user.ex = ""
                if (!('amici' in user)) user.amici = []
              if (!('muto' in user)) user.muto = false

          } else global.db.data.users[m.sender] = {
                  messaggi: 0,
                  command: 0,
                  money: 0,
                  bank: 0,
                  warn: 0,
                  muto: false,
                  registered: false,
                  age: '👶🏼🍼',                                   regTime: -1,
                  gender: '',
                  name: m.name,
              }
          let chat = global.db.data.chats[m.chat]
          if (typeof chat !== 'object')
              global.db.data.chats[m.chat] = {}
          if (chat) {
              if (!('isBanned' in chat)) chat.isBanned = false
              if (!('benvenuto' in chat)) chat.benvenuto = false
              if (!('detect' in chat)) chat.detect = false
              if (!('sWelcome' in chat)) chat.sWelcome = ''
              if (!('sBye' in chat)) chat.sBye = ''
              if (!('sPromote' in chat)) chat.sPromote = ''
              if (!('sDemote' in chat)) chat.sDemote = ''
              if (!('bestemmiometro' in chat)) chat.bestemmiometro = false
              if (!('antilink' in chat)) chat.antilink = true
              if (!('antiinsta' in chat)) chat.antiinsta = false
              if (!('antitelegram' in chat)) chat.antitelegram = false
              if (!('antitiktok' in chat)) chat.antitiktok = false
              if (!('antispam' in chat)) chat.antispam = true
              if (!('antispamcmd' in chat)) chat.antispamcmd = true
              if (!('soloviewonce' in chat)) chat.soloviewonce = false
              if (!('antitrava' in chat)) chat.antitrava = true
              if (!('antilinktotale' in chat)) chat.antilinktotale = false
              if (!('antinuke' in chat)) chat.antinuke = false
              if (!('level' in chat)) chat.level = true              
              if (!('solostaff' in chat)) chat.solostaff = true
              if (!isNumber(chat.messaggi)) chat.messaggi = 0
              if (!('name' in chat)) chat.name = m.name
              if (!('name' in chat)) chat.name = this.getName(m.chat)
              if (!('rules' in chat)) chat.rules = ''
          } else
              global.db.data.chats[m.chat] = {
                  name: this.getName(m.chat),
                  isBanned: false,
                  benvenuto: false,
                  detect: false,
                  sWelcome: '',
                  sBye: '',
                  sPromote: '',
                  sDemote: '',
                  bestemmiometro: false,
                  antiinsta: false,
                  antitelegram: false,
                  antitiktok: false,
                  soloviewonce: false,
                  antitrava: true, 
                  solostaff: true,
                  name: m.name,
                  rules: '',
              }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('restrict' in settings)) settings.restrict = true
                if (!('anticall' in settings)) settings.anticall = true
                if (!('antiprivato' in settings)) settings.antiprivato = true
            } else global.db.data.settings[this.user.jid] = {                
                restrict: true,
                anticall: true,
                antiprivato: true,
            }
        } catch (e) {
            console.error(e)
        }

        if (opts['nyimak'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const userId = m.sender.split('@')[0];

        if (m.isBaileys)
            return

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        // Group metadata
        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const normalizedParticipants = participants.map(u => {
            const normalizedId = this.decodeJid(u.id);
            return { ...u, id: normalizedId, jid: u.jid || normalizedId };
        });
        const user = (m.isGroup ? normalizedParticipants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
        const bot = (m.isGroup ? normalizedParticipants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {}

        //INIZIO PATCH RUOLI ADMIN
        async function isUserAdmin(conn, chatId, senderId) {
            try {
                const decodedSender = conn.decodeJid(senderId);
                const groupMeta = groupMetadata;
                return groupMeta?.participants?.some(p =>
                    (conn.decodeJid(p.id) === decodedSender || p.jid === decodedSender) &&
                    (p.admin === 'admin' || p.admin === 'superadmin')
                ) || false;
            } catch {
                return false;
            }
        }

        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isOwner || (m.isGroup ? await isUserAdmin(this, m.chat, m.sender) : false)
        const isBotAdmin = m.isGroup ? await isUserAdmin(this, m.chat, this.user.jid) : false
        //FINE PATCH RUOLI ADMIN
                
        const isPrems = isOwner || (
    m.isGroup
        ? (
            global.prems.includes(userId) ||
            (global.db.data?.groups?.[m.chat]?.prems || []).includes(userId) ||
            isAdmin
        )
        : global.prems.includes(userId)
)

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue
            
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let matchTest = (_prefix instanceof RegExp ? [[_prefix.exec(m.text), _prefix]] : Array.isArray(_prefix) ? _prefix.map(p => { let re = p instanceof RegExp ? p : new RegExp(p.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')); return [re.exec(m.text), re] }) : typeof _prefix === 'string' ? [[new RegExp(_prefix.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')).exec(m.text), new RegExp(_prefix.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'))]] : [[[], new RegExp]]).find(p => p[1])

            const __filename = join(___dirname, name)
            if (typeof plugin.before === 'function') {
                try {
                    if (await plugin.before.call(this, m, {
                        match: matchTest,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isROwner,
                        isOwner,
                        isRAdmin,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })) continue
                } catch (e) {
                    console.error(e)
                }
            }
        }
// INIZIO CONTROLLO MUTATI
        if (global.db.data?.users?.[m.sender]?.muto) {
            if (m.isGroup) {
                await this.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.key.id,
                        participant: m.key.participant || m.sender
                    }
                }).catch(e => console.error("Errore cancellazione muto:", e))
            }
            return
        }
// FINE CONTROLLO MUTATI
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue
            
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename })
                } catch (e) { console.error(e) }
            }
            
            if (!opts['restrict']) {
                if (plugin.tags && plugin.tags.includes('admin')) continue
            }
            
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? 
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? 
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])

            if (typeof plugin !== 'function') continue
 
            if (!m.isGroup && global.db.data.settings[this.user.jid]?.antiprivato && !isOwner && !isROwner) {
                return;
            }

            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split(' ').filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split(' ').slice(1)
                let text = _args.join(' ')
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail 
                let isAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? 
                        plugin.command.some(cmd => cmd instanceof RegExp ? 
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? 
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && chat?.isBanned)
                        return 
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
          let hl = _prefix 
                let adminMode = global.db.data.chats[m.chat].solostaff
let mystica = `${plugin.botAdmin || plugin.admin || plugin.group || plugin || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugin.command}`

const allowedCommands = ['fire', 'cur', 'setuser', 'whosplaying'] 

if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && !isPrems && mystica && !allowedCommands.includes(command)) return

                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { 
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) {
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) {
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) {
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { 
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { 
                    fail('admin', m, this)
                    continue
                }
                if (plugin.staff && !(isAdmin || isPrems)) {
                    fail('staff', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { 
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { 
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true

if (
  m.isGroup &&
  !isOwner &&
  m.isCommand
) {
    if (!global.groupSpam[m.chat]) {
        global.groupSpam[m.chat] = {
            count: 0,
            firstCommandTimestamp: Date.now(),
            isSuspended: false
        }
    }

    const groupData = global.groupSpam[m.chat]
    const now = Date.now()
    if (groupData.isSuspended) return

    if (now - groupData.firstCommandTimestamp > 30000) {
        groupData.count = 1
        groupData.firstCommandTimestamp = now
    } else {
        groupData.count++
    }

    if (groupData.count > 3) {
        groupData.isSuspended = true
        await this.sendMessage(m.chat, {
            text: '> ⚠ 𝐀𝐧𝐭𝐢-𝐬𝐩𝐚𝐦 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 ⚠\n\n𝐑𝐢𝐥𝐞𝐯𝐚𝐭𝐢 𝐭𝐫𝐨𝐩𝐩𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢, 𝐚𝐬𝐩𝐞𝐭𝐭𝐚𝐭𝐞 𝟏𝟎 𝐬𝐞𝐜𝐨𝐧𝐝𝐢 𝐩𝐫𝐢𝐦𝐚 𝐝𝐢 𝐫𝐢𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢.',
            mentions: [m.sender]
        })
        setTimeout(() => {
            groupData.isSuspended = false
            groupData.count = 0
            groupData.firstCommandTimestamp = Date.now()
        }, 10000)
        return
    }
}                             
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                         for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await conn.onWhatsApp(jid))[0] || {}

                            }
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                        
                         break                    }

                                 } 

                 break 
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        
        let chat, user, stats = global.db.data.stats
        if (m) { let utente = global.db.data.users[m.sender]
if (m.isCommand) {
utente.command += 1
}
            if (m.sender && (user = global.db.data.users[m.sender]) && (chat = global.db.data.chats[m.chat])) {
                user.messaggi +=1
                chat.messaggi +=1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        
    }
}


export async function participantsUpdate({ id, participants, action }) {
    if (this.isInit) return
    if (global.db.data == null) await loadDatabase()

    let chat = global.db.data.chats[id] || {}
    let text = ''

    switch (action) {
        case 'add':
case 'remove':
    if (!chat.benvenuto) return

    let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata

    for (let user of participants) {

        let text = ''

        if (action === 'add') {
            text = (chat.sWelcome || this.benvenuto || conn.benvenuto || 'Benvenuto/a @user!')
                .replace('@subject', await this.getName(id))
                .replace('@desc', groupMetadata.desc?.toString() || '')
                .replace('@user', '@' + user.split('@')[0])

        } else if (action === 'remove') {
            text = (chat.sBye || this.bye || conn.bye || 'Addio @user!')
                .replace('@user', '@' + user.split('@')[0])
        }

        const contactQuote = {
            key: {
                participants: "0@s.whatsapp.net",
                fromMe: false,
                id: action === 'add' ? "WelcomeContact" : "ByeContact"
            },
            message: {
                contactMessage: {
                    displayName: action === 'add'
                        ? `𝐁𝐄𝐍𝐕𝐄𝐍𝐔𝐓𝐎/𝐀 👋🏻`
                        : `𝐀𝐃𝐃𝐈𝐎 👋🏻`,
                    vcard: `BEGIN:VCARD
VERSION:3.0
N:;${user.split('@')[0]};;;
FN:${user.split('@')[0]}
item1.TEL;waid=${user.split('@')[0]}:${user.split('@')[0]}
item1.X-ABLabel:WhatsApp
END:VCARD`
                }
            },
            participant: "0@s.whatsapp.net"
        };

        await this.sendMessage(id, {
            text,
            contextInfo: {
                mentionedJid: [user],
            }
        }, {
            quoted: contactQuote
        });
    }
    break
    }
}


export async function groupsUpdate(groupsUpdate) {
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```immagine modificata```').replace('@icon', groupUpdate.icon)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function callUpdate(callUpdate) {
    let isAnticall = global.db.data.settings[this.user.jid].anticall
    if (!isAnticall) return
    for (let nk of callUpdate) {
        if (nk.isGroup == false) {
            if (nk.status == "offer") {
                await this.updateBlockStatus(nk.from, 'block')
            }
        }
    }
}

export async function deleteUpdate(message) {
    return; 
}

global.dfail = (type, m, conn) => {

    let msg = {
        botAdmin: '𝐃𝐞𝐯𝐢 𝐝𝐚𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐚𝐥 𝐛𝐨𝐭 🤖',
        rowner: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐨𝐰𝐧𝐞𝐫 🔱',
        owner: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐨𝐰𝐧𝐞𝐫 🔱',
        staff: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐥𝐨 𝐬𝐭𝐚𝐟𝐟 👑',
        admin: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐚𝐝𝐦𝐢𝐧 🛡️',
        premium: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 👮🏻‍♂️',
        mods: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐥𝐨 𝐩𝐨𝐬𝐬𝐨𝐧𝐨 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐞 𝐬𝐨𝐥𝐨 𝐚𝐝𝐦𝐢𝐧 𝐞 𝐨𝐰𝐧𝐞𝐫 ⚙️',
        group: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮𝐨𝐢 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐥𝐨 𝐢𝐧 𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨 👥',
        private: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮𝐨𝐢 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐥𝐨 𝐢𝐧 𝐜𝐡𝐚𝐭 𝐩𝐫𝐢𝐯𝐚𝐭𝐚 👤',
        restrict: '🔐 𝐑𝐞𝐬𝐭𝐫𝐢𝐜𝐭 𝐞 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨 🔐'
    }[type]

    if (!msg) return

   
 const locationQuote = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "AccessDenied"
        },
        message: {
            locationMessage: {
                name: "🚫 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃 🚫",
                jpegThumbnail: fs.readFileSync('./icone/accessdenied2.png'),
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Bot;;;
FN:Access Denied
item1.TEL;waid=11111111111:+1 (111) 111-1111
item1.X-ABLabel:Bot
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    };

    return conn.sendMessage(m.chat, {
        text: msg,
    }, {
        quoted: locationQuote
    });

};
let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
    