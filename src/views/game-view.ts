import { APP } from "../app";
import { GAME_STATE } from "../state/state";

export function renderGameBoard(): void {
  APP.innerHTML = getGameTemplate();
  initGameBoard();
}

function getGameTemplate(): string {
  return `
    <section class="game game--${GAME_STATE.theme}">

      <div class="game__hud">
        <div class="game__score">
          <span class="player player--blue">Blue: 0</span>
          <span class="player player--orange">Orange: 4</span>
        </div>

        <div class="game__current">
          Current Player: <strong class="current-player">Blue</strong>
        </div>

        <button class="game__exit">Exit Game</button>
      </div>

      <div class="game__board" id="game-board"></div>

    </section>
  `;
}

function initGameBoard(): void {
  const board = document.getElementById("game-board")!;
  const size = GAME_STATE.size;
  const theme = GAME_STATE.theme;

  // Grid dynamisch setzen
  if (size === 16) board.style.gridTemplateColumns = "repeat(4, 1fr)";
  if (size === 24) board.style.gridTemplateColumns = "repeat(6, 1fr)";
  if (size === 36) board.style.gridTemplateColumns = "repeat(6, 1fr)";

  for (let i = 0; i < size; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
    <div class="card__inner">
      <div class="card__front">
        <img src="/cards/${theme}/back.png" alt="">
      </div>
      <div class="card__back">
        <img src="/cards/${theme}/${i + 1}.png" alt="">
      </div>
    </div>
  `;

    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });

    board.appendChild(card);
  }
}
