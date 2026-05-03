import axios from 'axios';

const BROWSERLESS_KEY = '2URLFvIaT2R9pY97626b5125ee35d7a9af4d8e0cd1261901d';

// Funzione per generare lo screenshot
async function retryScreenshot(html, width = 600, height = 450, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, {
                html, 
                options: { type: 'jpeg', quality: 90 }, 
                viewport: { width, height }
            }, { responseType: 'arraybuffer', timeout: 15000 });
            return Buffer.from(response.data);
        } catch (e) {
            if (e.response?.status !== 429) throw e;
            await new Promise(res => setTimeout(res, 2000 * (i + 1)));
        }
    }
    throw new Error('Screenshot failed');
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Controlla se l'utente ha fornito il nome della città
    if (!args[0]) {
        return m.reply(`⚠️ *Inserisci il nome di una città o di un paese.*\\nEsempio: *${usedPrefix}${command} Roma*`);
    }

    const city = args.join(' '); // Permette nomi di città con spazi (es. New York)
    await conn.sendPresenceUpdate('composing', m.chat);

    try {
        // Effettua la richiesta all'API (aggiunto lang=it per le descrizioni in italiano)
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=it&appid=060a6bcfa19809c2cd4d97a212b19273`
        );

        const data = response.data;
        const {
            name: cityName,
            sys: { country },
            weather,
            main: { temp, temp_min, temp_max, humidity },
            wind: { speed: windSpeed }
        } = data;

        const weatherDesc = weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
        const icon = weather[0].icon; // Codice icona per l'immagine

        // Colore di sfondo dinamico basato sulla temperatura
        let bgGradient = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'; // Freddo (Default)
        if (temp > 15 && temp <= 25) bgGradient = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'; // Mite
        if (temp > 25) bgGradient = 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'; // Caldo

        // HTML della Card Meteo (Glassmorphism design)
        const html = `
        <html><head><style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body { margin: 0; font-family: 'Inter', sans-serif; background: ${bgGradient}; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
            .card { background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(20px); border-radius: 30px; padding: 40px; width: 480px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .location { font-size: 32px; font-weight: 800; display: flex; align-items: center; gap: 12px; }
            .location span { font-size: 18px; background: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 8px; font-weight: 600;}
            .main-weather { display: flex; align-items: center; justify-content: space-between; margin: 15px 0; }
            .temp { font-size: 85px; font-weight: 800; line-height: 1; letter-spacing: -3px; }
            .icon img { width: 140px; height: 140px; filter: drop-shadow(0 0 15px rgba(255,255,255,0.4)); }
            .desc { font-size: 24px; font-weight: 600; margin-bottom: 35px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 20px; }
            .details { display: flex; justify-content: space-between; }
            .detail-box { text-align: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 15px; flex: 1; margin: 0 5px; }
            .detail-val { font-size: 20px; font-weight: 800; }
            .detail-label { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
        </style></head><body>
            <div class="card">
                <div class="header">
                    <div class="location">📍 ${cityName} <span>${country}</span></div>
                </div>
                <div class="main-weather">
                    <div class="temp">${Math.round(temp)}°</div>
                    <div class="icon"><img src="https://openweathermap.org/img/wn/${icon}@4x.png"></div>
                </div>
                <div class="desc">${weatherDesc}</div>
                <div class="details">
                    <div class="detail-box">
                        <div class="detail-val">${Math.round(temp_min)}° / ${Math.round(temp_max)}°</div>
                        <div class="detail-label">Min/Max</div>
                    </div>
                    <div class="detail-box">
                        <div class="detail-val">${humidity}%</div>
                        <div class="detail-label">Umidità 💦</div>
                    </div>
                    <div class="detail-box">
                        <div class="detail-val">${windSpeed}</div>
                        <div class="detail-label">km/h 🌬️</div>
                    </div>
                </div>
            </div>
        </body></html>`;

        // Generazione dell'immagine
        const buffer = await retryScreenshot(html, 600, 450);

        // Didascalia semplice sotto l'immagine
        const caption = `🌍 *Meteo di ${cityName} (${country})*\n🌡️ Temp: ${temp}°C\n📝 Condizioni: ${weatherDesc}`;

        await conn.sendMessage(m.chat, { image: buffer, caption: caption }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply('⚠️ *Errore: non è stato possibile trovare risultati per la città specificata. Assicurati che esista o riprova più tardi.*');
    } finally {
        await conn.sendPresenceUpdate('paused', m.chat);
    }
};

handler.command = ['meteo', 'clima'];
handler.help = ['meteo <città>'];
handler.tags = ['info'];

export default handler;