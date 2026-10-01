import { Gameboard } from "./gameBoard";

export class Player {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.Gameboard = new Gameboard();
  }
}
