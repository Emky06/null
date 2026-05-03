import axios from 'axios';

const BROWSERLESS_KEY = '2URLFvIaT2R9pY97626b5125ee35d7a9af4d8e0cd1261901d';

// Funzione per generare lo screenshot
async function retryScreenshot(html, width = 900, height = 600, retries = 3) {
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
        return m.reply(`⚠️ *Inserisci il nome di una città o di un paese.*\\nEsempio: *${usedPrefix}${command} Roma it*`);
    }

    await conn.sendPresenceUpdate('composing', m.chat);

    // 1) Logica per riconoscere il prefisso IT, US, ecc. (es. "Roma it")
    let cityQuery = args.join(' ');
    let cityNameForImg = cityQuery; // Usato per cercare l'immagine di sfondo

    if (args.length > 1 && args[args.length - 1].length === 2) {
        const countryCode = args.pop(); // Estrae l'ultimo elemento se lungo 2 caratteri (es. 'it')
        const cityOnly = args.join(' '); // Il resto è la città (es. 'Roma')
        cityQuery = `${cityOnly},${countryCode}`;
        cityNameForImg = cityOnly;
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&units=metric&lang=it&appid=060a6bcfa19809c2cd4d97a212b19273`
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
        const icon = weather[0].icon; 
        const mainCondition = weather[0].main.toLowerCase(); // Serve per la logica degli effetti meteo
        
        // Generatore di Effetti CSS in base al meteo
        let effectOverlay = '';
        if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
            effectOverlay = `
                <div class="weather-effect rain-effect"></div>
                <style>
                    .rain-effect {
                        background: 
                            radial-gradient(circle at 10% 10%, rgba(255,255,255,0.4) 1px, transparent 1px),
                            radial-gradient(circle at 20% 40%, rgba(255,255,255,0.4) 2px, transparent 2px),
                            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.4) 1px, transparent 1px),
                            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.5) 2.5px, transparent 3px),
                            radial-gradient(circle at 30% 80%, rgba(255,255,255,0.4) 1px, transparent 1px),
                            radial-gradient(circle at 70% 90%, rgba(255,255,255,0.4) 2px, transparent 2px);
                        background-size: 120px 120px; 
                        opacity: 0.9;
                    }
                </style>`;
        } else if (mainCondition.includes('clear')) {
            effectOverlay = `
                <div class="weather-effect sun-effect"></div>
                <style>
                    .sun-effect {
                        background: radial-gradient(circle at 85% 15%, rgba(255, 240, 150, 0.6) 0%, rgba(255, 200, 50, 0.2) 30%, transparent 60%);
                        filter: blur(10px);
                        mix-blend-mode: overlay;
                    }
                </style>`;
        } else if (mainCondition.includes('thunderstorm')) {
            effectOverlay = `
                <div class="weather-effect thunder-effect"></div>
                <style>
                    .thunder-effect {
                        background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 0.9) 42%, transparent 47%);
                        box-shadow: inset 0 0 120px rgba(0,0,0,0.8);
                        mix-blend-mode: screen;
                    }
                </style>`;
        } else if (mainCondition.includes('snow')) {
             effectOverlay = `
                <div class="weather-effect snow-effect"></div>
                <style>
                    .snow-effect {
                        background: 
                            radial-gradient(circle at 15% 15%, #fff 2px, transparent 3px),
                            radial-gradient(circle at 35% 45%, #fff 3px, transparent 4px),
                            radial-gradient(circle at 75% 25%, #fff 2px, transparent 3px),
                            radial-gradient(circle at 85% 75%, #fff 3px, transparent 4px);
                        background-size: 80px 80px; 
                        filter: blur(1px);
                    }
                </style>`;
        }

        // HTML della Card Meteo con Sfondo Foto Città
        const html = `
        <html><head><style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;800&display=swap');
            
            body { 
                margin: 0; padding: 0; 
                font-family: 'Poppins', sans-serif; 
                /* 2) Sfondo con foto dinamica della città */
                background-color: #2a5298;
                background-image: url('https://image.pollinations.ai/prompt/${encodeURIComponent(cityNameForImg)}%20city%20landscape%20scenery?width=900&height=600&nologo=true');
                background-size: cover;
                background-position: center;
                display: flex; align-items: center; justify-content: center; 
                height: 600px; width: 900px; 
                overflow: hidden;
                position: relative;
            }

            /* Overlay per sfocare e scurire la foto di sfondo */
            .bg-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.45); /* Scurisce */
                backdrop-filter: blur(12px); /* Sfoca l'immagine dietro */
                -webkit-backdrop-filter: blur(12px);
                z-index: 1;
            }

            .container { position: relative; z-index: 3; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

            /* Livello degli effetti atmosferici (sopra lo sfondo, sotto la card) */
            .weather-effect { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }

            /* 3) Design Card (Allargata a destra e sinistra) */
            .card { 
                position: relative;
                width: 600px; /* Larghezza aumentata */
                padding: 45px 50px; /* Più respiro laterale */
                border-radius: 40px;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(25px) saturate(180%);
                -webkit-backdrop-filter: blur(25px) saturate(180%);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 30px 60px rgba(0,0,0,0.4);
            }

            /* Riflesso luce sul vetro */
            .card::before {
                content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%);
                border-radius: 40px;
                pointer-events: none;
            }

            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .location { font-size: 34px; font-weight: 800; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 12px; }
            .country-tag { font-size: 16px; background: rgba(0,0,0,0.25); padding: 5px 14px; border-radius: 12px; font-weight: 700;}

            .main-content { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
            .temp { font-size: 120px; font-weight: 800; color: #fff; letter-spacing: -6px; margin: 0; text-shadow: 0 10px 20px rgba(0,0,0,0.2); }
            .weather-icon { width: 180px; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.4)); }

            .desc { 
                font-size: 26px; color: rgba(255,255,255,0.95); 
                margin-bottom: 35px; font-weight: 500; 
                text-transform: capitalize; border-bottom: 1px solid rgba(255,255,255,0.2);
                padding-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .detail-card { 
                background: rgba(0, 0, 0, 0.2); 
                padding: 20px 10px; border-radius: 22px; 
                text-align: center; border: 1px solid rgba(255,255,255,0.1);
                box-shadow: inset 0 2px 5px rgba(255,255,255,0.05);
            }
            .detail-val { font-size: 24px; font-weight: 800; color: #fff; display: block; margin-bottom: 5px;}
            .detail-label { font-size: 13px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;}

        </style></head><body>
            <div class="bg-overlay"></div>
            ${effectOverlay}
            <div class="container">
                <div class="card">
                    <div class="header">
                        <div class="location">📍 ${cityName} <span class="country-tag">${country}</span></div>
                    </div>
                    <div class="main-content">
                        <h1 class="temp">${Math.round(temp)}°</h1>
                        <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@4x.png">
                    </div>
                    <div class="desc">${weatherDesc}</div>
                    <div class="details-grid">
                        <div class="detail-card">
                            <span class="detail-val">${Math.round(temp_min)}°/${Math.round(temp_max)}°</span>
                            <span class="detail-label">Min/Max</span>
                        </div>
                        <div class="detail-card">
                            <span class="detail-val">${humidity}%</span>
                            <span class="detail-label">Umidità 💦</span>
                        </div>
                        <div class="detail-card">
                            <span class="detail-val">${windSpeed}</span>
                            <span class="detail-label">km/h 🌬️</span>
                        </div>
                    </div>
                </div>
            </div>
        </body></html>`;

        // Screenshot generato a risoluzione 900x600 (widescreen)
        const buffer = await retryScreenshot(html, 900, 600);
        
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
handler.help = ['meteo <città> [nazione]'];
handler.tags = ['info'];

export default handler;