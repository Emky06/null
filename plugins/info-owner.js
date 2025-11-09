//info-owner di RIad
let handler = async (m, { conn }) => {
  try {
    let owners = global.owner.filter(([id]) => id).map(([id]) => id)

    // qui ci metti le frasi personalizzate, nello stesso ordine degli owner
    let frasi = [
      "𝛬𝑿𝑻𝑹𝜜𝑳",
    ]

    let buttons = owners.map((id, index) => {
      let waLink = `https://wa.me/${id}`
      return {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: frasi[index] || ``,
          url: waLink,
          merchant_url: waLink
        })
      }
    })

    await conn.sendMessage(
      m.chat,
      {
        text: "𝐎𝐰𝐧𝐞𝐫 𝐝𝐢 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕 ☄️",
        footer: "𝒄𝒐𝒏𝒕𝒂𝒕𝒕𝒊:",
        interactiveButtons: buttons
      },
      { quoted: m }
    )
  } catch (e) {
    console.error(e)
    m.reply("❌ Errore durante l’invio dei contatti degli owner.")
  }
}

handler.help = ['proprietario']
handler.tags = ['info']
handler.command = ['proprietario', 'proprietari']

export default handler