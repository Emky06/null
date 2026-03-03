// Import delle dipendenze necessarie
import { unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

// Handler principale per i comandi di modifica audio
let handler = async (message, { conn, args, __dirname, usedPrefix, command }) => {
    try {
        // Determina se il messaggio è quoted o diretto
        let quotedMessage = message.quoted ? message.quoted : message;
        let mimeType = (message.quoted ? message.quoted : message).mimetype || '';
        let filterOption;

        // Seleziona il filtro audio in base al comando
        if (/bass/.test(command)) {
            filterOption = '-af equalizer=f=94:width_type=o:width=2:g=30';  // Aumenta i bassi
        }
        if (/blown/.test(command)) {
            filterOption = '-af acrusher=.1:1:64:0:log';  // Effetto distorto/saturato
        }
        if (/deep/.test(command)) {
            filterOption = '-af atempo=4/4,asetrate=44500*2/3';  // Voce profonda
        }
        if (/earrape/.test(command)) {
            filterOption = '-filter:a "atempo=1.63,asetrate=44100"';  // Effetto distorto ad alto volume
        }
        if (/fast/.test(command)) {
            filterOption = '-filter:a "atempo=1.6,asetrate=22100"';  // Velocità aumentata
        }
        if (/fat/.test(command)) {
            filterOption = '-af volume=12';  // Aumenta il volume
        }
        if (/nightcore/.test(command)) {
            filterOption = '-filter:a atempo=1.06,asetrate=44100*1.25';  // Effetto nightcore (voce acuta e veloce)
        }
        if (/reverse/.test(command)) {
            filterOption = '-filter_complex "areverse"';  // Audio al contrario
        }
        if (/robot/.test(command)) {
            filterOption = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';  // Effetto robot
        }
        if (/slow/.test(command)) {
            filterOption = '-filter:a "atempo=0.7,asetrate=44100"';  // Velocità ridotta
        }
        if (/smooth/.test(command)) {
            filterOption = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';  // Effetto smooth (liscio)
        }
        if (/tupai|squirrel|chipmunk/.test(command)) {
            filterOption = '-filter:a "atempo=0.5,asetrate=65100"';  // Voce da scoiattolo (acuta)
        }

        // Verifica che sia un file audio
        if (/audio/.test(mimeType)) {
            // Genera un nome file casuale
            let fileName = getRandom('.mp3');
            let outputPath = join(__dirname, '../tmp/' + fileName);
            
            // Scarica il file audio
            let inputPath = await quotedMessage.download(true);
            
            // Esegue ffmpeg per applicare il filtro
            exec('ffmpeg -i ' + inputPath + ' ' + filterOption + ' ' + outputPath, async (error, stdout, stderr) => {
                // Pulisce il file temporaneo di input
                await unlinkSync(inputPath);
                
                if (error) throw '_*Error!*_';
                
                // Legge il file modificato e lo invia
                let modifiedAudio = await readFileSync(outputPath);
                conn.sendFile(
                    message.chat,
                    modifiedAudio,
                    fileName,
                    null,
                    message,
                    true,
                    { 
                        type: 'audioMessage',
                        ptt: true  // Invia come nota vocale
                    }
                );
            });
        } else {
            throw '*[INFO] rispondi a un audio o nota vocale che verrà modificato, usa il comando ' + (usedPrefix + command) + '*';
        }
    } catch (error) {
        throw error;
    }
};

// Configurazione del comando
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

// Esporta il modulo
export default handler;

// Indica che il comando può essere usato senza limitazioni
handler.limit = true;

// Funzione per generare nomi file casuali
const getRandom = (extension) => {
    return '' + Math.floor(Math.random() * 10000) + extension;
};