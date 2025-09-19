import fs from 'fs'

let handler = message => message;

handler.all = async function(message) {
    let userData = global.db.data.users[message.sender];
    
    if (!message.isGroup) return null;
    
    let chatData = global.db.data.chats[message.chat];
    
    if (chatData.bestemmiometro && /(?:porco dio|porcodio|dio microonde|madonna zoccola|dio cagnaccio|dio tostapane|dio puttana|porco di dio|dio beduino|dio armadillo|porco il tuo dio|porco il vostro dio|dio bastardo|diocan|dio merda|diomerda|dio can|dio cane|porcamadonna|puttana la madonna|madonnaporca|porca madonna|madonna porca|dio inutile|dio cinghiale|mannaggia alla madonna|mannaggia a dio|madonna troia|mannggia a gesù|mannaggia a cristo|dio maiale|diomaiale|porco gesù|porcogesù|gesù cane|cristo madonna|madonna impanata|mannaggia cristo|porcaccio il dio|porcaccio dio|porcaccioddio|orcodio|orco dio|rcodio|rco dio|porcaccio gesù|porcaccio ddio|fucking god|fuckinggod|fuckingod|mannaggia a cristo|dio ciolla|dio cipolla|mannaggia a dio|porco de dio|mannaggia dio|cristo tostapane|porco cristo|dio pera|puttanaccia la madonna|porca la madonna|dioporco|dio frocio|dio ricchione|dio poveretto|dio povero|p.o.r.c.o.d.i.o|d.i.o.p.o.r.c.o|d.i.o.c.a.n.e|porco allah|allah cane|diobestia|dio bestia|porca madonnina|madonnina porca|madonnina puttana|puttana madonnina|madonninaputtana|madonninaporca|puttanamadonnina|porcamadonnina|poccoddio|poccodio|pocco dio|pocco ddio|dio pollo|dio cotoletta|gesù cotoletta|cristo porchetta|gesù pollo|dio disabile|dio gay|dio inculato|dio infuocato|dio nutella|dio bastoncino|gesù bastoncino|gesù nutella|dio down|dio handicappato|dio handicap|dio andicappato|dio crocifissato|dio negro|madonna negra|gesù negro|dio pisello|dio marocchino|dio africano|dio pulla|madonna pulla|dio lattuga|gesù pisello|madonna puttana|madonna vacca|madonna inculata|porcoddio|porcaccia la madonna|dio porchetta|dio porchetto|cristo bastardo|dio lesbico|dio lesbica|dio porco|gesù impanato|gesù porco|porca madonna|diocane|madonna porca|dio capra|capra dio|dio impanato)/i.test(message.text)) {
        
        const userBlasfemyData = global.db.data.users[message.sender];
        userBlasfemyData.blasphemy = (userBlasfemyData.blasphemy || 0) + 1;
        
        const thumb = fs.readFileSync('./icone/bestemmiometro.jpg');

        let fakeMessage = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'Halo'
            },
            message: {
                locationMessage: {
                    name: '𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐨𝐦𝐞𝐭𝐫𝐨',
                    jpegThumbnail: thumb,
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        };

        if (userBlasfemyData.blasphemy === 1) {
            const firstBlasphemyMessage = '@' + message.sender.split('@')[0] + ' 𝐡𝐚 𝐭𝐢𝐫𝐚𝐭𝐨 𝐥𝐚 𝐬𝐮𝐚 𝐩𝐫𝐢𝐦𝐚 𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐚';
            
            conn.sendMessage(message.chat, {
                text: firstBlasphemyMessage,
                mentions: [...firstBlasphemyMessage.matchAll(/@([0-9]{5,16}|0)/g)].map(m => m[1] + '@s.whatsapp.net')
            }, { quoted: fakeMessage });

        } else {
            const multipleBlasphemyMessage = '@' + message.sender.split('@')[0] + ' 𝐡𝐚 𝐭𝐢𝐫𝐚𝐭𝐨 ' + (userBlasfemyData.blasphemy - 1) + ' 𝐛𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞';

            conn.sendMessage(message.chat, {
                text: multipleBlasphemyMessage,
                mentions: [...multipleBlasphemyMessage.matchAll(/@([0-9]{5,16}|0)/g)].map(m => m[1] + '@s.whatsapp.net')
            }, { quoted: fakeMessage });
        }
    }
};

export default handler;

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}