import { Gameboard } from "./gameBoard.js";

export class Player {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
  }
}
