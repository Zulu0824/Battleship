import { Gameboard } from "../src/modules/gameBoard.js";
import { Ship } from "../src/modules/ship.js";

describe("Gameboard", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  describe("placeShip", () => {
    test("returns a Ship with the given length", () => {
      const ship = board.placeShip(0, 0, 3);
      expect(ship).toBeInstanceOf(Ship);
      expect(ship.length).toBe(3);
    });

    test("places a ship horizontally by default", () => {
      const ship = board.placeShip(2, 4, 3);
      board.receiveAttack(2, 4);
      board.receiveAttack(3, 4);
      board.receiveAttack(4, 4);
      expect(ship.hits).toBe(3);
    });

    test("places a ship vertically when horizontal is false", () => {
      const ship = board.placeShip(5, 1, 3, false);
      board.receiveAttack(5, 1);
      board.receiveAttack(5, 2);
      board.receiveAttack(5, 3);
      expect(ship.hits).toBe(3);
    });

    test("allows a ship that ends exactly on the board edge", () => {
      expect(() => board.placeShip(7, 0, 3)).not.toThrow();
      expect(() => board.placeShip(0, 7, 3, false)).not.toThrow();
    });

    test("throws when a horizontal ship runs off the right edge", () => {
      expect(() => board.placeShip(8, 0, 3)).toThrow("Ship out of bounds!");
    });

    test("throws when a vertical ship runs off the bottom edge", () => {
      expect(() => board.placeShip(0, 8, 3, false)).toThrow(
        "Ship out of bounds!",
      );
    });

    test("throws for negative coordinates", () => {
      expect(() => board.placeShip(-1, 0, 2)).toThrow("Ship out of bounds!");
      expect(() => board.placeShip(0, -1, 2)).toThrow("Ship out of bounds!");
    });

    test("throws when overlapping an existing ship", () => {
      board.placeShip(0, 0, 3);
      expect(() => board.placeShip(2, 0, 3)).toThrow(
        "Cell is already occupied!",
      );
      expect(() => board.placeShip(1, 0, 2, false)).toThrow(
        "Cell is already occupied!",
      );
    });

    test("a failed placement leaves the board unchanged", () => {
      board.placeShip(0, 0, 3);
      expect(() => board.placeShip(2, 0, 3)).toThrow();
      expect(board.ships).toHaveLength(1);
      expect(board.receiveAttack(3, 0)).toBe(false);
    });

    test("tracks every placed ship", () => {
      board.placeShip(0, 0, 2);
      board.placeShip(0, 1, 3);
      expect(board.ships).toHaveLength(2);
    });
  });

  describe("receiveAttack", () => {
    test("returns true and hits the ship on a hit", () => {
      const ship = board.placeShip(0, 0, 3);
      expect(board.receiveAttack(1, 0)).toBe(true);
      expect(ship.hits).toBe(1);
    });

    test("returns false and records the coordinates on a miss", () => {
      board.placeShip(0, 0, 3);
      expect(board.receiveAttack(5, 5)).toBe(false);
      expect(board.missed).toEqual([[5, 5]]);
    });

    test("a repeated attack on a ship does not hit it twice", () => {
      const ship = board.placeShip(0, 0, 3);
      board.receiveAttack(0, 0);
      expect(board.receiveAttack(0, 0)).toBe(false);
      expect(ship.hits).toBe(1);
    });

    test("a repeated miss is not recorded twice", () => {
      board.receiveAttack(5, 5);
      board.receiveAttack(5, 5);
      expect(board.missed).toEqual([[5, 5]]);
    });

    test("hits do not appear in the missed list", () => {
      board.placeShip(0, 0, 2);
      board.receiveAttack(0, 0);
      expect(board.missed).toEqual([]);
    });

    test("attacking every cell of a ship sinks it", () => {
      const ship = board.placeShip(0, 0, 2);
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe("allSunk", () => {
    test("is false when no ships have been placed", () => {
      expect(board.allSunk()).toBe(false);
    });

    test("is false when no ship is sunk", () => {
      board.placeShip(0, 0, 2);
      expect(board.allSunk()).toBe(false);
    });

    test("is false when only some ships are sunk", () => {
      board.placeShip(0, 0, 1);
      board.placeShip(0, 1, 2);
      board.receiveAttack(0, 0);
      expect(board.allSunk()).toBe(false);
    });

    test("is true when every ship is sunk", () => {
      board.placeShip(0, 0, 1);
      board.placeShip(0, 1, 2);
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 1);
      board.receiveAttack(1, 1);
      expect(board.allSunk()).toBe(true);
    });
  });
});
