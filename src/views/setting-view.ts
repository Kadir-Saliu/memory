import { APP } from "../app";
import { GAME_STATE } from "../state/state";
import { renderGameBoard } from "../views/game-view";
import { getSettingsTemplate } from "../templates/settings-template";

/**
 * Renders the Settings screen into the main application container.
 * Injects the HTML template and initializes all event listeners.
 *
 * @returns void
 */
export function renderSettings(): void {
  APP.innerHTML = getSettingsTemplate();
  initSettingsEvents();
}

/**
 * Initializes all event listeners for the Settings screen.
 *
 * This includes:
 * - Option selection (theme, player, board size)
 * - Theme preview hover behavior
 * - Start button activation and navigation
 *
 * @returns void
 */
function initSettingsEvents(): void {
  initOptionSelection();
  initThemePreview();
  initStartButton();
}

/**
 * Handles click selection for all option groups.
 *
 * When an option is clicked:
 * - All other options in the same group are deactivated
 * - The clicked option becomes active
 * - The summary and preview are updated
 *
 * @returns void
 */
function initOptionSelection(): void {
  const optionGroups = document.querySelectorAll(".settings__options");

  optionGroups.forEach((group) => {
    group.addEventListener("click", (e) => {
      const option = (e.target as HTMLElement).closest(".settings__option");
      if (!option) return;

      group
        .querySelectorAll(".settings__option")
        .forEach((opt) => opt.classList.remove("is-active"));

      option.classList.add("is-active");
      updateSummary(option as HTMLElement);
    });
  });
}

/**
 * Initialisiert die Hover‑Preview für Theme‑Optionen.
 *
 * Fügt allen Theme‑Optionen Mouseenter/Mousleave‑Events hinzu,
 * um das Preview‑Bild dynamisch zu aktualisieren.
 */
function initThemePreview(): void {
  const previewImg = document.getElementById("preview-img") as HTMLImageElement;

  document
    .querySelectorAll<HTMLElement>(".settings__option[data-theme]")
    .forEach((opt) => {
      opt.addEventListener("mouseenter", () =>
        setPreview(opt.dataset.theme!, previewImg),
      );
      opt.addEventListener("mouseleave", () => resetPreview(previewImg));
    });
}

/**
 * Setzt das Preview‑Bild auf das übergebene Theme.
 *
 * @param theme - Der Theme‑Name (z. B. "code" oder "gaming").
 * @param img - Das Preview‑Image‑Element.
 */
function setPreview(theme: string, img: HTMLImageElement): void {
  img.src = `./preview/${theme}-theme.png`;
}

/**
 * Stellt das Preview‑Bild auf das aktuell ausgewählte Theme zurück.
 *
 * @param img - Das Preview‑Image‑Element.
 */
function resetPreview(img: HTMLImageElement): void {
  const active =
    document.querySelector<HTMLElement>(
      ".settings__option[data-theme].is-active",
    )?.dataset.theme ?? "code";
  img.src = `./preview/${active}-theme.png`;
}

/**
 * Handles start button activation and navigation to the game screen.
 *
 * When clicked:
 * - Validates that all required selections are made
 * - Saves settings into GAME_STATE
 * - Navigates to the game view
 *
 * @returns void
 */
function initStartButton(): void {
  const startBtn = document.getElementById("start-game") as HTMLButtonElement;

  startBtn.addEventListener("click", () => {
    if (startBtn.disabled) return;
    saveSettingsToState();
    renderGameBoard();
  });
}

/**
 * Updates preview image, summary line, and start button state
 * after an option is selected.
 *
 * @param option - The clicked settings option element.
 * @returns void
 */
function updateSummary(option: HTMLElement): void {
  updatePreviewImage(option);
  updateSummaryLine();
  updateStartButtonState();
}

/**
 * Updates the preview image based on the selected or hovered theme.
 *
 * @param option - The clicked settings option element.
 * @returns void
 */
function updatePreviewImage(option: HTMLElement): void {
  const previewImg = document.getElementById("preview-img") as HTMLImageElement;

  if (option.dataset.theme) {
    previewImg.src = `./preview/${option.dataset.theme}-theme.png`;
    return;
  }

  const activeTheme =
    document
      .querySelector(".settings__option[data-theme].is-active")
      ?.getAttribute("data-theme") ?? "code";

  previewImg.src = `./preview/${activeTheme}-theme.png`;
}

/**
 * Updates the summary line text based on the currently active selections.
 *
 * @returns void
 */
function updateSummaryLine(): void {
  const summaryLine = document.getElementById("summary-line")!;
  const theme =
    document
      .querySelector(".settings__option[data-theme].is-active")
      ?.textContent?.trim() ?? "Theme";
  const player =
    document
      .querySelector(".settings__option[data-player].is-active")
      ?.textContent?.trim() ?? "Player";
  const size =
    document
      .querySelector(".settings__option[data-size].is-active")
      ?.textContent?.trim() ?? "Board size";

  summaryLine.innerHTML = `
    ${theme}
    <span class="separator">/</span>
    ${player}
    <span class="separator">/</span>
    ${size}
  `;
}

/**
 * Enables or disables the start button depending on whether
 * all required selections (theme, player, size) are active.
 *
 * @returns void
 */
function updateStartButtonState(): void {
  const startBtn = document.getElementById("start-game") as HTMLButtonElement;

  const themeEl = document.querySelector(
    ".settings__option[data-theme].is-active",
  );
  const playerEl = document.querySelector(
    ".settings__option[data-player].is-active",
  );
  const sizeEl = document.querySelector(
    ".settings__option[data-size].is-active",
  );

  startBtn.disabled = !(themeEl && playerEl && sizeEl);
}

/**
 * Saves the selected settings (theme, player, board size)
 * into the global GAME_STATE object.
 *
 * @returns void
 */
function saveSettingsToState(): void {
  GAME_STATE.theme =
    document
      .querySelector(".settings__option[data-theme].is-active")
      ?.getAttribute("data-theme") || "code";

  GAME_STATE.selectedPlayer = document
    .querySelector(".settings__option[data-player].is-active")
    ?.getAttribute("data-player") as "blue" | "orange";

  GAME_STATE.size = Number(
    document
      .querySelector(".settings__option[data-size].is-active")
      ?.getAttribute("data-size") || 16,
  );
}
