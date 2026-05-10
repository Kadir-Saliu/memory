import { GAME_STATE } from "../state/state";
import { updatePlayerHUD } from "../components/hud";

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard = false;

// Will be set by game-view.ts
let onGameOver: () => void = () => {};

/**
 * Registers a callback that is executed when the game ends.
 * This is provided by game-view.ts to avoid circular dependencies.
 */
export function setGameOverCallback(cb: () => void) {
  onGameOver = cb;
}

/**
 * Handles a click on a card.
 * Prevents interaction when the board is locked or the same card is clicked twice.
 */
export function handleCardClick(card: HTMLElement) {
  if (lockBoard) return;
  if (card === firstCard) return;
  flipCard(card);
}

/**
 * Flips a card and determines whether it is the first or second card in a pair.
 * If it is the second card, matching logic is triggered.
 */
function flipCard(card: HTMLElement) {
  card.classList.add("is-flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  checkMatch();
}

/**
 * Checks whether the two flipped cards match.
 * Handles both match and mismatch scenarios.
 */
function checkMatch() {
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

/**
 * Disables pointer events on matched cards to prevent further interaction.
 */
function disableMatchedCards() {
  firstCard!.style.pointerEvents = "none";
  secondCard!.style.pointerEvents = "none";
}

/**
 * Unflips the two selected cards after a short delay.
 * Used when the cards do not match.
 */
function unflipCards() {
  setTimeout(() => {
    firstCard!.classList.remove("is-flipped");
    secondCard!.classList.remove("is-flipped");
    resetTurn();
  }, 1000);
}

/**
 * Resets the card selection state and unlocks the board.
 */
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

/**
 * Updates the score of the current player and refreshes the HUD.
 */
function updateScore() {
  if (GAME_STATE.currentPlayer === "blue") GAME_STATE.scoreBlue++;
  else GAME_STATE.scoreOrange++;

  updatePlayerHUD();
}

/**
 * Checks whether all card pairs have been found.
 * If so, triggers the game-over callback.
 */
function checkGameOver() {
  const totalPairs = GAME_STATE.size / 2;
  const foundPairs = GAME_STATE.scoreBlue + GAME_STATE.scoreOrange;

  if (foundPairs !== totalPairs) return;

  // GameView decides which result screen to show
  onGameOver();
}

/**
 * Switches the active player and updates the HUD.
 */
function switchPlayer() {
  GAME_STATE.currentPlayer =
    GAME_STATE.currentPlayer === "blue" ? "orange" : "blue";

  updatePlayerHUD();
}
