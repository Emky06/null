//Plugin fatto da Axtral_WiZaRd
class TicTacToe { 
  constructor(playerX='x', playerO='o'){ 
    this.playerX=playerX; 
    this.playerO=playerO; 
    this._currentTurn=false; 
    this._x=0; this._o=0; 
    this.turns=0; 
  } 
  get board(){return this._x|this._o} 
  get currentTurn(){return this._currentTurn?this.playerO:this.playerX} 
  get enemyTurn(){return this._currentTurn?this.playerX:this.playerO} 
  static check(state){for(const combo of [7,56,73,84,146,273,292,448])if((state&combo)===combo)return true;return false}
  static toBinary(x=0,y=0){if(x<0||x>2||y<0||y>2)throw new Error('invalid position');return 1<<x+(3*y)}
  turn(player=0,x=0,y){if(this.board===511)return -3;let pos=0;if(y==null){if(x<0||x>8)return -1;pos=1<<x}else{if(x<0||x>2||y<0||y>2)return -1;pos=TicTacToe.toBinary(x,y)}if(this._currentTurn^player)return -2;if(this.board&pos)return 0;this[this._currentTurn?'_o':'_x']|=pos;this._currentTurn=!this._currentTurn;this.turns++;return 1}
  static render(boardX=0,boardO=0){const x=parseInt(boardX.toString(2),4);const y=parseInt(boardO.toString(2),4)*2;return [...(x+y).toString(4).padStart(9,'0')].reverse().map((v,i)=>v==1?'X':v==2?'O':i+1)}
  render(){return TicTacToe.render(this._x,this._o)}
  get winner(){const x=TicTacToe.check(this._x);const o=TicTacToe.check(this._o);return x?this.playerX:o?this.playerO:false}
}

const REWARD=100

let handler = async (m, { conn, text, usedPrefix, command })=>{
  conn.game=conn.game||{}
  switch(command.toLowerCase()){
    case 'tris': // CREA STANZA
      if(!text) return m.reply(`✏️ 𝐔𝐬𝐚: ${usedPrefix}tris 𝐧𝐨𝐦𝐞_𝐬𝐭𝐚𝐧𝐳𝐚`)
      if(Object.values(conn.game).find(r=>r.id.startsWith('ttt')&&[r.game.playerX,r.game.playerO].includes(m.sender))) 
        return m.reply('❌ 𝐒𝐭𝐚𝐢 𝐠𝐢𝐚̀ 𝐠𝐢𝐨𝐜𝐚𝐧𝐝𝐨 𝐮𝐧𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚')
      let room={id:'ttt-'+Date.now(),name:text,x:m.chat,o:'',game:new TicTacToe(m.sender,'o'),state:'WAITING'}
      conn.game[room.id]=room
      m.reply(`╭━━━━━❎ 𝐓𝐑𝐈𝐒 ⭕━━━━━╮
┃ 𝐒𝐭𝐚𝐧𝐳𝐚: *${text}*
┃ 𝐈𝐧 𝐚𝐭𝐭𝐞𝐬𝐚 𝐝𝐢 𝐮𝐧 𝐠𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐞…
┣━━━━━━━━━━━━━━━━━
┃ ✍️ 𝐄𝐧𝐭𝐫𝐚 𝐜𝐨𝐧: ${usedPrefix}entra ${text}
╰━━━━━━━━━━━━━━━━━╯`)
      break

    case 'entra': // ENTRA STANZA
      let roomEnter=Object.values(conn.game).find(r=>r.state==='WAITING'&&r.name===text)
      if(!roomEnter) return m.reply('❌ 𝐒𝐭𝐚𝐧𝐳𝐚 𝐢𝐧𝐞𝐬𝐢𝐬𝐭𝐞𝐧𝐭𝐞')
      roomEnter.o=m.chat
      roomEnter.game.playerO=m.sender
      roomEnter.state='PLAYING'
      sendBoard(conn,roomEnter,m,'𝐏𝐚𝐫𝐭𝐢𝐭𝐚 𝐈𝐧𝐢𝐳𝐢𝐚𝐭𝐚')
      break

    case 'esci': // USCITA
      let roomExit=Object.values(conn.game).find(r=>[r.game.playerX,r.game.playerO].includes(m.sender))
      if(!roomExit) return m.reply('𝐍𝐨𝐧 𝐬𝐞𝐢 𝐢𝐧 𝐩𝐚𝐫𝐭𝐢𝐭𝐚')
      delete conn.game[roomExit.id]
      m.reply('🚪 𝐒𝐞𝐢 𝐮𝐬𝐜𝐢𝐭𝐨 𝐝𝐚𝐥𝐥𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚')
      break
  }
}
handler.command=/^(tris|entra|esci)$/i
export default handler

// FUNZIONI COMUNI
function renderGrid(room) {
  let b = room.game.render().map(v=>({
    X:'❎', O:'⭕', 1:'1️⃣',2:'2️⃣',3:'3️⃣',
    4:'4️⃣',5:'5️⃣',6:'6️⃣',
    7:'7️⃣',8:'8️⃣',9:'9️⃣'
  })[v])
  return ` ${b[0]} │ ${b[1]} │ ${b[2]}
───┼───┼───
 ${b[3]} │ ${b[4]} │ ${b[5]}
───┼───┼───
 ${b[6]} │ ${b[7]} │ ${b[8]}`
}

async function sendBoard(conn, room, m, title='𝐓𝐑𝐈𝐒') {
  let grid = renderGrid(room)
  let txt = `╭━━━━━━ ${title} ━━━━━━╮
┃ ❎ @${room.game.playerX.split('@')[0]}
┃ ⭕ @${room.game.playerO.split('@')[0]}
┣━━━━━━━━━━━━━━━━━━━
${grid.split('\n').map(l => '┃ ' + l).join('\n')}
┣━━━━━━━━━━━━━━━━━━━
┃ 🎯 𝐓𝐮𝐫𝐧𝐨: @${room.game.currentTurn.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━╯`

  await conn.sendMessage(room.x, { text: txt, mentions: conn.parseMention(txt) })
  if (room.o && room.o !== room.x)
    await conn.sendMessage(room.o, { text: txt, mentions: conn.parseMention(txt) })
}

export async function before(m){
  let room=Object.values(this.game||{}).find(r=>r.state==='PLAYING'&&[r.game.playerX,r.game.playerO].includes(m.sender))
  if(!room)return true
  if(!/^[1-9]$|^(resa|esci)$/i.test(m.text))return true
  if(!/^[1-9]$/.test(m.text)){room.game._currentTurn=m.sender===room.game.playerX;return finishGame(this,room,room.game.currentTurn)}
  if(m.sender!==room.game.currentTurn)return true
  let ok=room.game.turn(m.sender===room.game.playerO,parseInt(m.text)-1)
  if(ok<1)return true
  if(room.game.winner)return finishGame(this,room,room.game.winner)
  if(room.game.board===511)return finishGame(this,room,null)
  return sendBoard(this,room,m)
}

async function finishGame(conn,room,winner){
  let users=global.db.data.users
  if(winner)users[winner].money=(users[winner].money||0)+REWARD
  let text=winner?`🏆 *@${winner.split('@')[0]} 𝐡𝐚 𝐯𝐢𝐧𝐭𝐨!* 💰 +${REWARD} €`:`🤝 𝐏𝐚𝐫𝐞𝐠𝐠𝐢𝐨!`
  await conn.sendMessage(room.x,{text,mentions:winner?[winner]:[]})
  if(room.o&&room.o!==room.x)await conn.sendMessage(room.o,{text,mentions:winner?[winner]:[]})
  delete conn.game[room.id]
}