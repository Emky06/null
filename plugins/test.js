// Codice di testt.js

const handler = async (m, { conn }) => {
  const jid = m.chat

  await conn.sendMessage(
    jid,
    {
      text: 'test',
      title: 'se mi vedi sborro',
      subtitle: 'basedddd', 
      footer: 'x',
      interactiveButtons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: '🔁 Rispondi',
            id: 'reply_id'
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '🌐 Visita il sito',
            url: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y',
            merchant_url: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y'
          })
        },
        {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copia link',
            copy_code: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y'
          })
        },
        {
          name: 'cta_call',
          buttonParamsJson: JSON.stringify({
            display_text: '📞 Chiama',
            phone_number: '628123456789'
          })
        },
        {
          name: 'cta_catalog',
          buttonParamsJson: JSON.stringify({
            business_phone_number: '628123456789'
          })
        },
        {
          name: 'cta_reminder',
          buttonParamsJson: JSON.stringify({
            display_text: '🕒 Imposta promemoria'
          })
        },
        {
          name: 'cta_cancel_reminder',
          buttonParamsJson: JSON.stringify({
            display_text: '❌ Cancella promemoria'
          })
        },
        {
          name: 'address_message',
          buttonParamsJson: JSON.stringify({
            display_text: '📍 Invia indirizzo'
          })
        },
        {
          name: 'send_location',
          buttonParamsJson: JSON.stringify({
            display_text: '📌 Invia posizione'
          })
        },
        {
          name: 'open_webview',
          buttonParamsJson: JSON.stringify({
            title: '🌐 Apri WebView',
            link: {
              in_app_webview: true,
              url: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y'
            }
          })
        },
        {
          name: 'mpm',
          buttonParamsJson: JSON.stringify({
            product_id: '8816262248471474'
          })
        },
        {
          name: 'wa_payment_transaction_details',
          buttonParamsJson: JSON.stringify({
            transaction_id: '12345848'
          })
        },
        {
          name: 'automated_greeting_message_view_catalog',
          buttonParamsJson: JSON.stringify({
            business_phone_number: '628123456789', 
            catalog_product_id: '12345'
          })
        },
        {
          name: 'galaxy_message', 
          buttonParamsJson: JSON.stringify({
            mode: 'published',
            flow_message_version: '3',
            flow_token: '1:1307913409923914:293680f87029f5a13d1ec5e35e718af3',
            flow_id: '1307913409923914',
            flow_cta: '🌟 Avvia flusso',
            flow_action: 'navigate',
            flow_action_payload: {
              screen: 'QUESTION_ONE',
              params: {
                user_id: '123456789',
                referral: 'campaign_xyz'
              }
            },
            flow_metadata: {
              flow_json_version: '201',
              data_api_protocol: 'v2',
              flow_name: 'Lead Qualification [it]',
              data_api_version: 'v2',
              categories: ['Lead Generation', 'Sales']
            }
          })
        },
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📝 Seleziona un’opzione',
            sections: [
              {
                title: 'Sezione 1',
                highlight_label: 'Importante',
                rows: [
                  {
                    header: 'Opzione 1',
                    title: 'Titolo 1',
                    description: 'Descrizione 1',
                    id: 'id_1'
                  },
                  {
                    header: 'Opzione 2',
                    title: 'Titolo 2',
                    description: 'Descrizione 2',
                    id: 'id_2'
                  }
                ]
              }
            ]
          })
        }
      ]
    },
    { quoted: m }
  )
}

handler.command = ['it']
handler.tags = ['tools']
handler.help = ['interattivotest']
handler.premium = false

export default handler