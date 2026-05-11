import { GAME_STATE } from "../state/state";

/**
 * Icon set used when the "gaming" theme is active.
 * Each property contains an HTML string representing an icon.
 */
const ICONS_GAMING = {
  blue: `<img src="./images/icons/blue-game-theme-icon.png" class="hud-icon">`,
  orange: `<img src="./images/icons/orange-game-theme-icon.png" class="hud-icon">`,
  currentBlue: `<img src="./images/icons/white-game-theme-icon.png">`,
  currentOrange: `<img src="./images/icons/white-game-theme-icon.png">`,
  exit: `<img src="./images/tags/exit-icon-code.png" class="hud-icon">`,
};

/**
 * Icon set used when the "code" theme is active.
 * Each property contains an HTML string representing an icon.
 */
const ICONS_CODE = {
  blue: `<img src="./images/tags/blue-tag-code.png" class="hud-icon">`,
  orange: `<img src="./images/tags/orange-tag-code.png" class="hud-icon">`,
  currentBlue: `<img src="./images/tags/blue-tag-code.png" class="hud-icon">`,
  currentOrange: `<img src="./images/tags/orange-tag-code.png" class="hud-icon">`,
  exit: `<img src="./images/tags/exit-icon-code.png" class="hud-icon">`,
};

/**
 * Returns the correct HUD icon set depending on the currently selected theme.
 *
 * @returns An object containing HTML icon strings for the active theme.
 */
export function getHUDIcons() {
  return GAME_STATE.theme === "gaming" ? ICONS_GAMING : ICONS_CODE;
}

/**
 * Updates all HUD elements:
 * - Blue player score
 * - Orange player score
 * - Current player indicator
 * - Exit button icon and label
 *
 * This function delegates the work to smaller update functions.
 */
export function updatePlayerHUD(): void {
  const ICONS = getHUDIcons();
  updateBlueScore(ICONS);
  updateOrangeScore(ICONS);
  updateCurrentPlayer(ICONS);
  updateExitButton(ICONS);
}

/**
 * Updates the blue player's score display, including icon and text.
 *
 * @param ICONS - The active icon set returned by getHUDIcons().
 */
function updateBlueScore(ICONS: any) {
  const el = document.querySelector("#score-blue")!;
  el.querySelector(".score-icon")!.innerHTML = ICONS.blue;
  el.querySelector(".score-text")!.textContent =
    GAME_STATE.theme === "gaming"
      ? `${GAME_STATE.scoreBlue}`
      : `Blue ${GAME_STATE.scoreBlue}`;
}

/**
 * Updates the orange player's score display, including icon and text.
 *
 * @param ICONS - The active icon set returned by getHUDIcons().
 */
function updateOrangeScore(ICONS: any) {
  const el = document.querySelector("#score-orange")!;
  el.querySelector(".score-icon")!.innerHTML = ICONS.orange;
  el.querySelector(".score-text")!.textContent =
    GAME_STATE.theme === "gaming"
      ? `${GAME_STATE.scoreOrange}`
      : `Orange ${GAME_STATE.scoreOrange}`;
}

/**
 * Updates the current player indicator:
 * - Text label
 * - Icon
 * - Color class (player--blue / player--orange)
 *
 * @param ICONS - The active icon set returned by getHUDIcons().
 */
function updateCurrentPlayer(ICONS: any) {
  const el = document.querySelector("#current-player")!;
  el.querySelector(".current-text")!.textContent = "Current Player:";
  el.querySelector(".current-icon")!.innerHTML =
    GAME_STATE.currentPlayer === "blue"
      ? ICONS.currentBlue
      : ICONS.currentOrange;

  el.classList.remove("player--blue", "player--orange");
  el.classList.add(
    GAME_STATE.currentPlayer === "blue" ? "player--blue" : "player--orange",
  );
}

/**
 * Updates the exit button:
 * - Icon
 * - Text label
 *
 * @param ICONS - The active icon set returned by getHUDIcons().
 */
function updateExitButton(ICONS: any) {
  const exitBtn = document.querySelector(".game__exit")!;
  exitBtn.querySelector(".exit-icon")!.innerHTML = ICONS.exit;
  exitBtn.querySelector(".exit-text")!.textContent = "Exit Game";
}
