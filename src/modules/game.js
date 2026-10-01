import { renderBoard, renderLabels, markCell, toCoord } from "./ui.js";
import { Player } from "./player.js";
import { playShot } from "./sounds.js";

const gameoverDialog = document.getElementById("gameover-dialog");
const gameoverTitle = document.getElementById("gameover-title");
const gameoverText = document.getElementById("gameover-text");
const playAgainBtn = document.getElementById("play-again");
const viewBoardBtn = document.getElementById("view-board");
const userBoard = document.getElementById("user-board");
const cpuBoard = document.getElementById("cpu-board");
const score = document.getElementById("score");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const CPU_DELAY = 600;

let player1;
let player2;
let playerTurn;
let gameOver;
let cpuTimer;
let dialogTimer;
let targetQueue;

function shipsLeft(board) {
  return board.ships.filter((ship) => !ship.isSunk()).length;
}

function updateStatus(message) {
  score.textContent = `Your ships: ${shipsLeft(player1.gameboard)} | CPU ships: ${shipsLeft(player2.gameboard)}`;
  status.textContent = message;
}
function endGame(playerWon, message) {
  gameOver = true;
  playerTurn = false;
  updateStatus(message);

  dialogTimer = setTimeout(() => {
    gameoverTitle.textContent = playerWon ? "Victory!" : "Defeat";
    gameoverText.textContent = playerWon
      ? `You sank the enemy fleet with ${shipsLeft(player1.gameboard)} ship(s) left.`
      : `The CPU sank your fleet. Enemy ships left: ${shipsLeft(player2.gameboard)}.`;
    gameoverDialog.showModal();
  }, 800);
}

function queueNeighbors(x, y) {
  const neighbors = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || nx > 9 || ny < 0 || ny > 9) continue;
    if (player1.gameboard.attacked.has(`${nx},${ny}`)) continue;
    targetQueue.push([nx, ny]);
  }
}

function pickCpuTarget() {
  const board = player1.gameboard;

  while (targetQueue.length > 0) {
    const [x, y] = targetQueue.shift();
    if (!board.attacked.has(`${x},${y}`)) return [x, y];
  }

  let x;
  let y;
  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
  } while (board.attacked.has(`${x},${y}`));
  return [x, y];
}

function cpuAttack() {
  const board = player1.gameboard;
  const [x, y] = pickCpuTarget();

  const hit = board.receiveAttack(x, y);
  playShot(hit);
  markCell(userBoard, x, y, hit);

  if (board.allSunk()) {
    endGame(false, `CPU fired at ${toCoord(x, y)} and wins!`);
    return;
  }

  if (hit) {
    if (board.grid.get(`${x},${y}`).isSunk()) {
      targetQueue = [];
    } else {
      queueNeighbors(x, y);
    }
    updateStatus(`CPU hit ${toCoord(x, y)} and fires again...`);
    cpuTimer = setTimeout(cpuAttack, CPU_DELAY);
    return;
  }

  playerTurn = true;
  updateStatus(`CPU missed at ${toCoord(x, y)}. Your turn`);
}

function newGame() {
  clearTimeout(cpuTimer);

  player1 = new Player("User", "human");
  player2 = new Player("CPU", "computer");
  player1.gameboard.placeShipsRandomly();
  player2.gameboard.placeShipsRandomly();

  renderBoard(userBoard, player1.gameboard, true);
  renderBoard(cpuBoard, player2.gameboard, false);

  targetQueue = [];
  playerTurn = true;
  gameOver = false;
  updateStatus("Your turn");
}

cpuBoard.addEventListener("click", (e) => {
  if (!playerTurn || gameOver) return;

  const btn = e.target.closest(".grid-buttons");
  if (!btn) return;

  const x = Number(btn.dataset.x);
  const y = Number(btn.dataset.y);

  const hit = player2.gameboard.receiveAttack(x, y);
  playShot(hit);
  markCell(cpuBoard, x, y, hit);

  if (player2.gameboard.allSunk()) {
    endGame(true, `You fired at ${toCoord(x, y)} and win!`);
    return;
  }

  if (hit) {
    updateStatus(`Hit at ${toCoord(x, y)}! Fire again`);
    return;
  }

  playerTurn = false;
  updateStatus(`You missed at ${toCoord(x, y)}. CPU is thinking...`);
  cpuTimer = setTimeout(cpuAttack, CPU_DELAY);
});

restartBtn.addEventListener("click", newGame);
playAgainBtn.addEventListener("click", newGame);
viewBoardBtn.addEventListener("click", () => gameoverDialog.close());

renderLabels();
newGame();
