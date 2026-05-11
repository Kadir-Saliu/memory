/**
 * Generates the complete HTML structure for the winner screen.
 *
 * This template is rendered after a game ends and adapts dynamically based on:
 *
 * - **Result type** (`blue`, `orange`, `draw`, `gameover`)
 * - **Active theme** (`code` or `gaming`)
 * - **Whether the final scoreboard should be displayed**
 * - **Optional confetti** (used only in some code‑theme winner screens)
 * - **Winner icon** (hidden in gameover mode)
 *
 * Structure:
 * - `<main>` wrapper with a theme‑dependent class (`winner-screen--{theme}`)
 * - `<section>` containing all winner screen UI elements
 * - Optional confetti markup
 * - Dynamic title (winner name, draw, or game over)
 * - Optional scoreboard (only in gameover mode)
 * - Navigation button to return to home/settings
 *
 * @param options - Configuration object for rendering the winner screen.
 * @param options.theme - The active theme (`"code"` or `"gaming"`).
 *                        Used to apply theme‑specific styling to `<main>`.
 * @param options.screen - The result type:
 *                        - `"blue"` → Blue player wins
 *                        - `"orange"` → Orange player wins
 *                        - `"draw"` → No winner
 *                        - `"gameover"` → Player lost
 * @param options.icon - HTML string for the winner icon.
 *                       Empty when `screen === "gameover"`.
 * @param options.confetti - HTML string for confetti animations.
 *                           Only used in some code‑theme winner screens.
 * @param options.showScoreboard - Whether the final score section should be shown.
 *                                 Only true in `"gameover"` mode.
 * @param options.scoreBlue - Final score of the blue player.
 * @param options.scoreOrange - Final score of the orange player.
 *
 * @returns A complete HTML string containing the full winner screen layout.
 */
export function getWinnerTemplate(options: {
  theme: string;
  screen: "blue" | "orange" | "draw" | "gameover";
  icon: string;
  confetti: string;
  showScoreboard: boolean;
  scoreBlue: number;
  scoreOrange: number;
}): string {
  const { theme, screen, icon, confetti, showScoreboard } = options;

  return `
  <main class="winner-screen--${theme}">
    <section class="winner-screen winner-screen--${theme} container">
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
        showScoreboard
          ? `
          <p class="final-score">Final Score</p>
          <div class="hud__scores">
            <div id="score-blue" class="game__score player--blue">
              <span class="score-icon"></span>
              <span class="score-text">${options.scoreBlue}</span>
            </div>
            <div id="score-orange" class="game__score player--orange">
              <span class="score-icon"></span>
              <span class="score-text">${options.scoreOrange}</span>
            </div>
          </div>
        `
          : icon
      }

      <div class="winner-buttons">
        <button id="back">${theme === "gaming" ? "Home" : "Back to start"}</button>
      </div>
    </section>
  </main>
  `;
}
