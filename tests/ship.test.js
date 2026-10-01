import { Ship } from "../src/modules/ship";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test("Ship has length = 3, 0 hits and isn't sunk", () => {
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  test("hit() increases hits by one each call", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test("isSunk() is false when hits are below length", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("isSunk() is true when hits equal length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("isSunk() is true when hits exceed length", () => {
    for (let i = 0; i < 5; i++) ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
  test("sunk property becomes true once the ship is sunk", () => {
    for (let i = 0; i < 3; i++) ship.hit();
    ship.isSunk();
    expect(ship.sunk).toBe(true);
  });
  test("a length-1 ship sinks after a single hit", () => {
    const small = new Ship(1);
    small.hit();
    expect(small.isSunk()).toBe(true);
  });
});
