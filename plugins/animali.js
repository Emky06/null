export const animaliShop = [
  { nome: '🐴 𝐂𝐚𝐯𝐚𝐥𝐥𝐨', prezzo: 9000 },

  { nome: '🐶 𝐂𝐚𝐧𝐞', prezzo: 5000 },
  { nome: '🐱 𝐆𝐚𝐭𝐭𝐨', prezzo: 4500 },
  { nome: '🐢 𝐓𝐚𝐫𝐭𝐚𝐫𝐮𝐠𝐚', prezzo: 4000 },
  { nome: '🐰 𝐂𝐨𝐧𝐢𝐠𝐥𝐢𝐨', prezzo: 3500 }, 
  { nome: '🥫 𝐂𝐢𝐛𝐨 (𝐱1)', prezzo: 1500, tipo: 'cibo', quantita: 1 },
  { nome: '🥫 𝐂𝐢𝐛𝐨 (𝐱3)', prezzo: 4000, tipo: 'cibo', quantita: 3 },
];

export const animaliDisponibili = animaliShop
  .filter(a => !a.tipo || a.tipo !== 'cibo')
  .map(a => a.nome);