var GRID_SIZE = 4;
var grid = [];
var isMerged = [...Array(GRID_SIZE)].map(() => Array(GRID_SIZE));
var score = 0;
var filledTiles = 0;

document.addEventListener("DOMContentLoaded", initializeGame);
window.addEventListener("resize", checkClientDevice);

/* 
    Onload Initialize Game
*/
async function initializeGame() {
  const check = checkClientDevice();
  if (!check) {
    makeGrid(GRID_SIZE, GRID_SIZE);
    document.addEventListener("keyup", handleKeyPress);
    document.querySelector(".newgame").addEventListener("click", newGame);
    animateCSS(document.querySelector(".instructions"), "jackInTheBox");
    await animateCSS(document.querySelector(".game"), "backInDown");
    populateCell();
    populateCell();
  }
}

/*
    Resize Event Handler
*/
function checkClientDevice() {
  let instructions = document.querySelector(".instructions");
  let game = document.querySelector(".game");
  let notsupported = document.querySelector(".notsupported");
  const check = mobileCheck();
  if (check) {
    instructions.style.setProperty("display", "none");
    game.style.setProperty("display", "none");
    notsupported.style.setProperty("display", "block");
  } else {
    instructions.style.setProperty("display", "block");
    game.style.setProperty("display", "block");
    notsupported.style.setProperty("display", "none");
  }
  return check;
}

/* 
    Construct the Grid
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
function moveUp(checkGameStatus = false) {
  clearMerge();
  let isChanged = false;

  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = 0; i < GRID_SIZE; i++) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = i - 1; k >= 0; k--) {
          if (!isMerged[k][j]) {
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
          if (checkGameStatus === false) {
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
  }
  return isChanged;
}

/* 
    Down Key Click Handler
*/
function moveDown(checkGameStatus = false) {
  clearMerge();
  let isChanged = false;

  for (let j = 0; j < GRID_SIZE; j++) {
    for (let i = GRID_SIZE - 1; i >= 0; i--) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = i + 1; k < GRID_SIZE; k++) {
          if (!isMerged[k][j]) {
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
          if (checkGameStatus === false) {
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
  }
  return isChanged;
}

/* 
    Left Key Click Handler
*/
function moveLeft(checkGameStatus = false) {
  clearMerge();
  let isChanged = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = j - 1; k >= 0; k--) {
          if (!isMerged[i][k]) {
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
          if (checkGameStatus === false) {
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
  }
  return isChanged;
}

/* 
    Right Key Click Handler
*/
function moveRight(checkGameStatus = false) {
  clearMerge();
  let isChanged = false;

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = GRID_SIZE - 1; j >= 0; j--) {
      if (grid[i][j].innerText !== "") {
        let mark = [i, j];
        for (let k = j + 1; k < GRID_SIZE; k++) {
          if (!isMerged[i][k]) {
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
          if (checkGameStatus === false) {
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
  }
  return isChanged;
}

function handleKeyPress(e) {
  let stateChanged;
  switch (e.keyCode) {
    case 37: //left
      stateChanged = moveLeft();
      break;

    case 38: //up
      stateChanged = moveUp();
      break;

    case 39: //right
      stateChanged = moveRight();
      break;

    case 40: //down
      stateChanged = moveDown();
      break;

    default:
      break;
  }
  if (stateChanged) populateCell();
  if (filledTiles === GRID_SIZE * GRID_SIZE) {
    if (
      !moveDown(true) &&
      !moveLeft(true) &&
      !moveRight(true) &&
      !moveUp(true)
    ) {
      document
        .querySelector(".gameover")
        .style.setProperty("visibility", "visible");
    }
  }
}

/* 
    Initializes New Game
*/
function newGame() {
  document.querySelector(".gameover").style.setProperty("visibility", "hidden");
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      populateTileAttributes(0, i, j);
    }
  }
  score = 0;
  filledTiles = 0;
  clearMerge();
  populateCell();
  populateCell();
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

/*
    Detect Mobile Devices
*/
function mobileCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
