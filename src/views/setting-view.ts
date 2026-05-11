import { APP } from "../app";
import { GAME_STATE } from "../state/state";
import { renderGameBoard } from "../views/game-view";

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
 * Returns the full HTML template for the Settings screen.
 *
 * The template includes:
 * - Theme selection (code / gaming)
 * - Player selection (blue / orange)
 * - Board size selection (16 / 24 / 36 cards)
 * - Preview image that updates on hover and selection
 * - Summary line showing current selections
 * - Start button (enabled only when all selections are made)
 *
 * @returns A complete HTML string for the settings view.
 */
function getSettingsTemplate(): string {
  return `
    <section class="settings container">

      <div class="settings__title-block">
        <h2 class="settings__title">Settings</h2>

        <svg class="settings__underline" width="263" height="24" viewBox="0 0 263 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-0.000152588 11.547L11.5469 23.094L23.0939 11.547L11.5469 -8.58307e-06L-0.000152588 11.547ZM262.547 11.547V9.547L11.5469 9.547V11.547V13.547L262.547 13.547V11.547Z" fill="#F0EA6E"/>
        </svg>
      </div>

      <div class="settings__layout">

        <div class="settings__left">

          <div class="settings__group">
            <div class="settings__header">
              <img src="./game-theme-icon.png" alt="Game theme icon">
              <h3 class="settings__subtitle">Game themes</h3>
            </div>

            <div class="settings__options">
              <div class="settings__option" data-theme="code">
                <span class="settings__checkbox"></span>
                <span class="settings__label">Code vibes theme</span>
              </div>

              <div class="settings__option" data-theme="gaming">
                <span class="settings__checkbox"></span>
                <span class="settings__label">Gaming theme</span>
              </div>
            </div>
          </div>

          <div class="settings__group">
            <div class="settings__header">
              <img src="./choose-player-icon.png" alt="Choose player icon">
              <h3 class="settings__subtitle">Choose player</h3>
            </div>

            <div class="settings__options">
              <div class="settings__option" data-player="blue">
                <span class="settings__checkbox"></span>
                <span class="settings__label">Blue</span>
              </div>

              <div class="settings__option" data-player="orange">
                <span class="settings__checkbox"></span>
                <span class="settings__label">Orange</span>
              </div>
            </div>
          </div>

          <div class="settings__group">
            <div class="settings__header">
              <img src="./board-size-icon.png" alt="Board size icon">
              <h3 class="settings__subtitle">Board size</h3>
            </div>

            <div class="settings__options">
              <div class="settings__option" data-size="16">
                <span class="settings__checkbox"></span>
                <span class="settings__label">16 cards</span>
              </div>

              <div class="settings__option" data-size="24">
                <span class="settings__checkbox"></span>
                <span class="settings__label">24 cards</span>
              </div>

              <div class="settings__option" data-size="36">
                <span class="settings__checkbox"></span>
                <span class="settings__label">36 cards</span>
              </div>
            </div>
          </div>

        </div>

        <div class="settings__right">

          <div class="settings__preview">
            <img id="preview-img" src="./preview/code-theme.png" alt="Preview">
          </div>

          <div class="settings__summary">
            <p id="summary-line">Theme / Player / Board size</p>

            <button id="start-game" class="settings__start-btn" disabled>
              <img src="./playbutton.svg" class="start-icon" alt="">
              Start
            </button>
          </div>

        </div>

      </div>

    </section>
  `;
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
 * Handles hover preview for theme options.
 *
 * On hover:
 * - The preview image updates to the hovered theme
 *
 * On mouse leave:
 * - The preview resets to the currently selected theme
 *
 * @returns void
 */
function initThemePreview(): void {
  const previewImg = document.getElementById("preview-img") as HTMLImageElement;
  const themeOptions = document.querySelectorAll(".settings__option[data-theme]");

  themeOptions.forEach((opt) => {
    const theme = opt.getAttribute("data-theme");

    opt.addEventListener("mouseenter", () => {
      previewImg.src = `./preview/${theme}-theme.png`;
    });

    opt.addEventListener("mouseleave", () => {
      const activeTheme =
        document
          .querySelector(".settings__option[data-theme].is-active")
          ?.getAttribute("data-theme") ?? "code";

      previewImg.src = `./preview/${activeTheme}-theme.png`;
    });
  });
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
  const theme = document.querySelector(".settings__option[data-theme].is-active")?.textContent?.trim() ?? "Theme";
  const player = document.querySelector(".settings__option[data-player].is-active")?.textContent?.trim() ?? "Player";
  const size = document.querySelector(".settings__option[data-size].is-active")?.textContent?.trim() ?? "Board size";

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

  const themeEl = document.querySelector(".settings__option[data-theme].is-active");
  const playerEl = document.querySelector(".settings__option[data-player].is-active");
  const sizeEl = document.querySelector(".settings__option[data-size].is-active");

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
