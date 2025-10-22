//Plugin fatto da Axtral_WiZaRd
import { performance } from "perf_hooks";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const pizzaTargets = {};

let handler = async (m, { conn, args, command }) => {
    const tipo = args[0]?.toLowerCase();


    let target;
    if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else {
        target = m.sender;
    }

   
    if (!tipo) {
     
        pizzaTargets[m.chat] = target;

        const buttons = [
            { buttonId: '.pizza margherita', buttonText: { displayText: '🍕 Margherita' }, type: 1 },
            { buttonId: '.pizza diavola', buttonText: { displayText: '🌶️ Diavola' }, type: 1 },
            { buttonId: '.pizza 4formaggi', buttonText: { displayText: '🧀 4 Formaggi' }, type: 1 },
            { buttonId: '.pizza vegetariana', buttonText: { displayText: '🥦 Vegetariana' }, type: 1 }
        ];

        const buttonMessage = {
            text: "Scegli la pizza che vuoi farmi preparare 🍽️",
            footer: "Ordina dai pulsanti qui sotto",
            buttons: buttons,
            headerType: 1
        };

        return await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    }


    target = pizzaTargets[m.chat] || target;
    const tag = '@' + target.split('@')[0];

   
    const pizze = {
        margherita: [
            `🍕 Inizio a preparare una pizza *Margherita* per ${tag}...`,
            `👨‍🍳 Stendo l'impasto con amore!`,
            `🍅 Aggiungo la passata di pomodoro.`,
            `🧀 Mozzarella fresca sparsa ovunque.`,
            `🌿 Un tocco di basilico.`,
            `🔥 Inforno la pizza... che profumo!`,
            `🍽️ Margherita pronta per ${tag}!`
        ],
        diavola: [
            `🌶️ Inizio a preparare una *Diavola* per ${tag}...`,
            `👨‍🍳 Impasto bello tirato.`,
            `🍅 Pomodoro abbondante.`,
            `🧀 Mozzarella filante.`,
            `🌶️ Salame piccante a volontà!`,
            `🔥 Forno rovente, la Diavola cuoce...`,
            `🍽️ Diavola pronta per ${tag}!`
        ],
        "4formaggi": [
            `🧀 Inizio a preparare una *Quattro Formaggi* per ${tag}...`,
            `👨‍🍳 Impasto morbido e soffice.`,
            `🧀 Mozzarella, gorgonzola, fontina, parmigiano...`,
            `🔥 Forno acceso, formaggi che si sciolgono!`,
            `🍽️ 4 Formaggi pronta per ${tag}!`
        ],
        vegetariana: [
            `🥦 Inizio a preparare una *Vegetariana* per ${tag}...`,
            `👨‍🍳 Stendo l'impasto integrale.`,
            `🍅 Pomodoro bio, mozzarella light.`,
            `🥦 Zucchine, melanzane, peperoni...`,
            `🌿 Una spolverata di origano.`,
            `🔥 Inforno questa bontà naturale.`,
            `🍽️ Vegetariana pronta per ${tag}!`
        ]
    };

    const messaggi = pizze[tipo];
    if (!messaggi) {
        return conn.reply(m.chat, "❌ Tipo di pizza non valido. Usa: `.pizza` e scegli dai pulsanti.", m);
    }

    for (let msg of messaggi) {
        await conn.reply(m.chat, msg, m, {
            mentions: [target]
        });
        await delay(2000);
    }

    const start = performance.now();
    const end = performance.now();
    const time = (end - start).toFixed(3);

    const finale = `🍕 Pizza *${tipo[0].toUpperCase() + tipo.slice(1)}* servita in *${time}ms*! Buon appetito, ${tag}!`;
    await conn.reply(m.chat, finale, m, {
        mentions: [target]
    });

    
    delete pizzaTargets[m.chat];
};

handler.command = ['pizza'];
handler.tags = ['fun'];
handler.help = ['.pizza (tagga o rispondi a qualcuno)'];

export default handler;