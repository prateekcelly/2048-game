var GRID_SIZE = 4;
var grid = [];
var isMerged = [...Array(GRID_SIZE)].map(() => Array(GRID_SIZE));
var score = 0;
var filledTiles = 0;

document.addEventListener("DOMContentLoaded", initializeGame);

/* 
    Onload Initialize Game
*/
async function initializeGame() {
  makeGrid(GRID_SIZE, GRID_SIZE);
  document.addEventListener("keyup", handleKeyPress);
  document.querySelector(".newgame").addEventListener("click", newGame);
  animateCSS(document.querySelector(".instructions"), "jackInTheBox");
  await animateCSS(document.querySelector(".game"), "backInDown");
  populateCell();
  populateCell();
}

/* 
    Initialize Game
*/
function makeGrid(rows, cols) {
  document.documentElement.style.setProperty("--grid-size", rows);
  const gridElement = document.querySelector(".grid");

  for (let i = 0; i < rows; i++) {
    let gridRow = [];

    for (let j = 0; j < cols; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      gridRow.push(tile);
      gridElement.appendChild(tile);
    }
    grid.push(gridRow);
  }
}

/* 
    Create a Random Tile
*/
function populateCell() {
  if (filledTiles === GRID_SIZE * GRID_SIZE) return;

  const [row, col] = findEmptyCell();
  const val = Math.random() < 0.9 ? 2 : 4;
  filledTiles++;

  populateTileAttributes(val, row, col);
}

/* 
    Find Unused Cell in the Remaining Grid
*/
function findEmptyCell() {
  while (true) {
    let row = Math.floor(Math.random() * GRID_SIZE);
    let col = Math.floor(Math.random() * GRID_SIZE);

    if (grid[row][col].innerText === "") return [row, col];
  }
}

/* 
    Animate.css Helper Function
*/
const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, animationName);
      node.removeEventListener("animationend", handleAnimationEnd);

      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd);
  });

/* 
    Fill the supplied tile with the appropriate attributes
*/
function populateTileAttributes(val, row, col, ismerged = false) {
  if (val > 0) {
    if (ismerged) {
      let value = parseInt(val) * 2;
      updateScore(value);
      val = value.toString();
      grid[row][col].classList.remove("animate__animated", "animate__zoomIn");
      grid[row][col].offsetWidth;
      animateCSS(grid[row][col], "bounceIn");
    } else {
      grid[row][col].classList.remove("animate__animated", "animate__bounceIn");
      grid[row][col].offsetWidth;
      animateCSS(grid[row][col], "zoomIn");
    }
    let textColor;
    if (val <= 4) {
      textColor = getComputedStyle(document.documentElement).getPropertyValue(
        `--text-1`
      );
    } else {
      textColor = getComputedStyle(document.documentElement).getPropertyValue(
        `--text-2`
      );
    }
    grid[row][col].style.setProperty("color", textColor);
  }

  const backgroundColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue(`--tile-${val}`);

  if (val === 0) val = "";
  grid[row][col].innerText = val;
  grid[row][col].style.setProperty("background-color", backgroundColor);
}

/* 
    Clear the isMerged Array
*/
function clearMerge() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      isMerged[i][j] = false;
    }
  }
}

/* 
    Update Score along with reducing the count of filledTiles
*/
function updateScore(val) {
  filledTiles--;
  score += val;
  document.querySelector(".score").innerText = `SCORE: ${score}`;
}

/* 
    Up Key Click Handler
*/
function moveUp() {
  clearMerge();
  let isChanged = false;

  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = 0; i < GRID_SIZE; i++) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = i - 1; k >= 0; k--) {
          if (!isMerged[i][j]) {
            if (grid[k][j].innerText === "") {
              mark = [k, j];
            } else {
              if (grid[i][j].innerText === grid[k][j].innerText) {
                mark = [k, j];
                isMerged[k][j] = true;
              }
              break;
            }
          } else break;
        }
        if (JSON.stringify(mark) !== JSON.stringify([i, j])) {
          isChanged = true;
          const val = parseInt(grid[i][j].innerText);
          populateTileAttributes(0, i, j);
          populateTileAttributes(
            val,
            mark[0],
            mark[1],
            isMerged[mark[0]][mark[1]]
          );
        }
      }
    }
  }
  return isChanged;
}

/* 
    Down Key Click Handler
*/
function moveDown() {
  clearMerge();
  let isChanged = false;

  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = GRID_SIZE - 1; i >= 0; i--) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = i + 1; k < GRID_SIZE; k++) {
          if (!isMerged[i][j]) {
            if (grid[k][j].innerText === "") {
              mark = [k, j];
            } else {
              if (grid[i][j].innerText === grid[k][j].innerText) {
                mark = [k, j];
                isMerged[k][j] = true;
              }
              break;
            }
          } else break;
        }
        if (JSON.stringify(mark) !== JSON.stringify([i, j])) {
          isChanged = true;
          const val = parseInt(grid[i][j].innerText);
          populateTileAttributes(0, i, j);
          populateTileAttributes(
            val,
            mark[0],
            mark[1],
            isMerged[mark[0]][mark[1]]
          );
        }
      }
    }
  }
  return isChanged;
}

/* 
    Left Key Click Handler
*/
function moveLeft() {
  clearMerge();
  let isChanged = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = j - 1; k >= 0; k--) {
          if (!isMerged[i][j]) {
            if (grid[i][k].innerText === "") {
              mark = [i, k];
            } else {
              if (grid[i][j].innerText === grid[i][k].innerText) {
                mark = [i, k];
                isMerged[i][k] = true;
              }
              break;
            }
          } else break;
        }
        if (JSON.stringify(mark) !== JSON.stringify([i, j])) {
          isChanged = true;
          const val = parseInt(grid[i][j].innerText);
          populateTileAttributes(0, i, j);
          populateTileAttributes(
            val,
            mark[0],
            mark[1],
            isMerged[mark[0]][mark[1]]
          );
        }
      }
    }
  }
  return isChanged;
}

/* 
    Right Key Click Handler
*/
function moveRight() {
  clearMerge();
  let isChanged = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = GRID_SIZE - 1; j >= 0; j--) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = j + 1; k < GRID_SIZE; k++) {
          if (!isMerged[i][j]) {
            if (grid[i][k].innerText === "") {
              mark = [i, k];
            } else {
              if (grid[i][j].innerText === grid[i][k].innerText) {
                mark = [i, k];
                isMerged[i][k] = true;
              }
              break;
            }
          } else break;
        }
        if (JSON.stringify(mark) !== JSON.stringify([i, j])) {
          isChanged = true;
          const val = parseInt(grid[i][j].innerText);
          populateTileAttributes(0, i, j);
          populateTileAttributes(
            val,
            mark[0],
            mark[1],
            isMerged[mark[0]][mark[1]]
          );
        }
      }
    }
  }
  return isChanged;
}

function handleKeyPress(e) {
  let stateChanged;
  switch (e.keyCode) {
    case 37: //left
      stateChanged = moveLeft();
      if (stateChanged) populateCell();
      break;

    case 38: //up
      stateChanged = moveUp();
      if (stateChanged) populateCell();
      break;

    case 39: //right
      stateChanged = moveRight();
      if (stateChanged) populateCell();
      break;

    case 40: //down
      stateChanged = moveDown();
      if (stateChanged) populateCell();
      break;

    default:
      break;
  }
}

/* 
    Initializes New Game
*/
function newGame() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      populateTileAttributes(0, i, j);
    }
  }
  clearMerge();
  populateCell();
  populateCell();
  score = 0;
  filledTiles = 0;
  document.querySelector(".score").innerText = `SCORE: ${score}`;
}

/*
    Handle Animation for the New Game Button
*/
const newGameButton = document.querySelector(".newgame");
newGameButton.addEventListener("click", function (e) {
  this.classList.remove("animate-button");
  this.offsetWidth; // DOM Reflow for breaking the Animation
  this.classList.add("animate-button");
});
newGameButton.addEventListener("animationend", function (e) {
  this.classList.remove("animate-button");
});
