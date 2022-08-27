let WALL = 'WALL';
let FLOOR = 'FLOOR';
let BALL = 'BALL';
let GAMER = 'GAMER';
let GLUE = 'GLUE';
let GAMER_IMG = '<img src="img/gamer.png" />';
let BALL_IMG = '<img src="img/ball.png" />';
let GLUE_IMG = '<img src="img/candy.png" />';

let elDivCounter = document.querySelector('.counter');

let gBoard;
let gGamerPos;
let boardInterval;
let ballsInterval;
let glueInterval;
let timer;
let counter = 0;
let isSticky = false;
let isOn = true;
let winScore = 5;
const collectSound = new Audio('sound/collect.mp3');
let elDivTimer = document.querySelector('.timer');
let seconds = 15;
let timerInterval;
let checkInterval;
function incrementSeconds() {
  seconds -= 1;

  if (seconds <= 0) {
    clearInterval(timerInterval);
  } else {
    elDivTimer.innerText = 'TIME REMAIN: ' + seconds;
  }
}

function initGame() {
  gGamerPos = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);
  boardInterval = setInterval(() => {
    renderBoard(gBoard);
  }, 1000);
}

function buildBoard() {
  // Create the Matrix
  let board = createMat(10, 12);

  // Put FLOOR everywhere and WALL at edges
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // Put FLOOR in a regular cell
      let cell = { type: FLOOR, gameElement: null };

      // Place Walls at edges
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL;
      }
      if (
        (i === 5 && j === 0) ||
        (i === 0 && j === 6) ||
        (i === 5 && j === 11) ||
        (i === board.length - 1 && j === 6)
      ) {
        cell.type = FLOOR;
      }
      // Add created cell to The game board
      board[i][j] = cell;
    }
  }

  // Place the gamer at selected position
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  // Place the Balls (currently randomly chosen positions)
  ballsInterval = setInterval(() => {
    let randomI = [Math.floor(Math.random() * 8) + 1];
    let randomJ = [Math.floor(Math.random() * 10) + 1];

    if (
      board[randomI][randomJ].gameElement !== GAMER ||
      board[randomI][randomJ].gameElement !== GLUE
    )
      board[randomI][randomJ].gameElement = BALL;
  }, 2500);

  // console.log(board);
  glueInterval = setInterval(() => {
    //FIX
    let randomI = [Math.floor(Math.random() * 8) + 1];
    let randomJ = [Math.floor(Math.random() * 10) + 1];

    if (
      board[randomI][randomJ].gameElement !== GAMER ||
      board[randomI][randomJ].gameElement !== BALL
    ) {
      board[randomI][randomJ].gameElement = GLUE;
      setTimeout(() => {
        board[randomI][randomJ].gameElement = FLOOR;
      }, 4000);
    }
  }, 5000);

  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  let strHTML = '';
  for (let i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (let j = 0; j < board[0].length; j++) {
      let currCell = board[i][j];

      let cellClass = getClassName({ i: i, j: j });

      cellClass += currCell.type === FLOOR ? ' floor' : ' wall';

      strHTML += `<td class="cell ${cellClass} 
				 onclick="moveTo(${i} , ${j}  )" >`;

      switch (currCell.gameElement) {
        case GAMER:
          strHTML += GAMER_IMG;
          break;
        case BALL:
          strHTML += BALL_IMG;
          break;
        case GLUE:
          strHTML += GLUE_IMG;
          break;
      }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  let elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
function resetGame() {
  isOn = true;
  isFirst = false;
  clearTimeout(timer);
  clearInterval(timerInterval);
  clearInterval(ballsInterval);
  clearInterval(boardInterval);
  counter = 0;
  elDivCounter.innerHTML = '';
  elDivTimer.innerText = '';
  elDivTimer.style.display = 'block';
  seconds = 15;
  initGame();
}

// Move the player to a specific location
function moveTo(i, j) {
  let targetCell = gBoard[i][j];
  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  let iAbsDiff = Math.abs(i - gGamerPos.i);
  let jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    if (targetCell.gameElement === GLUE) {
      isSticky = true;
      setTimeout(() => {
        isSticky = false;
      }, 3000);
    }
    if (targetCell.gameElement === BALL) {
      counter++;
      collectSound.play();
      collectSound.currentTime = 0;
      elDivCounter.innerHTML =
        counter === winScore - 1
          ? `${winScore - counter} ball to win`
          : `${winScore - counter} balls to win`;
    }

    // MOVING from current position
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // Dom:
    renderCell(gGamerPos, '');

    // MOVING to selected position
    // Model:
    gGamerPos.i = i;
    gGamerPos.j = j;

    if (gGamerPos.i === 5 && gGamerPos.j === 11) {
      gGamerPos.i = 5;
      gGamerPos.j = 0;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    } else if (gGamerPos.i === 5 && gGamerPos.j === 0) {
      gGamerPos.i = 5;
      gGamerPos.j = 10;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    }
    if (gGamerPos.i === 0 && gGamerPos.j === 6) {
      gGamerPos.i = 9;
      gGamerPos.j = 6;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    } else if (gGamerPos.i === 9 && gGamerPos.j === 6) {
      gGamerPos.i = 0;
      gGamerPos.j = 6;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    }

    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    // DOM:
    renderCell(gGamerPos, GAMER_IMG);
  } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  let cellSelector = '.' + getClassName(location);
  let elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

//FIX
function check(counter) {
  // console.log('checking');
  // console.log('counter', counter, 'win', winScore);
  if (counter === winScore) {
    // console.log('stop');
    clearInterval(checkInterval);
    clearTimeout(timer);
    clearInterval(boardInterval);
    clearInterval(ballsInterval);
    clearInterval(timerInterval);
    isOn = false;
    elDivTimer.style.display = 'none';
    elDivCounter.innerHTML = 'WIN 🏆';

    counter = 0;
    return isOn;
  }
}

function time() {
  if (counter <= winScore) {
    elDivCounter.innerHTML = 'GAME OVER ⌛';
    elDivTimer.style.display = 'none';

    clearInterval(checkInterval);
    clearInterval(timerInterval);
    clearInterval(boardInterval);
    clearInterval(ballsInterval);
    isOn = false;
  }
  return;
}

// Move the player by keyboard arrows
let isFirst = false;
function handleKey(event) {
  if (!isFirst) {
    timerInterval = setInterval(incrementSeconds, 1000);
    timer = setTimeout(() => {
      time();
    }, 15000);
    isFirst = true;
  }
  //FIX
  if (isSticky) return;
  if (!isOn) return;
  checkInterval = setInterval(() => {
    // console.log('running');
    check(counter);
    console.log();
  }, 1000);

  let i = gGamerPos.i;
  let j = gGamerPos.j;

  switch (event.key) {
    case 'ArrowLeft':
      moveTo(i, j - 1);
      break;
    case 'ArrowRight':
      moveTo(i, j + 1);
      break;
    case 'ArrowUp':
      moveTo(i - 1, j);
      break;
    case 'ArrowDown':
      moveTo(i + 1, j);
      break;
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  let cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}
