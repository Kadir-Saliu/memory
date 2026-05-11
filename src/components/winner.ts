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
 * @param screen - The type of result screen to display ("blue", "orange", "draw", "gameover").
 * @returns An object containing theme, screen type, icon HTML, confetti HTML, and scoreboard visibility.
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
    showScoreboard: screen === "gameover",
  };
}

/**
 * Renders the winner screen by injecting the winner template into the app container.
 *
 * @param data - The winner screen data object created by getWinnerScreenData().
 */
export function renderWinnerScreen(data: any) {
  APP.innerHTML = getWinnerTemplate(data);
}

/**
 * Updates the scoreboard icons on the winner screen.
 * Ensures the icons match the active theme (gaming or code).
 */
export function updateWinnerScoreboardIcons() {
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
 * Resets game state and returns the user to the settings view.
 */
export function attachWinnerBackButton() {
  document.getElementById("back")!.addEventListener("click", () => {
    GAME_STATE.currentPlayer = "blue";
    GAME_STATE.scoreBlue = 0;
    GAME_STATE.scoreOrange = 0;

    import("../views/setting-view").then((m) => m.renderSettings());
  });
}
