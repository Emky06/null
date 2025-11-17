import { generateWAMessageFromContent } from "@whiskeysockets/baileys"
import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import NodeCache from 'node-cache'

// Inizializzazione sistema anti-spam globale e cache
global.ignoredUsersGlobal = global.ignoredUsersGlobal || new Set()
global.ignoredUsersGroup = global.ignoredUsersGroup || {}
global.groupSpam = global.groupSpam || {}
global.lastRemovals = global.lastRemovals || {}

// Inizializzazione cache per gruppi e admin
if (!global.groupCache) {
    global.groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false })
}
if (!global.adminCache) {
    global.adminCache = new NodeCache({ stdTTL: 5 * 60, useClones: false })
}

// Funzione per recuperare i metadati del gruppo
async function fetchGroupMetadataWithRetry(conn, chatId, retries = 3, delayMs = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const metadata = await conn.groupMetadata(chatId);
            return metadata;
        } catch (e) {
            console.error(`[ERRORE] Tentativo ${i + 1} fallito nel recuperare i metadati per ${chatId}:`, e);
            if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    console.error(`[ERRORE] Impossibile recuperare i metadati per ${chatId} dopo ${retries} tentativi`);
    return null;
}

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    // Traccia i comandi di kick
    if (m.message && (m.message.conversation || m.message.extendedTextMessage)) {
        const text = (m.message.conversation || m.message.extendedTextMessage?.text || '').toLowerCase();
        
        // Lista comandi di kick
        const removeCommands = [
            '.kick', '.kamehameha', '.getout', '.avadakedavra', '.sparisci', '.caccola', '.vongole', '.puffo', '.allahuakbar',
            'kick', 'kamehameha', 'getout', 'avadakedavra', 'sparisci', 'caccola', 'vongole', 'puffo', 'allahuakbar',
        ];
        
        const isRemoveCommand = removeCommands.some(cmd => text.startsWith(cmd + ' ') || text === cmd);
        
        if (isRemoveCommand && m.key.remoteJid && m.key.remoteJid.includes('@g.us')) {
            const mentionedJids = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            
            for (const userJid of mentionedJids) {
                const removalKey = `${m.key.remoteJid}_${userJid}`;
                global.lastRemovals[removalKey] = {
                    timestamp: Date.now(),
                    admin: m.sender,
                    group: m.key.remoteJid
                };
                
                setTimeout(() => {
                    if (global.lastRemovals[removalKey]) {
                        delete global.lastRemovals[removalKey];
                    }
                }, 5000);
            }
        }
    }
    // Fine tracciamento
    if (!m)
        return
    
    // Normalizza i JID
    if (m.key) {
        m.key.remoteJid = this.decodeJid(m.key.remoteJid);
        if (m.key.participant) m.key.participant = this.decodeJid(m.key.participant);
    }
    if (!m.key.remoteJid) return;
    
    // Monkey-patch 
    if (!this.originalGroupParticipantsUpdate) {
        this.originalGroupParticipantsUpdate = this.groupParticipantsUpdate;
        this.groupParticipantsUpdate = async function(chatId, users, action) {
            try {
                let metadata = global.groupCache.get(chatId);
                if (!metadata) {
                    metadata = await fetchGroupMetadataWithRetry(this, chatId);
                    if (metadata) global.groupCache.set(chatId, metadata);
                }
                if (!metadata) {
                    console.error('[ERRORE] Nessun metadato del gruppo disponibile per un aggiornamento sicuro');
                    return this.originalGroupParticipantsUpdate.call(this, chatId, users, action);
                }

                const correctedUsers = users.map(userJid => {
                    const decoded = this.decodeJid(userJid);
                    const phone = decoded.split('@')[0].split(':')[0];
                    const participant = metadata.participants.find(p => {
                        const pId = this.decodeJid(p.id || p.jid || '');
                        const pPhone = pId.split('@')[0].split(':')[0];
                        return pPhone === phone;
                    });
                    return participant ? participant.id : userJid;
                });

                return this.originalGroupParticipantsUpdate.call(this, chatId, correctedUsers, action);
            } catch (e) {
                console.error('[ERRORE] Errore in safeGroupParticipantsUpdate:', e);
                throw e;
            }
        };
    }

    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
      m.exp = 0;
      m.money = false;
      m.limit = false;
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
              if (!isNumber(user.command)) user.command = 0
              if (!isNumber(user.blasphemy)) user.blashpemy = 0
              if (!isNumber(user.msg)) user.msg = {}
              if (!isNumber(user.exp)) user.exp = 0
              if (!isNumber(user.money)) user.money = 0 
              if (!isNumber(user.lvl)) user.lvl = 0
              if (!isNumber(user.warn)) user.warn = 0
              if (!isNumber(user.warnlink)) user.warnlink = 0
              if (!isNumber(user.joincount)) user.joincount = 2       
                if (!isNumber(user.bank)) user.bank = 0
                if (!isNumber(user.lvl)) user.lvl = 0                              
                if (!isNumber(user.premdays)) user.premdays = 0
                if (!isNumber(user.ultimoprelievo)) user.ultimoprelievo = 0
                if (!isNumber(user.ultimodeposito)) user.ultimodeposito = 0
                if (!('sposato' in user)) user.sposato = false
                if (!('richiestally' in user)) user.richiestally = ['',1]
                if (!('divoziato' in user)) user.divorziato = false
                if (!('coniuge' in user)) user.coniuge = ""
                if (!('ex' in user)) user.ex = ""
              if (!('proposals' in user)) user.proposals = {}
                if (!('pendmarry' in user)) user.pendmarry = []
                if (!('pending' in user)) user.pending = []
                if (!('amici' in user)) user.amici = []
                if (!('ultimoreclamo' in user)) user.ultimoreclamo = ['10:10 - 20/20/2020',0]
                if (!('comandi' in user)) user.comandi=[0,0,0]
                if (!isNumber(user.maxblasph)) user.maxblasph = 2050
              if (!('instagram' in user)) user.instagram = m.instagram
              if (!('muto' in user)) user.muto = false
          } else global.db.data.users[m.sender] = {
                  messaggi: 0,
                  command: 0,
                  blasphemy: 0,
                  money: 0,
                  bank: 0,
                  lvl: 0,
                  warn: 0,
                  warnlink: 0,
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
              if (!('benvenuto' in chat)) chat.benvenuto = true
              if (!('detect' in chat)) chat.detect = true
              if (!('sWelcome' in chat)) chat.sWelcome = ''
              if (!('sBye' in chat)) chat.sBye = ''
              if (!('sRemoveCustom' in chat)) chat.sRemoveCustom = ''
              if (!('sPromote' in chat)) chat.sPromote = ''
              if (!('sDemote' in chat)) chat.sDemote = ''
              if (!('bestemmiometro' in chat)) chat.bestemmiometro = false
              if (!('antilink' in chat)) chat.antilink = true
              if (!('antiinsta' in chat)) chat.antiinsta = false
              if (!('antitelegram' in chat)) chat.antitelegram = false
              if (!('antitiktok' in chat)) chat.antitiktok = false
              if (!('antispam' in chat)) chat.antispam = true
              if (!('antispamcomandi' in chat)) chat.antispamcomandi = true
              if (!('soloviewonce' in chat)) chat.soloviewonce = false
              if (!('antitrava' in chat)) chat.antitrava = true
              if (!('antilinktotale' in chat)) chat.antilinktotale = false
              if (!('antinuke' in chat)) chat.antinuke = false
              if (!('level' in chat)) chat.level = true
              if (!('soloadmin' in chat)) chat.soloadmin = true
              if (!isNumber(chat.expired)) chat.expired = 0
              if (!isNumber(chat.messaggi)) chat.messaggi = 0
              if (!isNumber(chat.blasphemy)) chat.blashpemy = 0
              if (!('name' in chat)) chat.name = m.name
              if (!('name' in chat)) chat.name = this.getName(m.chat)
              if (!('rules' in chat))
chat.rules = ''
          } else
              global.db.data.chats[m.chat] = {
                  name: this.getName(m.chat),
                  isBanned: false,
                  benvenuto: true,
                  detect: true,
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
                  soloadmin: true,
                  name: m.name,
                  rules: '',
              }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('restrict' in settings)) settings.restrict = true
                if (!('anticall' in settings)) settings.anticall = true
                if (!('antiprivato' in settings)) settings.antiprivato = true
          if (!('jadibot' in settings)) settings.jadibot = true   
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                restrict: true,
                anticall: true,
                antiprivato: true,
                jadibot: true,
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''


        const safeSender = this.decodeJid(m.sender);
        const safeBot = this.decodeJid(this.user.jid);
        
        let groupMetadata = {};
        let participants = [];
        let adminSet = new Set();
        
        if (m.isGroup) {
            groupMetadata = global.groupCache.get(m.chat) || await fetchGroupMetadataWithRetry(this, m.chat);
            if (groupMetadata) {
                global.groupCache.set(m.chat, groupMetadata);
                participants = groupMetadata.participants || [];
                
                if (!global.adminCache.has(m.chat)) {
                    global.adminCache.set(m.chat, new Set());
                }
                adminSet = global.adminCache.get(m.chat);
                

                participants.forEach(u => {
                    const normId = this.decodeJid(u.id);
                    const jid = u.jid || normId;
                    if (u.admin === 'admin' || u.admin === 'superadmin') {
                        adminSet.add(jid);
                        if (jid !== normId) adminSet.add(normId);
                    }
                });
            }
        }
        
        const normalizedParticipants = participants.map(u => {
            const normalizedId = this.decodeJid(u.id);
            return { ...u, id: normalizedId, jid: u.jid || normalizedId };
        });
        
        let canonicalSender = safeSender;
        if (m.isGroup && participants.length > 0) {
            const p = participants.find(u => this.decodeJid(u.id) === safeSender);
            if (p && p.jid) {
                canonicalSender = this.decodeJid(p.jid);
            }
        }
        
        const ownerJids = [safeBot, ...global.owner.map(([number]) => 
            this.decodeJid(number.replace(/[^0-9]/g, '') + '@s.whatsapp.net'))];
        
        const modJids = global.mods.map(v => 
            this.decodeJid(v.replace(/[^0-9]/g, '') + '@s.whatsapp.net'));
        
        const premJids = global.prems.map(v => 
            this.decodeJid(v.replace(/[^0-9]/g, '') + '@s.whatsapp.net'));
        
        const isROwner = ownerJids.includes(canonicalSender);
        const isOwner = isROwner || m.fromMe;
        const isMods = isOwner || modJids.includes(canonicalSender);
        const user = global.db.data.users[safeSender] || {};
        const isPrems = isROwner || premJids.includes(canonicalSender) || user.premium;

        const isAdmin = adminSet.has(safeSender) || (m.isGroup && participants.length > 0 ?
            participants.some(u => 
                (this.decodeJid(u.id) === safeSender || u.jid === safeSender) && 
                (u.admin === 'admin' || u.admin === 'superadmin')
            ) : false);

        let isBotAdmin = adminSet.has(safeBot) || (m.isGroup && participants.length > 0 ?
            participants.some(u => {
                const normId = this.decodeJid(u.id);
                return (normId === safeBot || u.jid === safeBot) && 
                       (u.admin === 'admin' || u.admin === 'superadmin');
            }) : false) || 
            (m.isGroup && (groupMetadata?.owner === safeBot || groupMetadata?.ownerLid === safeBot));

        const isRAdmin = adminSet.has(safeSender) && 
            (groupMetadata?.owner === safeSender || groupMetadata?.ownerLid === safeSender);


        if (m.isGroup && !isBotAdmin && participants.length > 0) {
            const freshMetadata = await fetchGroupMetadataWithRetry(this, m.chat);
            if (freshMetadata?.participants) {
                const botInMetadata = freshMetadata.participants.find(u => {
                    const normId = this.decodeJid(u.id);
                    return normId === safeBot || u.jid === safeBot;
                });
                isBotAdmin = botInMetadata && (botInMetadata.admin === 'admin' || botInMetadata.admin === 'superadmin') || 
                             freshMetadata.owner === safeBot || freshMetadata.ownerLid === safeBot;
                if (isBotAdmin) {
                    adminSet.add(safeBot);
                    global.adminCache.set(m.chat, adminSet);
                }
            }
        }

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                   
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}

                    }
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {

                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? 
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? 
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? 
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants: normalizedParticipants,
                    groupMetadata,
                    user: { admin: isAdmin ? 'admin' : null },
                    bot: { admin: isBotAdmin ? 'admin' : null },
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
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
                    if (name != 'OWNER_unbanuser.js' && user?.banned)
                        return
                }
          let hl = _prefix 
                let adminMode = global.db.data.chats[m.chat].soloadmin
                let mystica = `${plugin.botAdmin || plugin.admin || plugin.group || plugin || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugin.command}`
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && !isPrems && mystica) return   

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
                if (plugin.private && m.isGroup) { 
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) {
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
      // Sistema anti-spam comandi avanzato 
if (m.isGroup && !isOwner && typeof m.text === 'string' && (m.isCommand || hasValidPrefix(m.text, conn.prefix || global.prefix))) {
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

    if (now - groupData.firstCommandTimestamp > 60000) {
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
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
                if (xp > 2000) 
                     m.reply('Exp limit')
                 else                
                 if (plugin.money && global.db.data.users[m.sender].money < plugin.money * 1) { 
                     fail('senzasoldi', m, this)
                    continue   
                 } 
                    m.exp += xp

                if (plugin.level > _user.level) {
                    this.reply(m.chat, `livello troppo basso`, m)
                    continue 
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
                    participants: normalizedParticipants,
                    groupMetadata,
                    user: { admin: isAdmin ? 'admin' : null },
                    bot: { admin: isBotAdmin ? 'admin' : null },
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
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                        m.money = m.money || plugin.money || false 
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
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }

        let chat, user, stats = global.db.data.stats
        if (m) { let utente = global.db.data.users[m.sender]
if (m.isCommand) {
utente.command += 1
}
if (utente.muto == true) {
let bang = m.key.id
let cancellazzione = m.key.participant
await conn.sendMessage(m.chat, {
delete: {
remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione
}})
}
            if (m.sender && (user = global.db.data.users[m.sender]) && (chat = global.db.data.chats[m.chat])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
                user.money -= m.money * 1 
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
        if (opts['autoread'])
            await this.readMessages([m.key])

    }
}

export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    if (this.isInit)
        return
    if (global.db.data == null)
        await loadDatabase()

    if (action === 'add' || action === 'remove' || action === 'promote' || action === 'demote') {
        try {
            let metadata = global.groupCache.get(id);
            if (!metadata) {
                metadata = await fetchGroupMetadataWithRetry(this, id);
                if (metadata) global.groupCache.set(id, metadata);
            }

            if (!global.adminCache.has(id)) {
                global.adminCache.set(id, new Set());
            }
            const adminSet = global.adminCache.get(id);

            for (const user of participants) {
                const normalizedUser = this.decodeJid(user);
                switch (action) {
                    case 'remove':
                        adminSet.delete(normalizedUser);
                        break;
                    case 'promote':
                        adminSet.add(normalizedUser);
                        break;
                    case 'demote':
                        adminSet.delete(normalizedUser);
                        break;
                }
            }

            if (metadata) {
                metadata.admins = Array.from(adminSet);
                global.groupCache.set(id, metadata);
            }
        } catch (e) {
            console.error(`[ERRORE] Errore in participantsUpdate per ${id}:`, e);
        }
    }

    let chat = global.db.data.chats[id] || {}
    let text = ''
    const nomeDelBot = global.botName || this.user?.name || '𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕'

    switch (action) {
        case 'add':
        case 'remove':
        case 'leave':
            if (chat.benvenuto) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                for (let user of participants) {
                    let pp = './icone/benvenuto.png'
                    try {
                        pp = await this.profilePictureUrl(user, 'image')
                    } catch (e) {

                    } finally {
                        let apii = await this.getFile(pp)

                        let actualAction = action
                        if (action === 'remove') {
                            const removalKey = `${id}_${user}`
                            if (global.lastRemovals[removalKey] && Date.now() - global.lastRemovals[removalKey].timestamp < 5000) {
                                actualAction = 'remove'
                                delete global.lastRemovals[removalKey]
                            } else {
                                actualAction = 'leave'
                            }
                        }

                        if (action === 'add' || actualAction === 'add') {
                            text = (chat.sWelcome || this.benvenuto || conn.benvenuto || 'benvenuto, @user!')
                                .replace('@subject', await this.getName(id))
                                .replace('@desc', groupMetadata.desc?.toString() || 'bot')
                                .replace('@user', '@' + user.split('@')[0])
                        } else if (action === 'leave' || actualAction === 'leave') {
                            text = (chat.sBye || this.bye || conn.bye || 'bye bye, @user!')
                                .replace('@user', '@' + user.split('@')[0])
                        } else if (actualAction === 'remove') {
                            text = (chat.sRemoveCustom || this.remove || conn.remove || '@user è stato rimosso!')
                                .replace('@user', '@' + user.split('@')[0])
                        }

                        await this.sendMessage(id, {
                            text: text,
                            contextInfo: {
                                mentionedJid: [user],
                                forwardingScore: 99,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363259442839354@newsletter',
                                    serverMessageId: '',
                                    newsletterName: `${nomeDelBot}`
                                },
                                externalAdReply: {
                                    title:
                                        (action === 'add' || actualAction === 'add')
                                            ? '𝐁𝐄𝐍𝐕𝐄𝐍𝐔𝐓𝐎/𝐀 👋🏻'
                                            : (action === 'leave' || actualAction === 'leave')
                                                ? '𝐀𝐃𝐃𝐈𝐎 👋🏻'
                                                : '𝐑𝐈𝐌𝐎𝐙𝐈𝐎𝐍𝐄 ❌',
                                    body: '',
                                    previewType: 'PHOTO',
                                    thumbnailUrl: '',
                                    thumbnail: apii.data,
                                    mediaType: 1,
                                    renderLargerThumbnail: false
                                }
                            }
                        })
                    }
                }
            }
            break
    }
}


export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```immagine modificata```').replace('@icon', groupUpdate.icon)
     //   if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```link reimpostato```\n@revoke').replace('@revoke', groupUpdate.revoke)
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
        rowner: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐨𝐰𝐧𝐞𝐫 🔱',
        owner: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐬𝐨𝐥𝐨 𝐩𝐞𝐫 𝐨𝐰𝐧𝐞𝐫 🔱',
        mods: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐥𝐨 𝐩𝐨𝐬𝐬𝐨𝐧𝐨 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐞 𝐬𝐨𝐥𝐨 𝐚𝐝𝐦𝐢𝐧 𝐞 𝐨𝐰𝐧𝐞𝐫 ⚙️',
        premium: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐩𝐞𝐫 𝐬𝐨𝐥𝐢 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐢 👮🏻‍♂️',
        group: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮𝐨𝐢 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐥𝐨 𝐢𝐧 𝐮𝐧 𝐠𝐫𝐮𝐩𝐩𝐨 👥',
        private: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐩𝐮𝐨𝐢 𝐮𝐭𝐢𝐥𝐢𝐳𝐳𝐚𝐫𝐥𝐨 𝐢𝐧 𝐜𝐡𝐚𝐭 𝐩𝐫𝐢𝐯𝐚𝐭𝐚 👤',
        admin: '𝐐𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞̀ 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞 𝐩𝐞𝐫 𝐬𝐨𝐥𝐢 𝐚𝐝𝐦𝐢𝐧 🛡️',
        botAdmin: '𝐃𝐞𝐯𝐢 𝐝𝐚𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐚𝐥 𝐛𝐨𝐭 👑',
        restrict: '🔐 𝐑𝐞𝐬𝐭𝐫𝐢𝐜𝐭 𝐞 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨 🔐'}[type]
    if (msg) return conn.sendMessage(m.chat, { text: ' ', contextInfo:{
  "externalAdReply": {"title": `${msg}`, 
 "body": ``, 
  "previewType": "PHOTO",
  "thumbnail": fs.readFileSync('./icone/accessdenied.png'),
  "mediaType": 1,
  "renderLargerThumbnail": true}}}, {quoted: m})
}
let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
