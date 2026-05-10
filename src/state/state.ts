/**
 * Global game state container.
 *
 * Holds all runtime values that control:
 * - The active theme ("code" or "gaming")
 * - The selected player at the start of the game
 * - The board size (number of cards)
 * - The current active player
 * - Both player scores
 * - The initially chosen player (used for gameover logic)
 *
 * This object is mutated throughout the game and shared across all views.
 */
export const GAME_STATE = {
  theme: "code",
  player: "blue",
  size: 16,
  currentPlayer: "blue",
  scoreBlue: 0,
  scoreOrange: 0,
  selectedPlayer: "blue",
};
