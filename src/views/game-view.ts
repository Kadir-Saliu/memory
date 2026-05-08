import { APP } from "../app";
import { GAME_STATE } from "../state/state";

document.addEventListener("keydown", (e) => {
  if (GAME_STATE.theme !== "code") return;

  if (e.key === "1") showResultScreenOverride("blue");
  if (e.key === "2") showResultScreenOverride("orange");
  if (e.key === "3") showResultScreenOverride("draw");
  if (e.key === "4") showResultScreenOverride("gameover");
  console.log("KEYDOWN:", e.key, "THEME:", GAME_STATE.theme);
});

// ===============================
// DEBUG HOTKEYS – GAMING THEME (5–8)
// ===============================
document.addEventListener("keydown", (e) => {
  if (GAME_STATE.theme !== "gaming") return;

  if (e.key === "5") showResultScreenOverride("blue");
  if (e.key === "6") showResultScreenOverride("orange");
  if (e.key === "7") showResultScreenOverride("draw");
  if (e.key === "8") showResultScreenOverride("gameover");

  console.log("KEYDOWN:", e.key, "THEME:", GAME_STATE.theme);
});

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
  const board = document.getElementById("game-board")!;
  const size = GAME_STATE.size;
  const theme = GAME_STATE.theme;

  const exitBtn = document.querySelector(".game__exit")!;
  exitBtn.addEventListener("click", () => {
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;

    import("./setting-view").then((module) => {
      module.renderSettings();
    });
  });

  if (size === 16) board.style.gridTemplateColumns = "repeat(4, 1fr)";
  if (size === 24) board.style.gridTemplateColumns = "repeat(6, 1fr)";
  if (size === 36) board.style.gridTemplateColumns = "repeat(6, 1fr)";

  const pairCount = size / 2;
  let cardsArray: number[] = [];

  for (let i = 1; i <= pairCount; i++) {
    cardsArray.push(i);
    cardsArray.push(i);
  }

  cardsArray = shuffle(cardsArray);

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

  updatePlayerHUD();
}

function showResultScreenOverride(
  screen: "blue" | "orange" | "draw" | "gameover",
) {
  const theme = GAME_STATE.theme;

  const ICONS =
    theme === "gaming"
      ? {
          blue: `/images/icons/blue-game-theme-icon.png`,
          orange: `/images/icons/orange-game-theme-icon.png`,
          draw: `/images/icons/draw-game-theme.png`,
        }
      : {
          blue: `/images/player-blue.png`,
          orange: `/images/player-orange.png`,
          draw: `/images/draw-icon.png`,
        };

  const confetti =
    (screen === "blue" || screen === "orange") && theme === "code"
      ? `<img class="confetti" src="/images/confetti.png" alt="confetti">`
      : "";

  const icon =
    screen === "blue"
      ? `<img class="winner-icon" src="${ICONS.blue}">`
      : screen === "orange"
        ? `<img class="winner-icon" src="${ICONS.orange}">`
        : screen === "draw"
          ? `<img class="winner-icon" src="${ICONS.draw}">`
          : "";

  APP.innerHTML = `
   <section class="winner-screen winner-screen--${theme}">

    ${confetti}

    ${
      screen === "blue" || screen === "orange"
        ? `<p class="winner-prefix">The winner is</p>`
        : screen === "draw"
          ? `<p class="winner-prefix">It's a</p>`
          : ""
    }

    <h2 class="winner-title ${screen}">
      ${
        screen === "blue"
          ? "BLUE PLAYER"
          : screen === "orange"
            ? "ORANGE PLAYER"
            : screen === "draw"
              ? "DRAW"
              : "Game Over"
      }
    </h2>

  ${
    screen === "gameover"
      ? `
      <p class="final-score">Final Score</p>

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
    `
      : icon
  }

    <div class="winner-buttons">
      <button id="back">Back to start</button>
    </div>

  </section>
`;

  if (screen === "gameover") {
    const blueScoreText = document.querySelector("#score-blue .score-text");
    if (blueScoreText)
      blueScoreText.textContent = GAME_STATE.scoreBlue.toString();

    const orangeScoreText = document.querySelector("#score-orange .score-text");
    if (orangeScoreText)
      orangeScoreText.textContent = GAME_STATE.scoreOrange.toString();

    const blueIcon = document.querySelector(
      "#score-blue .score-icon",
    ) as HTMLElement;
    const orangeIcon = document.querySelector(
      "#score-orange .score-icon",
    ) as HTMLElement;

    if (blueIcon) blueIcon.style.backgroundImage = `url('${ICONS.blue}')`;
    if (orangeIcon) orangeIcon.style.backgroundImage = `url('${ICONS.orange}')`;
  }

  document.getElementById("back")!.addEventListener("click", () => {
    import("./setting-view").then((module) => module.renderSettings());
  });
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

function showResultScreen() {
  const theme = GAME_STATE.theme;

  let winner: "blue" | "orange" | "draw" = "draw";

  if (GAME_STATE.scoreBlue > GAME_STATE.scoreOrange) {
    winner = "blue";
  } else if (GAME_STATE.scoreOrange > GAME_STATE.scoreBlue) {
    winner = "orange";
  }

  let screen: "blue" | "orange" | "draw" | "gameover" = winner;

  if (winner !== "draw" && winner !== GAME_STATE.selectedPlayer) {
    screen = "gameover";
  }

  const ICONS =
    theme === "gaming"
      ? {
          blue: `/images/icons/blue-game-theme-icon.png`,
          orange: `/images/icons/orange-game-theme-icon.png`,
          draw: `/images/icons/draw-game-theme.png`,
        }
      : {
          blue: `/images/player-blue.png`,
          orange: `/images/player-orange.png`,
          draw: `/images/draw-icon.png`,
        };

  const confetti =
    (screen === "blue" || screen === "orange") && theme === "code"
      ? `<img class="confetti" src="/images/confetti.png" alt="confetti">`
      : "";

  const icon =
    screen === "blue"
      ? `<img class="winner-icon" src="${ICONS.blue}">`
      : screen === "orange"
        ? `<img class="winner-icon" src="${ICONS.orange}">`
        : screen === "draw"
          ? `<img class="winner-icon" src="${ICONS.draw}">`
          : "";

  APP.innerHTML = `
    <section class="winner-screen winner-screen--${theme}">

      ${confetti}

      ${
        screen === "blue" || screen === "orange"
          ? `<p class="winner-prefix">The winner is</p>`
          : screen === "draw"
            ? `<p class="winner-prefix">It's a</p>`
            : ""
      }

      <h2 class="winner-title ${screen}">
        ${
          screen === "blue"
            ? "BLUE PLAYER"
            : screen === "orange"
              ? "ORANGE PLAYER"
              : screen === "draw"
                ? "DRAW"
                : "Game Over"
        }
      </h2>

      ${icon}

      <div class="winner-buttons">
        <button id="back">Back to start</button>
      </div>

    </section>
  `;

  document.getElementById("back")!.addEventListener("click", () => {
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;

    import("./setting-view").then((module) => module.renderSettings());
  });
}

function updatePlayerHUD() {
  const theme = GAME_STATE.theme;
  const current = GAME_STATE.currentPlayer;

  const ICONS = theme === "gaming" ? ICONS_GAMING : ICONS_CODE;

  const blueScoreEl = document.querySelector("#score-blue")!;
  blueScoreEl.querySelector(".score-icon")!.innerHTML = ICONS.blue;
  blueScoreEl.querySelector(".score-text")!.textContent =
    theme === "gaming"
      ? `${GAME_STATE.scoreBlue}`
      : `Blue ${GAME_STATE.scoreBlue}`;

  const orangeScoreEl = document.querySelector("#score-orange")!;
  orangeScoreEl.querySelector(".score-icon")!.innerHTML = ICONS.orange;
  orangeScoreEl.querySelector(".score-text")!.textContent =
    theme === "gaming"
      ? `${GAME_STATE.scoreOrange}`
      : `Orange ${GAME_STATE.scoreOrange}`;

  const currentPlayerEl = document.querySelector("#current-player")!;

  currentPlayerEl.querySelector(".current-text")!.textContent =
    "Current Player:";

  currentPlayerEl.querySelector(".current-icon")!.innerHTML =
    current === "blue" ? ICONS.currentBlue : ICONS.currentOrange;

  currentPlayerEl.classList.remove("player--blue", "player--orange");
  currentPlayerEl.classList.add(
    current === "blue" ? "player--blue" : "player--orange",
  );

  const exitBtn = document.querySelector(".game__exit")!;
  exitBtn.querySelector(".exit-icon")!.innerHTML = ICONS.exit;
}

function switchPlayer() {
  GAME_STATE.currentPlayer =
    GAME_STATE.currentPlayer === "blue" ? "orange" : "blue";

  updatePlayerHUD();
}
