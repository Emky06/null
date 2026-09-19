//Plugin fatto da Axtral_WiZaRd
import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
    await m.react('🕓')
    
    const sender = m.sender  
    
    const buildMsg = (icon, status) => `
╭━━━〔 ⚙️ 𝐁𝐎𝐓 𝐔𝐏𝐃𝐀𝐓𝐄 〕━━━⬣
┃
┃ 👤 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐨 𝐝𝐚: @${sender.split('@')[0]}
┃ 📦 𝐀𝐳𝐢𝐨𝐧𝐞: 𝐀𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐦𝐞𝐧𝐭𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...
┃ ${icon} 𝐒𝐭𝐚𝐭𝐨: \`${status}\`
┃
╰━━━━━━━━━━━━━━━━━━⬣`.trim()
    
    const sent = await conn.reply(m.chat, buildMsg('⏳', '𝐀𝐯𝐯𝐢𝐨 𝐩𝐫𝐨𝐜𝐞𝐝𝐮𝐫𝐚...'), m, { mentions: [sender] })
    
    const editMsg = async (newText) => {
        try {
            await conn.sendMessage(m.chat, { 
                text: newText, 
                edit: sent.key,
                mentions: [sender]
            }, { quoted: m })
        } catch (e) {
            console.error('Edit fallito:', e)
        }
    }
    
    const steps = [
        { icon: '🔌', text: '𝐂𝐨𝐧𝐧𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐚𝐥 𝐫𝐞𝐩𝐨𝐬𝐢𝐭𝐨𝐫𝐲 𝐆𝐢𝐭...' },
        { icon: '📥', text: '𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐝𝐞𝐢 𝐧𝐮𝐨𝐯𝐢 𝐟𝐢𝐥𝐞...' },
        { icon: '🔧', text: '𝐀𝐩𝐩𝐥𝐢𝐜𝐚𝐳𝐢𝐨𝐧𝐞 𝐝𝐞𝐥𝐥𝐞 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐡𝐞...' },
    ]
    
    for (const step of steps) {
        await new Promise(r => setTimeout(r, 800))
        await editMsg(buildMsg(step.icon, step.text))
    }
    
    try {
        const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : '')).toString()
        const output = stdout.trim() || '𝐍𝐞𝐬𝐬𝐮𝐧𝐚 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚 𝐫𝐢𝐥𝐞𝐯𝐚𝐭𝐚.'
        const isUpToDate = /Already up[- ]to[- ]date/i.test(output)
        
        const header = isUpToDate
            ? `✅ 𝐆𝐈𝐀̀ 𝐀𝐆𝐆𝐈𝐎𝐑𝐍𝐀𝐓𝐎`
            : `🎉 𝐀𝐆𝐆𝐈𝐎𝐑𝐍𝐀𝐓𝐎`
        
        const footer = isUpToDate
            ? `> ℹ️ 𝐈𝐥 𝐛𝐨𝐭 𝐞̀ 𝐠𝐢𝐚̀ 𝐚𝐥𝐥'𝐮𝐥𝐭𝐢𝐦𝐚 𝐯𝐞𝐫𝐬𝐢𝐨𝐧𝐞 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐞.`
            : `> ✅ 𝐎𝐩𝐞𝐫𝐚𝐳𝐢𝐨𝐧𝐞 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐚 𝐬𝐞𝐧𝐳𝐚 𝐞𝐫𝐫𝐨𝐫𝐢.`
        
        await editMsg(`
╭━━━〔 ${header} 〕━━━⬣
┃
┃ 👤 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐨 𝐝𝐚: @${sender.split('@')[0]}
┃ 📅 𝐃𝐚𝐭𝐚: ${new Date().toLocaleString('it-IT')}
┃ 📊 𝐒𝐭𝐚𝐭𝐨: \`𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐚𝐭𝐨\`
┃
┃ 📝 𝐋𝐨𝐠 𝐆𝐢𝐭:
┃ \`\`\`
┃ ${output.split('\n').join('\n┃ ')}
┃ \`\`\`
┃
╰━━━━━━━━━━━━━━━━━━⬣

${footer}`.trim())
        
        await m.react('✅')
        
    } catch (e) {
        await editMsg(`
╭━━━〔 ❌ 𝐁𝐎𝐓 𝐔𝐏𝐃𝐀𝐓𝐄 〕━━━⬣
┃
┃ 👤 𝐑𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐨 𝐝𝐚: @${sender.split('@')[0]}
┃ 📅 𝐃𝐚𝐭𝐚: ${new Date().toLocaleString('it-IT')}
┃ ⚠️ 𝐒𝐭𝐚𝐭𝐨: \`𝐄𝐑𝐑𝐎𝐑𝐄\`
┃
┃ 🐛 𝐃𝐞𝐭𝐭𝐚𝐠𝐥𝐢 𝐞𝐫𝐫𝐨𝐫𝐞:
┃ \`\`\`
┃ ${String(e.message || e).split('\n').join('\n┃ ')}
┃ \`\`\`
┃
╰━━━━━━━━━━━━━━━━━━⬣

> ❌ 𝐀𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐦𝐞𝐧𝐭𝐨 𝐟𝐚𝐥𝐥𝐢𝐭𝐨. 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐚 𝐢 𝐥𝐨𝐠 𝐦𝐚𝐧𝐮𝐚𝐥𝐦𝐞𝐧𝐭𝐞.`.trim())
        
        await m.react('❌')
    }
}

handler.help = ['aggiornabot']
handler.tags = ['owner']
handler.command = ['aggiorna', 'update', 'aggiornabot']
handler.rowner = true

export default handler