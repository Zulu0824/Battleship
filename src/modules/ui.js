export function renderBoard(container, board, showShips) {
  container.innerHTML = "";

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const key = `${x},${y}`;
      const btn = document.createElement("button");
      btn.classList.add("grid-buttons");
      btn.dataset.x = x;
      btn.dataset.y = y;

      if (showShips && board.grid.has(key)) {
        btn.classList.add("ship");
      }
      container.appendChild(btn);
    }
  }
}

export function markCell(container, x, y, hit) {
  const btn = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  btn.disabled = true;
  btn.classList.add(hit ? "hit" : "miss");
}
