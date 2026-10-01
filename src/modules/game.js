import { renderBoard } from "./ui";
import { Player } from "./player";
import { Gameboard } from "./gameBoard";

const player1 = new Player("User", "human");
const player2 = new Player("CPU", "computer");

player1.gameboard.placeShip(1, 2, 3, true);
player1.gameboard.placeShip(4, 5, 5, false);
player1.gameboard.placeShip(7, 2, 4, false);

player2.gameboard.placeShip(2, 1, 3, false);
player2.gameboard.placeShip(5, 4, 5, true);
player2.gameboard.placeShip(2, 7, 4, true);

const userBoard = document.getElementById("user-board");
const cpuBoard = document.getElementById("cpu-board");

renderBoard(userBoard, player1.gameboard, true);
renderBoard(cpuBoard, player2.gameboard, false);

userGrid.addEventListener("click", (e) => {
  e.target.disabled = true;
  const x = e.target.dataset.x;
  const y = e.target.dataset.y;
  e.target.classList.add("disabled-buttons");

  if (e.target.classList.contains("ship")) {
    e.target.classList.add("hit");
    e.target.textContent = "X";
  }
});
