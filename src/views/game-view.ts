import { APP } from "../app";
import { GAME_STATE } from "../state/state";

export function renderGameBoard(): void {
  APP.innerHTML = getGameTemplate();
  initGameBoard();
}

function getGameTemplate(): string {
  return `
    <section class="game">
      <h2 class="game__title">Memory Game</h2>

      <div class="game__board" id="game-board">
        <!-- Karten werden dynamisch generiert -->
      </div>
    </section>
  `;
}

function initGameBoard(): void {
  const board = document.getElementById("game-board")!;
  const size = GAME_STATE.size;

  // Grid dynamisch setzen
  if (size === 16) board.style.gridTemplateColumns = "repeat(4, 1fr)";
  if (size === 24) board.style.gridTemplateColumns = "repeat(6, 1fr)";
  if (size === 36) board.style.gridTemplateColumns = "repeat(6, 1fr)";

  // Platzhalter-Karten generieren
  for (let i = 0; i < size; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = `${i + 1}`;
    board.appendChild(card);
  }
}
