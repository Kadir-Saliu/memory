import { GAME_STATE } from "../state/state";
import { updatePlayerHUD } from "../components/hud";

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard = false;

// Will be set by game-view.ts
let onGameOver: () => void = () => {};

/**
 * Registers a callback that is executed when the game ends.
 *
 * This callback is provided by `game-view.ts` to avoid circular dependencies.
 * When all card pairs are found, this callback is triggered to display
 * the appropriate winner or game-over screen.
 *
 * @param cb - The function to execute when the game ends.
 * @returns void
 */
export function setGameOverCallback(cb: () => void): void {
  onGameOver = cb;
}

/**
 * Handles a click on a card.
 *
 * Prevents interaction when:
 * - The board is locked (waiting for animations)
 * - The same card is clicked twice
 *
 * If valid, the clicked card is flipped.
 *
 * @param card - The clicked card element.
 * @returns void
 */
export function handleCardClick(card: HTMLElement): void {
  if (lockBoard) return;
  if (card === firstCard) return;
  flipCard(card);
}

/**
 * Flips a card and determines whether it is the first or second card in a pair.
 *
 * - First card → stored and waiting for second card
 * - Second card → triggers match checking
 *
 * @param card - The card element to flip.
 * @returns void
 */
function flipCard(card: HTMLElement): void {
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
 *
 * - If they match → disable them, update score, check game over
 * - If not → unflip them after a delay and switch player
 *
 * @returns void
 */
function checkMatch(): void {
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
  }
}

/**
 * Disables pointer events on matched cards to prevent further interaction.
 *
 * @returns void
 */
function disableMatchedCards(): void {
  firstCard!.style.pointerEvents = "none";
  secondCard!.style.pointerEvents = "none";
}

/**
 * Unflips the two selected cards after a short delay.
 *
 * Used when the cards do not match.
 * After unflipping, the active player is switched.
 *
 * @returns void
 */
function unflipCards(): void {
  setTimeout(() => {
    firstCard!.classList.remove("is-flipped");
    secondCard!.classList.remove("is-flipped");
    resetTurn();
    switchPlayer();
  }, 1000);
}

/**
 * Resets the card selection state and unlocks the board.
 *
 * @returns void
 */
function resetTurn(): void {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

/**
 * Updates the score of the current player and refreshes the HUD.
 *
 * @returns void
 */
function updateScore(): void {
  if (GAME_STATE.currentPlayer === "blue") GAME_STATE.scoreBlue++;
  else GAME_STATE.scoreOrange++;

  updatePlayerHUD();
}

/**
 * Checks whether all card pairs have been found.
 *
 * If all pairs are matched, the game-over callback is triggered.
 *
 * @returns void
 */
function checkGameOver(): void {
  const totalPairs = GAME_STATE.size / 2;
  const foundPairs = GAME_STATE.scoreBlue + GAME_STATE.scoreOrange;

  if (foundPairs !== totalPairs) return;

  onGameOver();
}

/**
 * Switches the active player and updates the HUD.
 *
 * @returns void
 */
function switchPlayer(): void {
  GAME_STATE.currentPlayer =
    GAME_STATE.currentPlayer === "blue" ? "orange" : "blue";

  updatePlayerHUD();
}
