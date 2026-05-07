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

function showResultScreenOverride(screen: "blue" | "orange" | "draw" | "gameover") {
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
  const currentPlayerEl = document.getElementById("current-player")!;
  const blueScoreEl = document.getElementById("score-blue")!;
  const orangeScoreEl = document.getElementById("score-orange")!;

  blueScoreEl.textContent = `Blue: ${GAME_STATE.scoreBlue}`;
  orangeScoreEl.textContent = `Orange: ${GAME_STATE.scoreOrange}`;

  currentPlayerEl.textContent = `Current: ${GAME_STATE.currentPlayer}`;

  if (GAME_STATE.currentPlayer === "blue") {
    currentPlayerEl.classList.remove("player--orange");
    currentPlayerEl.classList.add("player--blue");
  } else {
    currentPlayerEl.classList.remove("player--blue");
    currentPlayerEl.classList.add("player--orange");
  }
}

function switchPlayer() {
  GAME_STATE.currentPlayer =
    GAME_STATE.currentPlayer === "blue" ? "orange" : "blue";

  updatePlayerHUD();
}
