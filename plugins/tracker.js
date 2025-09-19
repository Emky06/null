// TRACKER MESSAGGI GLOBALI
// by Youns

function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, excluded: { users: {}, chats: {} } } }
  if (!global.db.data.users) global.db.data.users = {}
  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.excluded) global.db.data.excluded = { users: {}, chats: {} }
}

let handler = m => {
  ensureDB()

  // ignora broadcast o chat non di gruppo
  if (!m.chat || m.chat.endsWith('broadcast')) return
  if (!m.isGroup) return

  // inizializza gruppo se non esiste
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  let chat = global.db.data.chats[m.chat]
  if (!chat.utenti) chat.utenti = {}

  // ignora se gruppo escluso
  if (global.db.data.excluded.chats[m.chat]) return

  // aggiorna messaggi utente
  let sender = m.sender
  chat.utenti[sender] = (chat.utenti[sender] || 0) + 1

  // aggiorna totale utente globale
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {}
  global.db.data.users[sender].totali = (global.db.data.users[sender].totali || 0) + 1
}

handler.all = true // <-- FONDAMENTALE: così gira su ogni messaggio

export default handler