/**
 * Returns the full HTML structure for the game view.
 *
 * The template includes:
 * - The HUD (scores, current player, exit button)
 * - The game board container where cards will be rendered
 * - Theme‑dependent styling via the `game--{theme}` class
 *
 * @param theme - The active theme ("code" or "gaming"), used to apply theme-specific styling.
 * @returns A string containing the complete HTML layout for the game screen.
 */
export function getGameTemplate(theme: string): string {
  return `
<section class="game game--${theme}">

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
