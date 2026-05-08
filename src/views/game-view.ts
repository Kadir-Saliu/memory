import { APP } from "../app";
import { GAME_STATE } from "../state/state";
const ICONS_GAMING = {
  blue: `<img src="/images/icons/blue-game-theme-icon.png" class="hud-icon"> `,
  orange: `<img src="/images/icons/orange-game-theme-icon.png" class="hud-icon">`,
  currentBlue: `<img src="./images/icons/white-game-theme-icon.png">`,
  currentOrange: `<img src="./images/icons/white-game-theme-icon.png">`,
  exit: `<img src="/images/tags/exit-icon-code.png" class="hud-icon">`,
};

const ICONS_CODE = {
  blue: `<img src="/images/tags/blue-tag-code.png" class="hud-icon">`,
  orange: `<img src="/images/tags/orange-tag-code.png" class="hud-icon">`,
  currentBlue: `<img src="/images/tags/blue-tag-code.png" class="hud-icon">`,
  currentOrange: `<img src="/images/tags/orange-tag-code.png" class="hud-icon">`,
  exit: `<img src="/images/tags/exit-icon-code.png" class="hud-icon">`,
};

export function renderGameBoard(): void {
  APP.innerHTML = getGameTemplate();
  initGameBoard();
}

function getGameTemplate(): string {
  return `
<section class="game game--${GAME_STATE.theme}">

  <div class="game__hud">

   <div class="hud__scores">
  <div id="score-blue" class="game__score player--blue">
    <span class="score-icon"></span>
    <span class="score-text"></span>
  </div>

  <div id="score-orange" class="game__score player--orange">
    <span class="score-icon"></span>
    <span class="score-text"></span>
  </div>
</div>

   <div id="current-player" class="current-player">
  <span class="current-text"></span>
  <span class="current-icon"></span>
</div>

    <button class="game__exit">
  <span class="exit-icon"></span>
  <span class="exit-text">Exit Game</span>
</button>

  </div>

  <div class="game__board" id="game-board"></div>

</section>

  `;
}

function initGameBoard(): void {
  document.addEventListener("keydown", (e) => {
    if (e.key === "1") showResultScreenOverride("blue");
    if (e.key === "2") showResultScreenOverride("orange");
    if (e.key === "3") showResultScreenOverride("draw");
    if (e.key === "4") showResultScreenOverride("gameover");
  });
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

  // -----------------------------------------
  // PAARE ERZEUGEN
  // -----------------------------------------
  const pairCount = size / 2;
  let cardsArray: number[] = [];

  for (let i = 1; i <= pairCount; i++) {
    cardsArray.push(i);
    cardsArray.push(i);
  }

  // SHUFFLE
  cardsArray = shuffle(cardsArray);

  // -----------------------------------------
  // KARTEN RENDERN
  // -----------------------------------------
  cardsArray.forEach((num) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card__inner">
        <div class="card__front">
          <img src="/cards/${theme}/back.png" alt="">
        </div>
        <div class="card__back">
          <img src="/cards/${theme}/${num}.png" alt="">
        </div>
      </div>
    `;

    card.addEventListener("click", () => handleCardClick(card));

    board.appendChild(card);
  });

  // HUD initialisieren
  updatePlayerHUD();
}

function showResultScreenOverride(
  screen: "blue" | "orange" | "draw" | "gameover",
) {
  // exakt dieselbe Struktur wie showResultScreen()
  // nur ohne die Gewinnerlogik
  APP.innerHTML = `
    <section class="winner-screen">

      ${
        screen === "blue" || screen === "orange"
          ? `<img class="confetti" src="/images/confetti.png" alt="confetti">`
          : ""
      }

      <h2 class="winner-title ${screen}">
        ${
          screen === "blue"
            ? "The winner is BLUE PLAYER"
            : screen === "orange"
              ? "The winner is ORANGE PLAYER"
              : screen === "draw"
                ? "It's a<br>DRAW"
                : "Game Over"
        }
      </h2>

      ${
        screen === "blue"
          ? `<img class="winner-icon" src="/images/player-blue.png">`
          : screen === "orange"
            ? `<img class="winner-icon" src="/images/player-orange.png">`
            : screen === "draw"
              ? `<img class="winner-icon" src="/images/draw-icon.png">`
              : ""
      }

      <div class="winner-buttons">
        <button id="back">Back to start</button>
      </div>

    </section>
  `;

  document.getElementById("back")!.addEventListener("click", () => {
    import("./setting-view").then((module) => module.renderSettings());
  });
}

/* ---------------------------------------------------
   SHUFFLE
--------------------------------------------------- */

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ---------------------------------------------------
   MATCHING SYSTEM
--------------------------------------------------- */

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard = false;

function handleCardClick(card: HTMLElement) {
  if (lockBoard) return;
  if (card === firstCard) return;

  card.classList.add("is-flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const img1 = firstCard!.querySelector(".card__back img") as HTMLImageElement;
  const img2 = secondCard!.querySelector(".card__back img") as HTMLImageElement;

  const match = img1.src === img2.src;

  if (match) {
    disableMatchedCards();
    updateScore();
    checkGameOver();
    resetTurn();
  } else {
    unflipCards();
    switchPlayer();
  }
}

function disableMatchedCards() {
  firstCard!.style.pointerEvents = "none";
  secondCard!.style.pointerEvents = "none";
}

function unflipCards() {
  setTimeout(() => {
    firstCard!.classList.remove("is-flipped");
    secondCard!.classList.remove("is-flipped");
    resetTurn();
  }, 1000);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateScore() {
  if (GAME_STATE.currentPlayer === "blue") {
    GAME_STATE.scoreBlue++;
  } else {
    GAME_STATE.scoreOrange++;
  }

  updatePlayerHUD();
}

function checkGameOver() {
  const totalPairs = GAME_STATE.size / 2;
  const foundPairs = GAME_STATE.scoreBlue + GAME_STATE.scoreOrange;

  if (foundPairs === totalPairs) {
    showResultScreen();
  }
}

/* ---------------------------------------------------
   RESULT SCREEN (WINNER / GAME OVER / DRAW)
--------------------------------------------------- */

function showResultScreen() {
  let winner: "blue" | "orange" | "draw" = "draw";

  if (GAME_STATE.scoreBlue > GAME_STATE.scoreOrange) {
    winner = "blue";
  } else if (GAME_STATE.scoreOrange > GAME_STATE.scoreBlue) {
    winner = "orange";
  }

  // Spielerzentrierte Logik
  let screen: "blue" | "orange" | "draw" | "gameover" = winner;

  if (winner !== "draw" && winner !== GAME_STATE.selectedPlayer) {
    screen = "gameover";
  }

  APP.innerHTML = `
    <section class="winner-screen">

      <!-- Konfetti nur bei Blue/Orange -->
      ${
        screen === "blue" || screen === "orange"
          ? `<img class="confetti" src="/images/confetti.png" alt="confetti">`
          : ""
      }

      <!-- Titel -->
      <h2 class="winner-title ${screen}">
        ${
          screen === "blue"
            ? "The winner is BLUE PLAYER"
            : screen === "orange"
              ? "The winner is ORANGE PLAYER"
              : screen === "draw"
                ? "It's a<br>DRAW"
                : "Game Over"
        }
      </h2>

      <!-- Icons -->
      ${
        screen === "blue"
          ? `<img class="winner-icon" src="/images/player-blue.png" alt="">`
          : screen === "orange"
            ? `<img class="winner-icon" src="/images/player-orange.png" alt="">`
            : screen === "draw"
              ? `<img class="winner-icon" src="/images/draw-icon.png" alt="">`
              : ""
      }

      <!-- Buttons -->
      <div class="winner-buttons">
        <button id="back">Back to start</button>
      </div>

    </section>
  `;

  // Back Button
  document.getElementById("back")!.addEventListener("click", () => {
    // Punkte zurücksetzen
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;

    import("./setting-view").then((module) => module.renderSettings());
  });
}

/* ---------------------------------------------------
   PLAYER SYSTEM
--------------------------------------------------- */

function updatePlayerHUD() {
  const theme = GAME_STATE.theme; // "code" oder "gaming"
  const current = GAME_STATE.currentPlayer; // "blue" oder "orange"

  // Icon-Sets je nach Theme
  const ICONS = theme === "gaming" ? ICONS_GAMING : ICONS_CODE;

  // --- BLUE SCORE ---
  const blueScoreEl = document.querySelector("#score-blue")!;
  blueScoreEl.querySelector(".score-icon")!.innerHTML = ICONS.blue;
  blueScoreEl.querySelector(".score-text")!.textContent =
    theme === "gaming"
      ? `${GAME_STATE.scoreBlue}` // Gaming Theme → nur Zahl
      : `Blue ${GAME_STATE.scoreBlue}`; // Code Theme → Blue 0

  // --- ORANGE SCORE ---
  const orangeScoreEl = document.querySelector("#score-orange")!;
  orangeScoreEl.querySelector(".score-icon")!.innerHTML = ICONS.orange;
  orangeScoreEl.querySelector(".score-text")!.textContent =
    theme === "gaming"
      ? `${GAME_STATE.scoreOrange}` // Gaming Theme → nur Zahl
      : `Orange ${GAME_STATE.scoreOrange}`; // Code Theme → Orange 0

  // --- CURRENT PLAYER ---
  const currentPlayerEl = document.querySelector("#current-player")!;

  currentPlayerEl.querySelector(".current-text")!.textContent =
    "Current Player:";

  currentPlayerEl.querySelector(".current-icon")!.innerHTML =
    current === "blue" ? ICONS.currentBlue : ICONS.currentOrange;

  currentPlayerEl.classList.remove("player--blue", "player--orange");
  currentPlayerEl.classList.add(
    current === "blue" ? "player--blue" : "player--orange",
  );

  // --- EXIT BUTTON ---
  const exitBtn = document.querySelector(".game__exit")!;
  exitBtn.querySelector(".exit-icon")!.innerHTML = ICONS.exit;
}

function switchPlayer() {
  GAME_STATE.currentPlayer =
    GAME_STATE.currentPlayer === "blue" ? "orange" : "blue";

  updatePlayerHUD();
}
