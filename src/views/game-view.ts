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
 * Renders the game screen by injecting:
 * - The game layout (HUD + board)
 * - The exit dialog
 *
 * After rendering, all game systems are initialized.
 *
 * @returns void
 */
export function renderGameBoard(): void {
  APP.innerHTML = getGameTemplate(GAME_STATE.theme) + getExitDialogTemplate();
  initGameBoard();
}

/**
 * Initializes all systems required for the game:
 * - Exit dialog behavior
 * - Grid layout
 * - Card creation and rendering
 * - Player HUD
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
 * Sets up the exit dialog functionality.
 *
 * Behavior:
 * - Opens the dialog when clicking the exit button
 * - Closes the dialog when clicking cancel
 * - Confirms exit, resets game state, and navigates to settings
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
 * Configures the grid layout of the game board.
 *
 * Column count is based on board size:
 * - 16 cards → 4 columns
 * - 24 cards → 6 columns
 * - 36 cards → 6 columns
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
 * Generates all card pairs and renders them into the board.
 *
 * @returns void
 */
function initializeCards(): void {
  const cards = createCardPairs();
  renderCards(cards);
}

/**
 * Creates an array of card IDs based on the board size.
 * Each ID appears exactly twice to form matching pairs.
 *
 * @returns A shuffled array of card IDs.
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
 * @param cards - Array of card IDs to render.
 * @returns void
 */
function renderCards(cards: number[]): void {
  const board = document.getElementById("game-board")!;
  cards.forEach((num) => board.appendChild(createCardElement(num)));
}

/**
 * Creates a single card element using the active theme.
 *
 * @param num - The card ID.
 * @returns A fully initialized card element.
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
 * Used for debug keyboard shortcuts.
 *
 * @param screen - The result type to display.
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
 * Shuffles an array using the Fisher–Yates algorithm.
 *
 * @param array - The array to shuffle.
 * @returns The shuffled array.
 */
function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Determines the winner and renders the appropriate result screen.
 *
 * @returns void
 */
function showResultScreen(): void {
  const winner = getWinner();
  const screen = getScreenType(winner);

  const data = getWinnerScreenData(screen);
  renderWinnerScreen(data);

  if (data.showScoreboard) updateWinnerScoreboardIcons();
  attachWinnerBackButton();
}

/**
 * Determines the winner based on current scores.
 *
 * @returns "blue", "orange", or "draw".
 */
function getWinner(): "blue" | "orange" | "draw" {
  if (GAME_STATE.scoreBlue > GAME_STATE.scoreOrange) return "blue";
  if (GAME_STATE.scoreOrange > GAME_STATE.scoreBlue) return "orange";
  return "draw";
}

/**
 * Converts the winner into a result screen type.
 *
 * If the player loses, the "gameover" screen is shown instead.
 *
 * @param winner - The winner determined by getWinner().
 * @returns The screen type to render.
 */
function getScreenType(
  winner: "blue" | "orange" | "draw",
): "blue" | "orange" | "draw" | "gameover" {
  if (winner !== "draw" && winner !== GAME_STATE.selectedPlayer) {
    return "gameover";
  }
  return winner;
}
