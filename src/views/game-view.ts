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
  <div id="score-blue" class="game__score player--blue">Blue: 0</div>
  <div id="score-orange" class="game__score player--orange">Orange: 0</div>
  <div id="current-player" class="current-player player--blue">Current: Blue</div>
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

  // EXIT GAME BUTTON
  const exitBtn = document.querySelector(".game__exit")!;
  exitBtn.addEventListener("click", () => {
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;

    import("./setting-view").then((module) => {
      module.renderSettings();
    });
  });

  // GRID SETUP
  if (size === 16) board.style.gridTemplateColumns = "repeat(4, 1fr)";
  if (size === 24) board.style.gridTemplateColumns = "repeat(6, 1fr)";
  if (size === 36) board.style.gridTemplateColumns = "repeat(6, 1fr)";

  // KARTEN GENERIEREN
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

  // HUD initialisieren
  updatePlayerHUD();
}

/* ---------------------------------------------------
   PLAYER SYSTEM
--------------------------------------------------- */

function updatePlayerHUD() {
  const currentPlayerEl = document.getElementById("current-player")!;
  const blueScoreEl = document.getElementById("score-blue")!;
  const orangeScoreEl = document.getElementById("score-orange")!;

  // Scores aktualisieren
  blueScoreEl.textContent = `Blue: ${GAME_STATE.scoreBlue}`;
  orangeScoreEl.textContent = `Orange: ${GAME_STATE.scoreOrange}`;

  // Current Player anzeigen
  currentPlayerEl.textContent = `Current: ${GAME_STATE.currentPlayer}`;

  // Styling je nach Player
  if (GAME_STATE.currentPlayer === "blue") {
    currentPlayerEl.classList.remove("player--orange");
    currentPlayerEl.classList.add("player--blue");
  } else {
    currentPlayerEl.classList.remove("player--blue");
    currentPlayerEl.classList.add("player--orange");
  }
}

// function switchPlayer() {
//   GAME_STATE.currentPlayer =
//     GAME_STATE.currentPlayer === "blue" ? "orange" : "blue";

//   updatePlayerHUD();
// }
