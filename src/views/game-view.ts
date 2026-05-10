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
 * Handles debug keyboard shortcuts for the "code" theme.
 * Allows manually triggering result screens for testing.
 */
document.addEventListener("keydown", (e) => {
  if (GAME_STATE.theme !== "code") return;
  if (e.key === "1") showResultScreenOverride("blue");
  if (e.key === "2") showResultScreenOverride("orange");
  if (e.key === "3") showResultScreenOverride("draw");
  if (e.key === "4") showResultScreenOverride("gameover");
});

/**
 * Handles debug keyboard shortcuts for the "gaming" theme.
 * Allows manually triggering result screens for testing.
 */
document.addEventListener("keydown", (e) => {
  if (GAME_STATE.theme !== "gaming") return;
  if (e.key === "5") showResultScreenOverride("blue");
  if (e.key === "6") showResultScreenOverride("orange");
  if (e.key === "7") showResultScreenOverride("draw");
  if (e.key === "8") showResultScreenOverride("gameover");
});

/**
 * Renders the game board by injecting the game template and exit dialog.
 * After rendering, initializes all game-related systems.
 */
export function renderGameBoard(): void {
  APP.innerHTML = getGameTemplate(GAME_STATE.theme) + getExitDialogTemplate();
  initGameBoard();
}

/**
 * Initializes all game systems:
 * - Exit dialog
 * - Grid layout
 * - Card generation
 * - Player HUD
 * - Game over callback
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
 * - Opens the dialog
 * - Closes the dialog
 * - Confirms exit and resets game state
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
 * Configures the grid layout based on the selected board size.
 * Uses a fixed mapping of card count → column count.
 */
function setupGrid(): void {
  const board = document.getElementById("game-board")!;
  const size = GAME_STATE.size;

  const columns = size === 16 ? 4 : size === 24 ? 6 : size === 36 ? 6 : 4;

  board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

/**
 * Creates and renders all card elements for the current game.
 */
function initializeCards() {
  const cards = createCardPairs();
  renderCards(cards);
}

/**
 * Generates an array of card pair IDs based on the board size.
 * Each number appears exactly twice.
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
 * Renders all card elements into the game board container.
 */
function renderCards(cards: number[]): void {
  const board = document.getElementById("game-board")!;
  cards.forEach((num) => board.appendChild(createCardElement(num)));
}

/**
 * Creates a single card element with the correct theme and click behavior.
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
 * Renders a result screen manually (used for debug shortcuts).
 */
export function showResultScreenOverride(
  screen: "blue" | "orange" | "draw" | "gameover",
) {
  const data = getWinnerScreenData(screen);
  renderWinnerScreen(data);
  if (data.showScoreboard) updateWinnerScoreboardIcons();
  attachWinnerBackButton();
}

/**
 * Shuffles an array using the Fisher–Yates algorithm.
 */
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Determines the winner, selects the correct result screen,
 * and renders the final result UI.
 */
function showResultScreen() {
  const winner = getWinner();
  const screen = getScreenType(winner);

  const data = getWinnerScreenData(screen);
  renderWinnerScreen(data);

  if (data.showScoreboard) updateWinnerScoreboardIcons();
  attachWinnerBackButton();
}

/**
 * Determines the winner based on the current score.
 */
function getWinner() {
  if (GAME_STATE.scoreBlue > GAME_STATE.scoreOrange) return "blue";
  if (GAME_STATE.scoreOrange > GAME_STATE.scoreBlue) return "orange";
  return "draw";
}

/**
 * Determines which result screen should be shown.
 * If the player loses, the "gameover" screen is used.
 */
function getScreenType(
  winner: "blue" | "orange" | "draw",
): "blue" | "orange" | "draw" | "gameover" {
  if (winner !== "draw" && winner !== GAME_STATE.selectedPlayer) {
    return "gameover";
  }
  return winner;
}
