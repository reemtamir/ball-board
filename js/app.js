var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;

function initGame() {
  gGamerPos = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  // Create the Matrix
  var board = createMat(10, 12);

  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // Put FLOOR in a regular cell
      var cell = { type: FLOOR, gameElement: null };

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
  let count = 0;

  // Place the Balls (currently randomly chosen positions)
  let randomI = [Math.floor(Math.random() * 8) + 1];
  let randomJ = [Math.floor(Math.random() * 10) + 1];
  board[randomI][randomJ].gameElement = BALL;
  // console.log(board);
  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });

      // if (currCell.type === FLOOR) cellClass += ' floor';
      // else if (currCell.type === WALL) cellClass += ' wall';
      cellClass += currCell.type === FLOOR ? ' floor' : ' wall';

      strHTML += `<td class="cell ${cellClass} 
				 onclick="moveTo(${i} , ${j}  )" >`;

      switch (currCell.gameElement) {
        case GAMER:
          strHTML += GAMER_IMG;
          break;
        case BALL:
          strHTML += BALL_IMG;
      }

      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
  }

  // console.log('strHTML is:');
  // console.log(strHTML);
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
let counter = 0;
// Move the player to a specific location
function moveTo(i, j) {
  let elDivCounter = document.querySelector('.counter');

  var targetCell = gBoard[i][j];

  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPos.i);
  var jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    if (targetCell.gameElement === BALL) {
      counter++;
      elDivCounter.innerHTML =
        counter === 1
          ? `${counter} BALL was collected!`
          : `${counter} BALLS were collected!`;
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
      gGamerPos.j = 1;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    } else if (gGamerPos.i === 5 && gGamerPos.j === 0) {
      gGamerPos.i = 5;
      gGamerPos.j = 10;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    }
    if (gGamerPos.i === 0 && gGamerPos.j === 6) {
      gGamerPos.i = 8;
      gGamerPos.j = 6;
      gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
      renderCell(gGamerPos, GAMER_IMG);
    } else if (gGamerPos.i === 9 && gGamerPos.j === 6) {
      gGamerPos.i = 1;
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
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
  var i = gGamerPos.i;
  var j = gGamerPos.j;

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
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}
