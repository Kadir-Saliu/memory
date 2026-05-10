/**
 * Generates the complete HTML template for the winner screen.
 *
 * The template dynamically adjusts based on:
 * - The result type (blue, orange, draw, gameover)
 * - The active theme ("code" or "gaming")
 * - Whether the scoreboard should be shown (only in gameover mode)
 * - Optional confetti for winning screens in the code theme
 * - The correct winner icon for the selected theme
 *
 * @param options - Configuration object containing:
 *  - theme: Active theme ("code" or "gaming")
 *  - screen: Result type ("blue" | "orange" | "draw" | "gameover")
 *  - icon: HTML string for the winner icon (empty for gameover)
 *  - confetti: HTML string for confetti (only shown in some cases)
 *  - showScoreboard: Whether to display the final score section
 *
 * @returns A string containing the full HTML structure of the winner screen.
 */
export function getWinnerTemplate(options: {
  theme: string;
  screen: "blue" | "orange" | "draw" | "gameover";
  icon: string;
  confetti: string;
  showScoreboard: boolean;
}): string {
  const { theme, screen, icon, confetti, showScoreboard } = options;

  return `
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
    showScoreboard
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
    <button id="back">${theme === "gaming" ? "Home" : "Back to start"}</button>
  </div>
</section>
  `;
}
