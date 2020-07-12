
let fs = require('fs')
let readline = require('readline')

const cardPacks = {}

// Codenames Game
class Game{
  static loadCardPack(cardPack) {
    const words = []
    cardPacks[cardPack.name] = words
    readline.createInterface({
      input: fs.createReadStream(cardPack.filename),
      terminal: false
    }).on('line', (line) => {words.push(line)})
  }

  constructor(cardPackNames){
    this.timerAmount = 61 // Default timer value

    this.allUsedWords = []
    // Copy cardPackNames list
    this.cardPackNames = [...cardPackNames]
    this.updateWordPool()

    this.init();

    this.red = this.findType('red')   // keeps track of unflipped red tiles
    this.blue = this.findType('blue') // keeps track of unflipped blue tiles
  }

  init(){
    this.randomTurn()   // When game is created, select red or blue to start, randomly
    this.over = false   // Whether or not the game has been won / lost
    this.winner = ''    // Winning team
    this.timer = this.timerAmount // Set the timer

    this.board        // Init the board
    this.newBoard()   // Populate the board
    this.log = []     // Initialize empty log
    this.clue = null
  }

  // Check the number of unflipped team tiles and determine if someone won
  checkWin(){
    this.red = this.findType('red')   // unflipped red tiles
    this.blue = this.findType('blue') // unflipped blue tiles
    // Check team winner
    if (this.red === 0) {
      this.over = true
      this.winner = 'red'
    }
    if (this.blue === 0) {
      this.over = true
      this.winner = 'blue'
    }
  }

  // When called, will change a tiles state to flipped
  flipTile(i,j, playerName){
    if (!this.board[i][j].flipped){
      let type = this.board[i][j].type // Find the type of tile (red/blue/neutral/death)
      let logEntry = { 'event': 'flipTile',
                       'team': this.turn,
                       'word': this.board[i][j].word,
                       'type': type,
                       'playerName': playerName,
                       'endedTurn': false }
      this.board[i][j].flipped = true  // Flip tile
      if (type === 'death') { // If death was flipped, end the game and find winner
        this.over = true
        if(this.turn === 'blue') this.winner = 'red'
        else this.winner = 'blue'
      }
      else if (type === 'neutral' // Switch turn if neutral was flipped
            || type !== this.turn // Switch turn if opposite teams tile was flipped
      ) {
        logEntry.endedTurn = true
      }
      this.log.push(logEntry)
      // Log the tile flip first, then switching turns.
      if (logEntry.endedTurn){
        this.switchTurn()
      }
      this.checkWin() // See if the game is over
    }
  }

  // Attempt to declare clue. Returns false if this turn already has one.
  declareClue(clue, playerName){
    if (this.clue === null){
      this.clue = clue
      this.log.push({ 'event': 'declareClue', 'team': this.turn, 'clue': clue, 'playerName': playerName})
      return true
    }
    else{
      return false
    }
  }

  // Find the count of the passed tile type
  findType(type){
    if (!this.board) return 0
    let count = 0
    for (let i = 0; i < 5; i++){
      for (let j = 0; j < 5; j++){
        if (this.board[i][j].type === type && !this.board[i][j].flipped) count++
      }
    }
    return count
  }

  // Sometimes multiple players from a team are clicking end turn simultaneously
  // resulting into calling switchTurn() multiple times.
  // To avoid this, before calling switchTurn(), checking whether turn has already switched to other team,
  // if already switched then ignoring
  callSwitchTurnIfValid(team){
    if(team === this.turn){
      this.switchTurn()
      this.log.push({ 'event': 'switchTurn', 'team': this.turn})
    }
  }

  // Reset the timer and swap the turn over to the other team
  switchTurn(){
    this.timer = this.timerAmount               // Reset timer
    if (this.turn === 'blue') this.turn = 'red' // Switch turn
    else this.turn = 'blue'
    this.clue = null
  }

  // 50% red turn, 50% blue turn
  randomTurn(){
    this.turn = 'blue'
    if (Math.random() < 0.5) this.turn = 'red'
  }

  // Randomly assigns a death tile and red / blue tiles
  initBoard(){
    let changed = []              // Keep track of tiles that have been giving a type
    let tile = this.randomTile()  // Temp tile object that has a random num (0-24) and a coordinate on the grid
    this.board[tile.i][tile.j].type = 'death' // Make the first selected tile a death
    changed.push(tile.num)        // Add the tiles random num (0-24) to the changed []

    let color = this.turn;        // First teams color
    for (let i = 0; i < 17; i++){ // Set tiles' color 17 times(9 for team1, 8 for team2)
      tile = this.randomTile()    // Selected a new random tile
      while (changed.includes(tile.num)) tile = this.randomTile() // If the tile has already been changed, find a new random tile
      this.board[tile.i][tile.j].type = color // Set the tiles color
      changed.push(tile.num)      // Add the tiles random num (0-24) to the changed []
      // Swap the temp color for the next added tile
      if (color === 'blue') color = 'red'
      else color = 'blue'
    }
  }

  // Find a random number between 0-24
  // Convert that number to a coordinate on a 5x5 grid (0-4)(0-4)
  // Return an object with the random number and the coordinates
  randomTile(){
    let num = Math.floor(Math.random() * 25)
    let i = Math.floor(num / 5)
    let j = num % 5
    return {num, i, j}
  }

  // Create a new 5x5 board of random words
  newBoard(){
    if (this.words.length < 25) {
      console.log("Invalid word list. Only has "
                   + this.words.length + " words.");
      return
    }

    this.randomTurn()   // Pick a new random turn
    this.board = new Array();  // Init the board to be a 2d array
    for (let i = 0; i < 5; i++) {this.board[i] = new Array()}
    let foundWord      // Temp var for a word out of the list

    const usedSet = new Set(this.allUsedWords)
    let unusedWords = this.words.filter(x => !usedSet.has(x))
    // If out of words, reset the word list.
    if (unusedWords.length < 25) {
      unusedWords = [...this.words]
      this.allUsedWords = []
    }

    for (let i = 0; i < 5; i++){
      for (let j = 0; j < 5; j++){
        const idx = Math.floor(Math.random() * unusedWords.length)
        foundWord = unusedWords[idx]
        unusedWords.splice(idx, 1)
        this.allUsedWords.push(foundWord) // Add the word to the used list
        this.board[i][j] = {      // Add the tile object to the board
          word:foundWord,
          flipped:false,
          type:'neutral'
        }
      }
    }
    this.initBoard() // randomly select the team words and death word
    
    this.red = this.findType('red') // Update the number of each teams words
    this.blue = this.findType('blue')
  }

  updateWordPool(){
    let pool = []
    this.cardPackNames.forEach(name => pool = pool.concat(cardPacks[name]))
    // Keep only unique words
    this.words = [...new Set(pool)]
  }

  // Debugging purposes
  printBoard(){
    for (let i = 0; i < 5; i++){
      console.log(this.board[i][0].type + " | " +
                  this.board[i][1].type + " | " +
                  this.board[i][2].type + " | " +
                  this.board[i][3].type + " | " +
                  this.board[i][4].type)
    }
  }
}

// Let the main nodejs server know this file exists
module.exports = Game;
