import { APP } from "../app";
import { GAME_STATE } from "../state/state";
import { getGameTemplate } from "../templates/game-template";
import { getExitDialogTemplate } from "../templates/exit-dialog-template";
import { getCardTemplate } from "../templates/card-template";

import { updatePlayerHUD } from "../components/hud";

import {
  getWinnerScreenData,
  renderWinnerScreen,
  updateWinnerScoreboardIcons,
  attachWinnerBackButton,
} from "../components/winner";

import { handleCardClick, setGameOverCallback } from "../components/card-logic";

/**
 * Registers debug keyboard shortcuts for the "code" theme.
 * Allows manually triggering result screens for testing.
 *
 * Keys:
 * - 1 → Blue wins
 * - 2 → Orange wins
 * - 3 → Draw
 * - 4 → Game over
 */
document.addEventListener("keydown", (e) => {
  if (GAME_STATE.theme !== "code") return;
  if (e.key === "1") showResultScreenOverride("blue");
  if (e.key === "2") showResultScreenOverride("orange");
  if (e.key === "3") showResultScreenOverride("draw");
  if (e.key === "4") showResultScreenOverride("gameover");
});

/**
 * Registers debug keyboard shortcuts for the "gaming" theme.
 *
 * Keys:
 * - 5 → Blue wins
 * - 6 → Orange wins
 * - 7 → Draw
 * - 8 → Game over
 */
document.addEventListener("keydown", (e) => {
  if (GAME_STATE.theme !== "gaming") return;
  if (e.key === "5") showResultScreenOverride("blue");
  if (e.key === "6") showResultScreenOverride("orange");
  if (e.key === "7") showResultScreenOverride("draw");
  if (e.key === "8") showResultScreenOverride("gameover");
});

/**
 * Renders the full game board including HUD, grid and exit dialog.
 * After rendering, initializes all game systems.
 *
 * @returns void
 */
export function renderGameBoard(): void {
  APP.innerHTML = getGameTemplate(GAME_STATE.theme) + getExitDialogTemplate();
  initGameBoard();
}

/**
 * Initializes all systems required for the game:
 * - Exit dialog
 * - Grid layout
 * - Card creation
 * - HUD update
 * - Game-over callback
 *
 * @returns void
 */
function initGameBoard(): void {
  setupExitDialog();
  setupGrid();
  initializeCards();
  updatePlayerHUD();
  setGameOverCallback(() => showResultScreen());
}

/**
 * Sets up the exit dialog behavior:
 * - Opens on exit button click
 * - Closes on cancel
 * - Confirms exit and resets game state
 *
 * @returns void
 */
function setupExitDialog(): void {
  const overlay = document.querySelector(".exit-dialog-overlay")!;
  const exitBtn = document.querySelector(".game__exit")!;
  const cancelBtn = document.querySelector(".exit-dialog__cancel")!;
  const confirmBtn = document.querySelector(".exit-dialog__confirm")!;

  exitBtn.addEventListener("click", () => overlay.classList.remove("hidden"));
  cancelBtn.addEventListener("click", () => overlay.classList.add("hidden"));

  confirmBtn.addEventListener("click", () => {
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;
    import("./setting-view").then((m) => m.renderSettings());
    overlay.classList.add("hidden");
  });
}

/**
 * Configures the grid layout based on board size.
 *
 * @returns void
 */
function setupGrid(): void {
  const board = document.getElementById("game-board")!;
  const size = GAME_STATE.size;

  const columns = size === 16 ? 4 : size === 24 ? 6 : size === 36 ? 6 : 4;

  board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

/**
 * Generates all card pairs and renders them.
 *
 * @returns void
 */
function initializeCards(): void {
  const cards = createCardPairs();
  renderCards(cards);
}

/**
 * Creates an array of card IDs.
 * Each ID appears twice to form matching pairs.
 *
 * @returns number[] - Shuffled card IDs.
 */
function createCardPairs(): number[] {
  const size = GAME_STATE.size;
  const pairCount = size / 2;
  const cards: number[] = [];

  for (let i = 1; i <= pairCount; i++) {
    cards.push(i, i);
  }

  return shuffle(cards);
}

/**
 * Renders all card elements into the game board.
 *
 * @param cards - Array of card IDs.
 * @returns void
 */
function renderCards(cards: number[]): void {
  const board = document.getElementById("game-board")!;
  cards.forEach((num) => board.appendChild(createCardElement(num)));
}

/**
 * Creates a single card element using the active theme.
 *
 * @param num - Card ID.
 * @returns HTMLElement - The card element.
 */
function createCardElement(num: number): HTMLElement {
  const theme = GAME_STATE.theme;
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = getCardTemplate(theme, num);
  card.addEventListener("click", () => handleCardClick(card));
  return card;
}

/**
 * Forces a specific result screen to appear.
 * Used for debug shortcuts.
 *
 * @param screen - "blue" | "orange" | "draw" | "gameover"
 * @returns void
 */
export function showResultScreenOverride(
  screen: "blue" | "orange" | "draw" | "gameover",
): void {
  const data = getWinnerScreenData(screen);
  renderWinnerScreen(data);
  if (data.showScoreboard) updateWinnerScoreboardIcons();
  attachWinnerBackButton();
}

/**
 * Shuffles an array using Fisher–Yates algorithm.
 *
 * @param array - Array to shuffle.
 * @returns any[] - Shuffled array.
 */
function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Shows the Game Over screen first, then transitions
 * to the actual winner screen after 1 second.
 *
 * @param winner - "blue" or "orange"
 * @returns void
 */
function showGameOverThenWinner(winner: "blue" | "orange") {
  const gameOverData = getWinnerScreenData("gameover");
  renderWinnerScreen(gameOverData);

  updateWinnerScoreboardIcons();

  setTimeout(() => {
    const winnerData = getWinnerScreenData(winner);
    renderWinnerScreen(winnerData);

    document.querySelector(".winner-screen")?.classList.add("winner-slide-in");

    attachWinnerBackButton();
  }, 1500);
}

/**
 * Determines which result screen to show.
 * Handles Game Over → Winner transition.
 *
 * @returns void
 */
function showResultScreen(): void {
  const winner = getWinner();

  // Draw → direkt Draw-Screen
  if (winner === "draw") {
    const data = getWinnerScreenData("draw");
    renderWinnerScreen(data);
    attachWinnerBackButton();
    return;
  }

  // Gewinn oder Verlust → immer Game Over → Winner
  showGameOverThenWinner(winner);
}

/**
 * Determines the winner based on scores.
 *
 * @returns "blue" | "orange" | "draw"
 */
function getWinner(): "blue" | "orange" | "draw" {
  if (GAME_STATE.scoreBlue > GAME_STATE.scoreOrange) return "blue";
  if (GAME_STATE.scoreOrange > GAME_STATE.scoreBlue) return "orange";
  return "draw";
}
