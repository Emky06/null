import { unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

let handler = async (message, { conn, args, __dirname, usedPrefix, command }) => {
    try {
        let quotedMessage = message.quoted ? message.quoted : message;
        let mimeType = (message.quoted ? message.quoted : message).mimetype || '';
        let filterOption;

        if (/bass/.test(command)) {
            filterOption = '-af equalizer=f=94:width_type=o:width=2:g=30';
        }
        if (/blown/.test(command)) {
            filterOption = '-af acrusher=.1:1:64:0:log';
        }
        if (/deep/.test(command)) {
            filterOption = '-af atempo=4/4,asetrate=44500*2/3';
        }
        if (/earrape/.test(command)) {
            filterOption = '-filter:a "atempo=1.63,asetrate=44100"';
        }
        if (/fast/.test(command)) {
            filterOption = '-filter:a "atempo=1.6,asetrate=22100"';
        }
        if (/fat/.test(command)) {
            filterOption = '-af volume=12';
        }
        if (/nightcore/.test(command)) {
            filterOption = '-filter:a atempo=1.06,asetrate=44100*1.25';
        }
        if (/reverse/.test(command)) {
            filterOption = '-filter_complex "areverse"';
        }
        if (/robot/.test(command)) {
            filterOption = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
        }
        if (/slow/.test(command)) {
            filterOption = '-filter:a "atempo=0.7,asetrate=44100"';
        }
        if (/smooth/.test(command)) {
            filterOption = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
        }
        if (/tupai|squirrel|chipmunk/.test(command)) {
            filterOption = '-filter:a "atempo=0.5,asetrate=65100"';
        }

        if (/audio/.test(mimeType)) {
            let fileName = getRandom('.mp3');
            let outputPath = join(__dirname, '../tmp/' + fileName);
            let inputPath = await quotedMessage.download(true);
            
            exec('ffmpeg -i ' + inputPath + ' ' + filterOption + ' ' + outputPath, async (error, stdout, stderr) => {
                await unlinkSync(inputPath);
                
                if (error) throw '_*Error!*_';
                
                await conn.sendMessage(message.chat, { 
                    audio: { url: outputPath }, 
                    mimetype: 'audio/mpeg',
                    ptt: false
                });
                
                setTimeout(() => {
                    try {
                        unlinkSync(outputPath);
                    } catch (e) {
                        console.log('Errore nella cancellazione del file:', e);
                    }
                }, 5000);
            });
        } else {
            throw '*[INFO] rispondi a un audio o nota vocale che verrà modificato, usa il comando ' + (usedPrefix + command) + '*';
        }
    } catch (error) {
        throw error;
    }
};

handler.help = [
    'bass-filter:a "atempo=1.63,asetrate=44100"',
    'blown-filter:a "atempo=1.6,asetrate=22100"',
    'deep',
    'earrape',
    'fast',
    'fat',
    'nightcore',
    'reverse',
    'robot',
    'slow',
    'smooth',
    'tupai'
].map(cmd => cmd + ' [vn]');

handler.tags = ['audio'];
handler.command = /^(bass|blown|deep|earrape|fas?t|nightcore|reverse|robot|slow|smooth|tupai|squirrel|chipmunk)$/i;
handler.limit = true;

export default handler;

const getRandom = (extension) => {
    return '' + Math.floor(Math.random() * 10000) + extension;
};