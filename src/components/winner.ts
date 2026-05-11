import { GAME_STATE } from "../state/state";
import {
  WINNER_ICONS_GAMING,
  WINNER_ICONS_CODE,
} from "../constants/winner-icons";
import { getWinnerTemplate } from "../templates/winner-template";
import { getHUDIcons } from "./hud";
import { APP } from "../app";

/**
 * Builds all data required to render the winner screen.
 *
 * This function prepares all dynamic values needed by the winner template:
 *
 * - The active theme (`code` or `gaming`)
 * - The result type (`blue`, `orange`, `draw`, `gameover`)
 * - The correct winner icon for the selected theme
 * - Optional confetti (only for winning screens in the code theme)
 * - Final scores for both players
 * - Whether the scoreboard should be shown (only in gameover mode)
 *
 * @param screen - The result type to display.
 * @returns An object containing all data required by the winner template.
 */
export function getWinnerScreenData(
  screen: "blue" | "orange" | "draw" | "gameover",
) {
  const theme = GAME_STATE.theme;
  const ICONS = theme === "gaming" ? WINNER_ICONS_GAMING : WINNER_ICONS_CODE;

  const confetti =
    (screen === "blue" || screen === "orange") && theme === "code"
      ? `<img class="confetti" src="./images/confetti.png">`
      : "";

  const icon =
    screen === "gameover"
      ? ""
      : `<img class="winner-icon" src="${ICONS[screen]}">`;

  return {
    theme,
    screen,
    icon,
    confetti,
    scoreBlue: GAME_STATE.scoreBlue,
    scoreOrange: GAME_STATE.scoreOrange,
    showScoreboard: screen === "gameover",
  };
}

/**
 * Renders the winner screen by injecting the generated HTML
 * into the main application container.
 *
 * @param data - The winner screen data object created by getWinnerScreenData().
 * @returns void
 */
export function renderWinnerScreen(data: any): void {
  APP.innerHTML = getWinnerTemplate(data);
}

/**
 * Updates the scoreboard icons on the winner screen.
 *
 * Ensures that the icons match the active theme by loading
 * the correct HUD icon set and injecting them into the scoreboard.
 *
 * @returns void
 */
export function updateWinnerScoreboardIcons(): void {
  const HUD_ICONS = getHUDIcons();

  const blueIcon = document.querySelector(
    "#score-blue .score-icon",
  ) as HTMLElement;
  const orangeIcon = document.querySelector(
    "#score-orange .score-icon",
  ) as HTMLElement;

  if (blueIcon) blueIcon.innerHTML = HUD_ICONS.blue;
  if (orangeIcon) orangeIcon.innerHTML = HUD_ICONS.orange;
}

/**
 * Attaches the click handler for the "Back" button on the winner screen.
 *
 * When clicked:
 * - Resets the game state (current player + scores)
 * - Navigates back to the settings screen
 *
 * @returns void
 */
export function attachWinnerBackButton(): void {
  document.getElementById("back")!.addEventListener("click", () => {
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;

    import("../views/setting-view").then((m) => m.renderSettings());
  });
}
