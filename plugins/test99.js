import { proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {

  const msg = proto.Message.fromObject({
    interactiveMessage: {
      header: {
        title: "iscrizione a origin negraccio"
      },
      body: {
        text: "ovviamente non funziona perché sei gay"
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "galaxy_message",
            buttonParamsJson: JSON.stringify({
              flow_message_version: "3",
              flow_token: "flows-builder-conad-12d19b0d",
              flow_id: "644025641806464",
              flow_cta: "Inizia!",
              flow_action: "data_exchange",
              flow_metadata: {
                flow_json_version: 702,
                data_api_protocol: "PUBLIC_KEY",
                flow_name: "volantino_v1_v2",
                data_api_version: 300,
                www_proxy_secret: "Q5r2BAK9cB3si_HRby-s42sQlZD64gQ_Ps6o8_0H-zRZtdwxcSGwRi5Jl2j2fMGPLN27arZdbwCDBByp",
                flow_token_signature: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzgwNzMzNTAsImV4cCI6MTgwOTYwOTM1MCwiZmxvd190b2tlbiI6ImZsb3dzLWJ1aWxkZXItY29uYWQtMTJkMTliMGQifQ.Tvpd744NF7jJGwQrvoK101P_AsDIRre1WVyohN_dv84",
                categories: []
              }
            })
          }
        ],
        messageParamsJson: ""
      }
    }
  });

  await conn.relayMessage(m.chat, msg, { messageId: m.key.id });

};

handler.command = ['test99'];

export default handler;