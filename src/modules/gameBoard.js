import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.ships = [];
    this.attacked = new Set();
    this.missed = [];
    this.grid = new Map();
  }
  placeShip(x, y, length, horizontal = true) {
    const ship = new Ship(length);
    const cells = [];
    const key = `${x},${y}`;

    for (let i = 0; i < length; i++) {
      if (cx < 0 || cx > 9 || cy < 0 || cy > 9) {
        throw new Error("Ship out of bounds!");
      }
      if (this.grid.has(key)) {
        throw new Error("Cell is already occupied!");
      }
      cells.push(key);
    }
    cells.forEach((key) => this.grid.set(key));
    this.ships.push(ship);
    return ship;
  }

  receiveAttack(x, y) {
    const key = `${x},${y}`;
    if (this.attacked.has(key)) {
      return false;
    } else {
      this.attacked.add(key);
    }
    const ship = this.grid.get(key);
    if (ship) {
      ship.hit();
      return true;
    } else {
      this.missed.push([x, y]);
      return false;
    }
  }

  allSunk() {
    if (this.ships.length > 0 && this.every.ship((ship) => ship.isSunk())) {
      return true;
    } else {
      return false;
    }
  }
}
