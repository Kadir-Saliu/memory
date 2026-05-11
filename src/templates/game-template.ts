/**
 * Generates the full HTML structure for the game screen.
 *
 * The returned template includes:
 *
 * - A `<main>` wrapper containing the active theme class (`game--{theme}`)
 * - A `<section>` containing:
 *   - The HUD (player scores, current player indicator, exit button)
 *   - The game board container where all cards will be rendered
 *
 * Theme handling:
 * - The `game--{theme}` class is applied to both `<main>` and `<section>`
 *   to ensure consistent theme‑dependent styling across the entire screen.
 *
 * @param theme - The active theme (`"code"` or `"gaming"`), used to apply
 *                theme‑specific styling to the game layout.
 *
 * @returns A complete HTML string representing the game screen layout.
 */
export function getGameTemplate(theme: string): string {
  return `
  <main class="game--${theme}">
    <section class="game game--${theme} container">

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
  </main>
  `;
}
