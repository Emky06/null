import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {

    /* ---------------------------------------------------
     * 🔧 DECODE JID (necessario per Baileys moderno)
     * --------------------------------------------------- */
    conn.decodeJid = (jid = '') => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            return jid.split(':')[0] + '@s.whatsapp.net';
        } else {
            return jid;
        }
    };

    /* ---------------------------------------------------
     * 🔧 FORMAT PHONE NUMBER (unificato con file 2)
     * --------------------------------------------------- */
    function formatPhoneNumber(jid, name) {
        if (!jid) return 'Sconosciuto';
        let clean = jid.split('@')[0].split(':')[0];
        try {
            const numberObj = PhoneNumber('+' + clean);
            const number = numberObj.getNumber('international') || ('+' + clean);
            return number + (name ? ` ~${name}` : '');
        } catch {
            return clean + (name ? ` ~${name}` : '');
        }
    }

    /* --------------------------------------------------- */

    let _name = await conn.getName(m.sender);
    let sender = formatPhoneNumber(conn.decodeJid(m.sender), _name);

    let chat = await conn.getName(m.chat);
    let img;

    try {
        if (global.opts['img']) {
            img = /sticker|image/gi.test(m.mtype)
                ? await terminalImage.buffer(await m.download())
                : false;
        }
    } catch (e) {
        console.error(e);
    }

    let filesize =
        (m.msg
            ? m.msg.vcard
                ? m.msg.vcard.length
                : m.msg.fileLength
                ? m.msg.fileLength.low || m.msg.fileLength
                : m.msg.axolotlSenderKeyDistributionMessage
                ? m.msg.axolotlSenderKeyDistributionMessage.length
                : m.text
                ? m.text.length
                : 0
            : m.text
            ? m.text.length
            : 0) || 0;

    let user = global.db.data.users[m.sender];

    let me = formatPhoneNumber(
        conn.decodeJid(conn.user?.jid) || '',
        conn.user?.name || ''
    );

    let oraAttuale = new Date();
    let oraItaliana = oraAttuale.toLocaleString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    let chatName = chat
        ? m.isGroup
            ? 'Gruppo: ' + chat
            : 'Chat privata: ' + chat
        : '';

    /* ---------------------------------------------------
     * 📦 STAMPA BLOCCO PRINCIPALE
     * --------------------------------------------------- */
    console.log(
        `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃🟢  ${chalk.black(chalk.bgBlueBright('%s'))}
┃⏰ㅤ${chalk.blueBright(oraItaliana)}
┃📑ㅤ${chalk.blueBright('%s')}
┃📊ㅤ${chalk.blueBright('%s [%s %sB]')}
┃🗣ㅤ${chalk.white('%s')}
┃📃ㅤ${chalk.blueBright('%s%s')}
┃🌐ㅤ${chalk.blueBright(chatName)}
┃📝ㅤ${chalk.blueBright('%s')}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim(),
        me + '',
        m.messageStubType ? m.messageStubType : 'WAMessageStubType',
        filesize,
        filesize === 0
            ? 0
            : (
                  filesize /
                  1009 ** Math.floor(Math.log(filesize) / Math.log(1000))
              ).toFixed(1),
        ['', ...'KMGTP'][
            Math.floor(Math.log(filesize) / Math.log(1000))
        ] || '',
        sender,
        m ? m.exp : '?',
        user ? '|' + user.exp + '|' + user.limit : '' + ('|' + user.level),
        m.mtype
            ? m.mtype
                  .replace(/message$/i, '')
                  .replace('audio', m.msg.ptt ? 'PTT' : 'audio')
                  .replace(/^./, (v) => v.toUpperCase())
            : ''
    );

    if (img) console.log(img.trimEnd());

    /* ---------------------------------------------------
     * 📝 TESTO DEL MESSAGGIO FORMATTATO
     * --------------------------------------------------- */
    if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '');

        let mdRegex =
            /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;

        let mdFormat =
            (depth = 4) =>
            (_, type, text, monospace) => {
                let types = {
                    _: 'italic',
                    '*': 'bold',
                    '~': 'strikethrough',
                };
                text = text || monospace;
                let formatted =
                    !types[type] || depth < 1
                        ? text
                        : chalk[types[type]](
                              text.replace(mdRegex, mdFormat(depth - 1))
                          );
                return formatted;
            };

        if (log.length < 4096) {
            log = log.replace(urlRegex, (url, i, text) => {
                let end = url.length + i;
                return i === 0 ||
                    end === text.length ||
                    (/^\s$/.test(text[end]) &&
                        /^\s$/.test(text[i - 1]))
                    ? chalk.blueBright(url)
                    : url;
            });
        }

        log = log.replace(mdRegex, mdFormat(4));

        if (m.mentionedJid)
            for (let user of m.mentionedJid) {
                let jid = conn.decodeJid(user);
                let name = await conn.getName(jid);
                let num = jid.split('@')[0];

                log = log.replace(
                    '@' + num,
                    chalk.blueBright(
                        '@' +
                            num +
                            (name ? ' ~' + name : '')
                    )
                );
            }

        console.log(
            m.error != null
                ? chalk.red(log)
                : m.isCommand
                ? chalk.yellow(log)
                : log
        );
    }

    /* ---------------------------------------------------
     * 👥 PARAMETRI STUB (es. aggiunte/rimozioni)
     * --------------------------------------------------- */
    if (m.messageStubParameters) {
        console.log(
            m.messageStubParameters
                .map((jid) => {
                    jid = conn.decodeJid(jid);
                    let name = conn.getName(jid);
                    const phoneNumber = PhoneNumber(
                        '+' + jid.replace('@s.whatsapp.net', '')
                    ).getNumber('international');
                    return name
                        ? chalk.gray(`${phoneNumber} (${name})`)
                        : '';
                })
                .filter(Boolean)
                .join(', ')
        );
    }

    /* ---------------------------------------------------
     * 🔎 TIPO DI MESSAGGIO (documento, audio, ecc.)
     * --------------------------------------------------- */

    if (/document/i.test(m.mtype))
        console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`);
    else if (/ContactsArray/i.test(m.mtype))
        console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`);
    else if (/contact/i.test(m.mtype))
        console.log(`👨 ${m.msg.displayName || ''}`);
    else if (/audio/i.test(m.mtype)) {
        const duration = m.msg.seconds;
        console.log(
            `${m.msg.ptt ? '🎤ㅤ(PTT ' : '🎵ㅤ('}AUDIO) ${Math.floor(
                duration / 60
            )
                .toString()
                .padStart(2, 0)}:${(duration % 60)
                .toString()
                .padStart(2, 0)}`
        );
    }

    console.log();
}

/* ---------------------------------------------------
 * 📌 WATCHFILE
 * --------------------------------------------------- */

let file = global.__filename(import.meta.url);
watchFile(file, () => {
    console.log(chalk.redBright("Update 'lib/print.js'"));
});
