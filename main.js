const screens = {
  home: document.querySelector('.home-screen'),
  character: document.querySelector('.character-screen'),
  setup: document.querySelector('.setup-screen'),
  waiting: document.querySelector('.waiting-screen'),
  game: document.querySelector('.game-screen'),
  result: document.querySelector('.result-screen'),
};
let gameId = null;
let playerRole = null;
let playerName = '';
let playerSymbol = null;
let gameRef = null;
let gameStarted = false;
const sounds = {
  bgm: new Audio('sounds/bgm.mp3'),
  click: new Audio('sounds/click.mp3'),
  select: new Audio('sounds/select.mp3'),
  heart: new Audio('sounds/heart.mp3'),
  cross: new Audio('sounds/cross.mp3'),
  win: new Audio('sounds/win.mp3'),
  lose: new Audio('sounds/lose.mp3'),
  draw: new Audio('sounds/draw.mp3')
};
let isMuted = false;
let audioStarted = false;
sounds.bgm.loop = true;
sounds.bgm.volume = 0.3;
function playSound(name) {
  if (isMuted) return;
  if (!audioStarted && name !== 'bgm') {
    audioStarted = true;
    sounds.bgm.play().catch(e => console.log('BGM Blocked:', e));
  }
  const sound = sounds[name];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log('SFX Blocked:', e));
  }
}
document.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (target && !target.classList.contains('mute-btn')) {
    playSound('click');
  }
  const card = e.target.closest('.character-card');
  if (card) playSound('select');
});
setTimeout(() => {
  const muteBtn = document.querySelector('.mute-btn');
  if (muteBtn) {
    muteBtn.onclick = () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? '🔇' : '🔊';
      if (isMuted) sounds.bgm.pause();
      else if (audioStarted) sounds.bgm.play();
    };
  }
}, 500);
function show(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  setTimeout(() => screens[screenName].classList.add('active'), 50);
}
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.onclick = () => {
    if (gameRef) {
      gameRef.off();
      gameRef = null;
    }
    gameStarted = false;
    show(btn.getAttribute('data-back'));
  };
});
document.querySelector('.start-btn').onclick = () => show('character');
const cards = document.querySelectorAll('.character-card');
const continueBtn = document.querySelector('.continue-btn');
cards.forEach(card => {
  card.onclick = () => {
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    continueBtn.disabled = false;
  };
});
continueBtn.onclick = () => show('setup');
const nameInput = document.querySelector('.name-input');
const gameIdInput = document.querySelector('.game-id-input');
const joinInput = document.querySelector('.join-input');
const waitingId = document.querySelector('.waiting-id');
nameInput.value = '';
gameIdInput.value = '';
joinInput.value = '';
document.querySelector('.create-btn').onclick = () => {
  playerName = nameInput.value.trim() || 'Player 1';
  gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
  gameIdInput.value = gameId;
  waitingId.textContent = gameId;
  playerRole = 'player1';
  playerSymbol = 'X';
  gameRef = database.ref('games/' + gameId);
  gameRef.set({
    player1: {
      name: playerName,
      symbol: 'X',
      joined: true
    },
    player2: {
      name: null,
      symbol: 'O',
      joined: false
    },
    board: [null, null, null, null, null, null, null, null, null],
    currentTurn: 'X',
    startingPlayer: 'X',
    status: 'waiting',
    winner: null
  });
  gameRef.on('value', (snapshot) => {
    const game = snapshot.val();
    if (game && game.player2.joined && game.status === 'waiting') {
      document.querySelector('.start-game-btn').disabled = false;
      document.querySelector('.start-game-btn').textContent = game.player2.name + ' joined! Start Game';
      document.querySelector('.waiting-message').textContent = game.player2.name + ' is ready!';
    }
  });
  show('waiting');
};
document.querySelector('.join-btn').onclick = () => {
  const enteredId = joinInput.value.trim().toUpperCase();
  if (!enteredId) {
    joinInput.style.borderColor = '#ff6b6b';
    setTimeout(() => joinInput.style.borderColor = '', 500);
    return;
  }
  playerName = nameInput.value.trim() || 'Player 2';
  gameId = enteredId;
  waitingId.textContent = gameId;
  gameRef = database.ref('games/' + gameId);
  gameRef.once('value', (snapshot) => {
    const game = snapshot.val();
    if (!game) {
      alert('Game not found! Please check the Game ID.');
      return;
    }
    if (game.player2.joined) {
      alert('This game is already full!');
      return;
    }
    playerRole = 'player2';
    playerSymbol = 'O';
    gameRef.update({
      'player2/name': playerName,
      'player2/joined': true
    });
    show('waiting');
    gameRef.on('value', (snapshot) => {
      const game = snapshot.val();
      if (game && game.status === 'playing' && !gameStarted) {
        gameStarted = true;
        console.log('Player 2: Game started!');
        startGame();
      }
    });
  });
};
document.querySelector('.copy-btn').onclick = () => {
  const id = gameIdInput.value || waitingId.textContent;
  if (id) {
    navigator.clipboard.writeText(id);
    const btn = document.querySelector('.copy-btn');
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = original, 1500);
  }
};
document.querySelector('.start-game-btn').onclick = () => {
  if (playerRole === 'player1') {
    console.log('Player 1: Starting game');
    gameRef.update({ status: 'playing' });
    gameStarted = true;
    startGame();
  }
};
const cells = document.querySelectorAll('.cell');
const playerNameDisplay = document.querySelector('.player-name');
const playerSymbolDisplay = document.querySelector('.player-symbol');
const turnIndicator = document.querySelector('.turn-indicator');
const turnHint = document.querySelector('.turn-hint');
function getSafeBoard(boardData) {
  if (!boardData) return Array(9).fill(null);
  if (Array.isArray(boardData)) {
    return Array.from({ length: 9 }, (_, i) => boardData[i] === undefined ? null : boardData[i]);
  }
  const arr = Array(9).fill(null);
  Object.keys(boardData).forEach(key => {
    arr[key] = boardData[key];
  });
  return arr;
}
function startGame() {
  console.log('startGame() called for', playerRole, playerSymbol);
  show('game');
  playerNameDisplay.textContent = playerName;
  playerSymbolDisplay.textContent = playerSymbol === 'X' ? '❤️' : '✖️';
  let lastBoard = Array(9).fill(null);

  gameRef.on('value', (snapshot) => {
    const game = snapshot.val();
    if (!game) return;
    const board = getSafeBoard(game.board);
    board.forEach((cell, i) => {
      if (cell && !lastBoard[i]) {
        if (cell === 'X') playSound('heart');
        else playSound('cross');
      }
    });
    lastBoard = [...board];
    console.log('Processed board:', board);
    console.log('Game update:', game);
    console.log('Current turn:', game.currentTurn, '| My symbol:', playerSymbol);
    cells.forEach((cell, index) => {
      const value = board[index];
      if (value === 'X') {
        cell.textContent = '❤️';
        cell.classList.add('placed');
      } else if (value === 'O') {
        cell.textContent = '✖️';
        cell.classList.add('placed');
      } else {
        cell.textContent = '';
        cell.classList.remove('placed');
      }
    });
    const isMyTurn = (game.currentTurn === playerSymbol);
    console.log('Is my turn?', isMyTurn);
    if (isMyTurn) {
      turnIndicator.textContent = '💗 YOUR TURN!';
      turnIndicator.style.color = '#c9184a';
      turnIndicator.style.fontSize = '24px';
      turnHint.textContent = 'Click any empty cell to make your move!';
      cells.forEach((cell, i) => {
        if (board[i] === null) {
          cell.style.cursor = 'pointer';
          cell.style.opacity = '1';
        }
      });
    } else {
      const partnerSymbol = playerSymbol === 'X' ? '✖️' : '❤️';
      turnIndicator.textContent = partnerSymbol + ' Partner\'s Turn';
      turnIndicator.style.color = '#999';
      turnIndicator.style.fontSize = '20px';
      turnHint.textContent = 'Please wait for your partner to play...';
      cells.forEach(cell => {
        cell.style.cursor = 'not-allowed';
        cell.style.opacity = '0.6';
      });
    }
    const hasGameData = board.some(cell => cell !== null);
    if (game.status === 'finished' && hasGameData) {
      showResult(game.winner);
    }
  });
  cells.forEach((cell, index) => {
    cell.onclick = () => makeMove(index);
  });
}
function makeMove(index) {
  gameRef.once('value', (snapshot) => {
    try {
      const game = snapshot.val();
      const currentBoard = getSafeBoard(game.board);
      if (game.status !== 'playing') {
        console.log('Game not playing');
        return;
      }
      if (game.currentTurn !== playerSymbol) {
        console.log('Not your turn!');
        return;
      }
      if (currentBoard[index] !== null) {
        console.log('Cell already taken');
        return;
      }
      console.log('Making move at index', index);
      const newBoard = [...currentBoard];
      newBoard[index] = playerSymbol;
      const winner = checkWinner(newBoard);
      const isDraw = newBoard.every(cell => cell !== null);
      if (winner) {
        console.log('Winner:', winner);
        gameRef.update({
          board: newBoard,
          status: 'finished',
          winner: winner
        });
      } else if (isDraw) {
        console.log('Draw!');
        gameRef.update({
          board: newBoard,
          status: 'finished',
          winner: 'draw'
        });
      } else {
        const nextTurn = playerSymbol === 'X' ? 'O' : 'X';
        console.log('Next turn:', nextTurn);
        gameRef.update({
          board: newBoard,
          currentTurn: nextTurn
        });
      }
    } catch (e) {
      console.error('Error making move:', e);
    }
  });
}
function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
const resultTitle = document.querySelector('.result-title');
const resultText = document.querySelector('.result-text');
function showResult(winner) {
  show('result');
  if (winner === 'draw') {
    playSound('draw');
    resultTitle.textContent = '🤍 It\'s a Draw! 🤍';
    resultText.textContent = 'No wishes today... Play again to decide who gets spoiled! 💕';
  } else if (winner === playerSymbol) {
    playSound('win');
    resultTitle.textContent = '🎉 You Won a Wish! 🎉';
    resultText.innerHTML = 'You get to ask for <b>ANYTHING</b>!<br>Your partner must fulfill your wish. Make it special! 💝';
  } else {
    playSound('lose');
    resultTitle.textContent = '💞 Partner Won a Wish 💞';
    resultText.innerHTML = 'Your partner gets a wish!<br>You must fulfill it! Be generous! ✨';
  }
}
document.querySelector('.play-again-btn').onclick = () => {
  console.log('Play Again clicked!');
  if (gameRef) {
    console.log('gameRef exists, removing listeners...');
    gameRef.off();

    gameRef.once('value', (snapshot) => {
      const game = snapshot.val();
      console.log('Current game state:', game);
      const lastStarter = game.startingPlayer || 'X';
      const nextStarter = lastStarter === 'X' ? 'O' : 'X';
      console.log('Resetting game, next starter:', nextStarter);

      gameRef.update({
        board: [null, null, null, null, null, null, null, null, null],
        currentTurn: nextStarter,
        startingPlayer: nextStarter,
        status: 'playing',
        winner: null
      }).then(() => {
        console.log('Game reset successful, restarting...');
        startGame();
      }).catch((error) => {
        console.error('Failed to reset game:', error);
        alert('Failed to restart game. Error: ' + error.message);
      });
    });
  } else {
    console.error('gameRef is null!');
    alert('No active game found. Please go home and start a new game.');
  }
};
document.querySelector('.home-btn').onclick = () => {
  if (gameRef) {
    gameRef.off();
    gameRef = null;
  }
  gameId = null;
  playerRole = null;
  playerSymbol = null;
  gameStarted = false;
  show('home');
};