import { renderBoard, markCell } from "./ui.js";
import { Player } from "./player.js";

const userBoard = document.getElementById("user-board");
const cpuBoard = document.getElementById("cpu-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const CPU_DELAY = 600;

let player1;
let player2;
let playerTurn;
let gameOver;
let cpuTimer;

function shipsLeft(board) {
  return board.ships.filter((ship) => !ship.isSunk()).length;
}

function updateStatus(message) {
  status.textContent = `${message} | Your ships: ${shipsLeft(player1.gameboard)} | CPU ships: ${shipsLeft(player2.gameboard)}`;
}

function endGame(message) {
  gameOver = true;
  playerTurn = false;
  updateStatus(message);
}

function cpuAttack() {
  const board = player1.gameboard;
  let x;
  let y;
  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
  } while (board.attacked.has(`${x},${y}`));

  const hit = board.receiveAttack(x, y);
  markCell(userBoard, x, y, hit);

  if (board.allSunk()) {
    endGame("CPU wins!");
    return;
  }
  playerTurn = true;
  updateStatus("Your turn");
}

function newGame() {
  clearTimeout(cpuTimer);

  player1 = new Player("User", "human");
  player2 = new Player("CPU", "computer");
  player1.gameboard.placeShipsRandomly();
  player2.gameboard.placeShipsRandomly();

  renderBoard(userBoard, player1.gameboard, true);
  renderBoard(cpuBoard, player2.gameboard, false);

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
  markCell(cpuBoard, x, y, hit);

  if (player2.gameboard.allSunk()) {
    endGame("You win!");
    return;
  }

  playerTurn = false;
  updateStatus("CPU is thinking...");
  cpuTimer = setTimeout(cpuAttack, CPU_DELAY);
});

restartBtn.addEventListener("click", newGame);

newGame();
