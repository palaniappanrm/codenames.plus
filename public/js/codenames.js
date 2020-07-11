let socket = io({path: window.location.pathname + 'socket.io'}) // Connect to server

// Sign In Page Elements
////////////////////////////////////////////////////////////////////////////
// Divs
let joinDiv = document.getElementById('join-game')
let joinErrorMessage = document.getElementById('error-message')
// Input Fields
let joinNickname = document.getElementById('join-nickname')
let joinRoom = document.getElementById('join-room')
let joinPassword = document.getElementById('join-password')
// Buttons
let joinEnter = document.getElementById('join-enter')
let joinCreate = document.getElementById('join-create')


// Game Page Elements
////////////////////////////////////////////////////////////////////////////
// Divs
let gameDiv = document.getElementById('game')
let overallScoreRed = document.getElementById('overall-score-red')
let overallScoreBlue = document.getElementById('overall-score-blue')
let clueEntryDiv = document.getElementById('clue-form')
let boardDiv = document.getElementById('board')
let aboutWindow = document.getElementById('about-window')
let afkWindow = document.getElementById('afk-window')
let serverMessageWindow = document.getElementById('server-message')
let serverMessage = document.getElementById('message')
let overlay = document.getElementById('overlay')
let logDiv = document.getElementById('log')
let playerNameDiv = document.getElementById('player-name')
// Buttons
let leaveRoom = document.getElementById('leave-room')
let joinRed = document.getElementById('join-red')
let joinBlue = document.getElementById('join-blue')
let joinObservers = document.getElementById('join-observers')
let randomizeTeams = document.getElementById('randomize-teams')
let endTurn = document.getElementById('end-turn')
let newGame = document.getElementById('new-game')
let clueDeclareButton = document.getElementById('declare-clue')
let buttonRoleGuesser = document.getElementById('role-guesser')
let buttonRoleSpymaster = document.getElementById('role-spymaster')
let toggleDifficulty = document.getElementById('player-difficulty')
let buttonDifficultyNormal = document.getElementById('difficulty-normal')
let buttonDifficultyHard = document.getElementById('difficulty-hard')
let buttonModeCasual = document.getElementById('mode-casual')
let buttonModeTimed = document.getElementById('mode-timed')
let buttonConsensusSingle = document.getElementById('consensus-single')
let buttonConsensusConsensus = document.getElementById('consensus-consensus')
let buttonAbout = document.getElementById('about-button')
let buttonAfk = document.getElementById('not-afk')
let buttonServerMessageOkay = document.getElementById('server-message-okay')
// Clue entry
let clueWord = document.getElementById('clue-word')
let clueCount = document.getElementById('clue-count')
// Slider
let timerSlider = document.getElementById('timer-slider')
let timerSliderLabel = document.getElementById('timer-slider-label')
// Player Lists
let undefinedList = document.getElementById('undefined-list')
let redTeam = document.getElementById('red-team')
let blueTeam = document.getElementById('blue-team')
let observersList = document.getElementById('observers-list')
// UI Elements
let scoreRed = document.getElementById('score-red')
let scoreBlue = document.getElementById('score-blue')
let turnMessage = document.getElementById('status')
let timer = document.getElementById('timer')
let clueDisplay = document.getElementById('clue-display')

let colorAndTypeToTextMap = {"red" : "fire", "blue" : "ice", "neutral" : "neutral", "death" : "death", "undecided" : "undecided"}

// init
////////////////////////////////////////////////////////////////////////////
// Default game settings
let playerRole = 'guesser'
let difficulty = 'normal'
let mode = 'casual'
let consensus = 'single'

// Show the proper toggle options
buttonModeCasual.disabled = true;
buttonModeTimed.disabled = false;
buttonRoleGuesser.disabled = true;
buttonRoleSpymaster.disabled = false;
buttonConsensusSingle.disabled = true;
buttonConsensusConsensus.disabled = false;

// Autofill room and password from query fragment
joinRoom.value = extractFromFragment(window.location.hash, 'room');
joinPassword.value = extractFromFragment(window.location.hash, 'password');


// UI Interaction with server
////////////////////////////////////////////////////////////////////////////
// User Joins Room
joinEnter.onclick = () => {       
  socket.emit('joinRoom', {
    nickname:joinNickname.value,
    room:joinRoom.value,
    password:joinPassword.value
  })
}
// User Creates Room
joinCreate.onclick = () => {      
  socket.emit('createRoom', {
    nickname:joinNickname.value,
    room:joinRoom.value,
    password:joinPassword.value
  })
}
// User Leaves Room
leaveRoom.onclick = () => {       
  socket.emit('leaveRoom', {})
}
// User Joins Red Team
joinRed.onclick = () => {         
  socket.emit('joinTeam', {
    team:'red'
  })
}
// User Joins Blue Team
joinBlue.onclick = () => {        
  socket.emit('joinTeam', {
    team:'blue'
  })
}
// User Randomizes Team
randomizeTeams.onclick = () => {
  if(confirm("Are you sure you want to randomize teams?")) {
    socket.emit('randomizeTeams', {})
  }
}
// User Joins Observers
joinObservers.onclick = () => {
  socket.emit('joinTeam', {
    team:'observers'
  })
}
// User trying to start New Game
newGame.onclick = () => {
    socket.emit('newGame', {doubleConfirmed: false})
}
clueDeclareButton.onclick = () => {
  socket.emit('declareClue', {word: clueWord.value, count: clueCount.value})
  clueWord.value = ''
  clueCount.value = ''
  return false
}
// User Picks spymaster Role
buttonRoleSpymaster.onclick = () => { 
  socket.emit('switchRole', {role:'spymaster'})
}
// User Picks guesser Role
buttonRoleGuesser.onclick = () => {   
  socket.emit('switchRole', {role:'guesser'})
}
// User Picks Hard Difficulty
buttonDifficultyHard.onclick = () => {
  socket.emit('switchDifficulty', {difficulty:'hard'})
}
// User Picks Normal Difficulty 
buttonDifficultyNormal.onclick = () => {
  socket.emit('switchDifficulty', {difficulty:'normal'})
}
// User Picks Timed Mode
buttonModeTimed.onclick = () => { 
  socket.emit('switchMode', {mode:'timed'})
}
// User Picks Casual Mode
buttonModeCasual.onclick = () => {
  socket.emit('switchMode', {mode:'casual'})
}
// User Picks Single Consensus Mode
buttonConsensusSingle.onclick = () => {
  socket.emit('switchConsensus', {consensus:'single'})
}
// User Picks Consensus Consensus Mode
buttonConsensusConsensus.onclick = () => {
  socket.emit('switchConsensus', {consensus:'consensus'})
}
// User Ends Turn
endTurn.onclick = () => {
  socket.emit('endTurn', {})
}
// User Clicks Tile
function tileClicked(i,j){
  socket.emit('clickTile', {i:i, j:j})
}
// User Clicks About
buttonAbout.onclick = () => {
  if (aboutWindow.style.display === 'none') {
    aboutWindow.style.display = 'block'
    overlay.style.display = 'block'
    buttonAbout.className = 'open above'
  } else {
    aboutWindow.style.display = 'none'
    overlay.style.display = 'none'
    buttonAbout.className = 'above'
  }
}

// When the slider is changed
timerSlider.addEventListener("input", () =>{
  socket.emit('timerSlider', {value:timerSlider.value})
})

// User confirms theyre not afk
buttonAfk.onclick = () => {
  socket.emit('active')
  afkWindow.style.display = 'none'
  overlay.style.display = 'none'
}

// User confirms server message
buttonServerMessageOkay.onclick = () => {
  serverMessageWindow.style.display = 'none'
  overlay.style.display = 'none'
}

// Server Responses to this client
////////////////////////////////////////////////////////////////////////////
socket.on('serverStats', (data) => {        // Client gets server stats
  document.getElementById('server-stats').innerHTML = "Players: " + data.players + " | Rooms: " + data.rooms
})

socket.on('joinResponse', (data) =>{        // Response to joining room
  if(data.success){
    joinDiv.style.display = 'none'
    gameDiv.style.display = 'block'
    joinErrorMessage.innerText = ''
    playerNameDiv.innerText = data.playerName
    updateFragment();
  } else joinErrorMessage.innerText = data.msg
})

socket.on('createResponse', (data) =>{      // Response to creating room
  if(data.success){
    joinDiv.style.display = 'none'
    gameDiv.style.display = 'block'
    joinErrorMessage.innerText = ''
    playerNameDiv.innerText = data.playerName
    updateFragment();
  } else joinErrorMessage.innerText = data.msg
})

socket.on('leaveResponse', (data) =>{       // Response to leaving room
  if(data.success){
    joinDiv.style.display = 'block'
    gameDiv.style.display = 'none'
    wipeBoard();
  }
})

socket.on('timerUpdate', (data) => {        // Server update client timer
  timer.innerHTML = "[" + data.timer + "]"
})

socket.on('newGameResponse', (data) => {    // Response to New Game
  if (data.success){
    wipeBoard();
  }else if (confirm("Are you sure you want to start a new game?")){
    socket.emit('newGame', {doubleConfirmed: true})
  }
})

socket.on('afkWarning', () => {    // Response to Afk Warning
  afkWindow.style.display = 'block'
  overlay.style.display = 'block'
})

socket.on('afkKicked', () => {    // Response to Afk Kick
  afkWindow.style.display = 'none'
  serverMessageWindow.style.display = 'block'
  serverMessage.innerHTML = 'You were kicked for being AFK'
  overlay.style.display = 'block'
})

socket.on('serverMessage', (data) => {    // Response to Server message
  serverMessage.innerHTML = data.msg
  serverMessageWindow.style.display = 'block'
  overlay.style.display = 'block'
})

socket.on('switchRoleResponse', (data) =>{  // Response to Switching Role
  if(data.success){
    playerRole = data.role;
    if (playerRole === 'guesser') {
      buttonRoleGuesser.disabled = true;
      buttonRoleSpymaster.disabled = false;
    } else {
      buttonRoleGuesser.disabled = false;
      buttonRoleSpymaster.disabled = true;
    }
    wipeBoard();
  }
})

socket.on('gameState', (data) =>{           // Response to gamestate update
  updateTeamColors(data);
  updateCardPackButtons(data.availableCardPacks);

  if (data.difficulty !== difficulty){  // Update the clients difficulty
    difficulty = data.difficulty
    wipeBoard();                        // Update the appearance of the tiles
  }
  mode = data.mode                      // Update the clients game mode
  consensus = data.consensus            // Update the clients consensus mode
  updateInfo(data.game, data.team, data.overallScoreRed, data.overallScoreBlue)      // Update the games turn information
  updateTimerSlider(data.game, data.mode)          // Update the games timer slider
  updatePacks(data.game)                // Update the games pack information
  updatePlayerlist(data.players)        // Update the player list for the room

  proposals = []
  for (let i in data.players){
    let guessProposal = data.players[i].guessProposal
    if (guessProposal !== null){
      proposals[guessProposal] = proposals[guessProposal]
                                   ? proposals[guessProposal] + 1
                                   : 1;
    }
  }

  // Update the board display
  updateBoard(data.game.board, proposals, data.game.over, data.game.turn)
  updateLog(data.game.log)

  updatePalette(data);
})


// Utility Functions
////////////////////////////////////////////////////////////////////////////

// Wipe all of the descriptor tile classes from each tile
function wipeBoard(){
  for (let x = 0; x < 5; x++){
    let row = document.getElementById('row-' + (x+1))
    for (let y = 0; y < 5; y++){
      let button = row.children[y]
      button.className = 'tile'
    }
  }
}

// Update the game info displayed to the client
function updateInfo(game, team, roomScoreRed, roomScoreBlue){
  scoreBlue.innerHTML = game.blue                         // Update the blue tiles left
  scoreRed.innerHTML = game.red                           // Update the red tiles left
  overallScoreRed.innerHTML=roomScoreRed
  overallScoreBlue.innerHTML=roomScoreBlue
  turnMessage.innerHTML = colorAndTypeToTextMap[game.turn] + "'s turn"           // Update the turn msg
  turnMessage.className = game.turn                       // Change color of turn msg
  if (game.over){                                         // Display winner
    turnMessage.innerHTML = colorAndTypeToTextMap[game.winner] + " wins!"
    turnMessage.className = game.winner
  }
  if (team !== game.turn) endTurn.disabled = true         // Disable end turn button for opposite team
  else endTurn.disabled = false
  if (playerRole === 'spymaster') {
    endTurn.disabled = true // Disable end turn button for spymasters
  }
  clueEntryDiv.style.display = playerRole === 'spymaster' && game.clue === null && team === game.turn ? '' : 'none'
  if (game.over || game.clue === null){
    clueDisplay.innerText = ''
  }
  else {
    let clueCountView = game.clue.count === '' ? '' : (' ('+(game.clue.count === 'unlimited' ? '∞' : game.clue.count)+')')
    clueDisplay.innerText = game.clue.word + clueCountView
  }
}

// Update the clients timer slider
function updateTimerSlider(game, mode){
  let minutes = (game.timerAmount - 1) / 60
  timerSlider.value = minutes
  timerSliderLabel.innerHTML = "Timer Length : " + timerSlider.value + "min"

  // If the mode is not timed, dont show the slider
  if (mode === 'casual'){
    timerSlider.style.display = 'none'
    timerSliderLabel.style.display = 'none'
  } else {
    timerSlider.style.display = 'block'
    timerSliderLabel.style.display = 'block'
  }
}

function updateCardPackButtons(availableCardPacks){
  cardPacks = document.getElementById("card-packs")
  // Card packs don't change, only have to do this once.
  if(cardPacks.querySelectorAll("button").length > 0) return

  availableCardPacks.forEach(name => {
    const button = document.createElement('button')
    button.innerText = name
    button.onclick = e => {
      socket.emit('changeCards', {pack:e.srcElement.innerText})
    }
    cardPacks.appendChild(button)
  })
}

// Update the pack toggle buttons
function updatePacks(game){
  cardPacks = document.getElementById("card-packs")

  cardPacks.querySelectorAll('button').forEach(button => {
    button.className = (game.cardPackNames.includes(button.innerText)
                          ? 'enabled'
                          : '')
  })

  document.getElementById('word-pool').innerHTML = "Word Pool: " + game.words.length
}

// Update the board
function updateBoard(board, proposals, gameOver, turn){
  // Add description classes to each tile depending on the tiles color
  for (let x = 0; x < 5; x++){
    let row = document.getElementById('row-' + (x+1))
    for (let y = 0; y < 5; y++){
      let button = row.children[y]
      button.innerHTML = board[x][y].word
      button.className = "tile"
      if (board[x][y].type === 'red') button.className += " r"    // Red tile
      if (board[x][y].type === 'blue') button.className += " b"   // Blue tile
      if (board[x][y].type === 'neutral') button.className += " n"// Neutral tile
      if (board[x][y].type === 'death') button.className += " d"  // Death tile
      if (board[x][y].flipped) button.className += " flipped"     // Flipped tile
      if (board[x][y].word in proposals) { button.className += " proposed" // proposed guess
        let span = document.createElement('span')
        span.innerText = '🤔'.repeat(proposals[board[x][y].word])
        span.className = 'proposals '  + turn
        button.appendChild(span)
      }
      if (playerRole === 'spymaster' || gameOver) button.className += " s"    // Flag all tiles if the client is a spy master
      if (difficulty === 'hard') button.className += " h"         // Flag all tiles if game is in hard mode
    }
  }
  // Show the proper toggle options for the game difficulty
  if (difficulty === 'normal') {
    buttonDifficultyNormal.disabled = true;
    buttonDifficultyHard.disabled = false;
  } else {
    buttonDifficultyNormal.disabled = false;
    buttonDifficultyHard.disabled = true;
  }
  // Show the proper toggle options for the game mode
  if (mode === 'casual') {
    buttonModeCasual.disabled = true;
    buttonModeTimed.disabled = false;
    timer.innerHTML = ""
  } else {
    buttonModeCasual.disabled = false;
    buttonModeTimed.disabled = true;
  }
  // Show the proper toggle options for the game consensus mode
  if (consensus === 'single') {
    buttonConsensusSingle.disabled = true;
    buttonConsensusConsensus.disabled = false;
  } else {
    buttonConsensusSingle.disabled = false;
    buttonConsensusConsensus.disabled = true;
  }
}

// Update the player list
function updatePlayerlist(players){
  undefinedList.innerHTML = ''
  redTeam.innerHTML = ''
  blueTeam.innerHTML = ''
  observersList.innerHTML = ''
  for (let i in players){
    // Create a li element for each player
    let li = document.createElement('li');
    li.innerText = players[i].nickname
    // If the player is a spymaster, put brackets around their name
    if (players[i].role === 'spymaster') li.innerText = "[" + players[i].nickname + "]"
    else if (players[i].guessProposal !== null){
      let guessProposal = document.createElement('span')
      guessProposal.classList.add('guess-proposal')
      guessProposal.innerText = players[i].guessProposal
      li.appendChild(guessProposal)
    }
    // Add the player to their teams ul
    if (players[i].team === 'undecided'){
      undefinedList.appendChild(li)
    } else if (players[i].team === 'red'){
      redTeam.appendChild(li)
    } else if (players[i].team === 'blue'){
      blueTeam.appendChild(li)
    } else if (players[i].team === 'observers'){
      observersList.appendChild(li)
    }
  }
}

function updateTeamColors(data){
  colorAndTypeToTextMap["red"] = data.redTeamName
  colorAndTypeToTextMap["blue"] = data.blueTeamName
  joinRed.innerHTML = "Join " + colorAndTypeToTextMap["red"]
  joinBlue.innerHTML = "Join " + colorAndTypeToTextMap["blue"]
  document.documentElement.style.setProperty("--red-team-deep-color", data.redDeepColor)
  document.documentElement.style.setProperty("--blue-team-deep-color", data.blueDeepColor)
  document.documentElement.style.setProperty("--red-team-light-color", data.redLightColor)
  document.documentElement.style.setProperty("--blue-team-light-color", data.blueLightColor)
}

function updatePalette(data){
  const redPalette = document.getElementById("color-scheme-red");
  const bluePalette = document.getElementById("color-scheme-blue");
  if (redPalette.firstElementChild || bluePalette.firstElementChild) {
    // Palette never changes, so only do this once.
    return
  }

  function addColor(team, palette, color) {
    const colorBox = document.createElement('button');
    colorBox.className = "box"
    colorBox.style = "background: linear-gradient(to right bottom, " + color.deep + " 50%, " + color.light + " 50%);"
    colorBox.setAttribute("data-team", team)
    colorBox.setAttribute("data-name", color.name)
    colorBox.onclick = (event) =>{
      socket.emit('colorChange', {
        team:event.srcElement.getAttribute("data-team"),
        name:event.srcElement.getAttribute("data-name"),
      })
    }
    palette.appendChild(colorBox)
  }

  data.redPalette.forEach(c => addColor("red", redPalette, c));
  data.bluePalette.forEach(c => addColor("blue", bluePalette, c));
}

function updateLog(log){
  logDiv.innerHTML = ''
  log.forEach(logEntry => {
    let logSpan = document.createElement('span')
    logSpan.className = logEntry.event + " " + logEntry.team
    if (logEntry.event === 'flipTile'){
      logSpan.innerText = ((consensus == 'single'
                              ? logEntry.playerName + " from "
                              : "")
                           + colorAndTypeToTextMap[logEntry.team]
                           + " team flipped " + logEntry.word
                           + " (" + colorAndTypeToTextMap[logEntry.type] + ")"
                           + (logEntry.type === 'death' ? " ending the game"
                              : logEntry.endedTurn ? " ending their turn"
                              : ""))
    }
    else if (logEntry.event === 'switchTurn'){
      logSpan.innerText = "Switched to " + colorAndTypeToTextMap[logEntry.team] + " team's turn"
    }
    else if (logEntry.event === 'declareClue'){
      let clueCountView = logEntry.clue.count === '' ? '' : (' ('+(logEntry.clue.count === 'unlimited' ? '∞' : logEntry.clue.count)+')')
      logSpan.innerText = colorAndTypeToTextMap[logEntry.team] + ' team was given the clue "'
                           + logEntry.clue.word + '"' + clueCountView + " by " + logEntry.playerName
    }
    logDiv.prepend(logSpan)
  })
}

function extractFromFragment(fragment, toExtract) {
  let vars = fragment.substring(1).split('&');
  for (let i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair.length !== 2) {
      continue;
    }
    if (decodeURIComponent(pair[0]) === toExtract) {
        return decodeURIComponent(pair[1]);
    }
  }
  return '';
}

function updateFragment() {
  let room = joinRoom.value;
  let password = joinPassword.value;
  let fragment =  'room=' + encodeURIComponent(room) + '&password=' + encodeURIComponent(password);
  window.location.hash = fragment;
}

// Client Side UI Elements

// Hide donate banner
document.getElementById('donate-hide').onclick = () => { 
  document.getElementById('donate').className = 'hide'
}
