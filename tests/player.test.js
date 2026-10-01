import { Player } from "../src/modules/player.js";
import { Gameboard } from "../src/modules/gameBoard.js";

describe("Player", () => {
  test("stores the given name and type", () => {
    const player = new Player("Harsha", "human");
    expect(player.name).toBe("Harsha");
    expect(player.type).toBe("human");
  });

  test("supports a computer player", () => {
    const computer = new Player("CPU", "computer");
    expect(computer.name).toBe("CPU");
    expect(computer.type).toBe("computer");
  });

  test("gets its own Gameboard", () => {
    const player = new Player("Harsha", "human");
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test("each player has a separate Gameboard", () => {
    const p1 = new Player("One", "human");
    const p2 = new Player("Two", "computer");
    expect(p1.gameboard).not.toBe(p2.gameboard);
  });

  test("a ship placed on one board does not appear on the other", () => {
    const p1 = new Player("One", "human");
    const p2 = new Player("Two", "computer");
    p1.gameboard.placeShip(0, 0, 3);
    expect(p1.gameboard.ships).toHaveLength(1);
    expect(p2.gameboard.ships).toHaveLength(0);
  });
});
