import { APP } from "../app";

/**
 * Renders the Settings screen into the main application container.
 * Injects the HTML template and initializes all event listeners.
 */
export function renderSettings(): void {
  APP.innerHTML = getSettingsTemplate();
  initSettingsEvents();
}

/**
 * Returns the full HTML template for the Settings screen.
 * Includes theme selection, player selection, board size selection,
 * preview image, summary line, and start button.
 *
 * @returns The complete HTML markup for the settings view.
 */
function getSettingsTemplate(): string {
  return `
    <section class="settings">

   <div class="settings__title-block">
  <h2 class="settings__title">Settings</h2>

  <svg class="settings__underline" width="263" height="24" viewBox="0 0 263 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M-0.000152588 11.547L11.5469 23.094L23.0939 11.547L11.5469 -8.58307e-06L-0.000152588 11.547ZM262.547 11.547V9.547L11.5469 9.547V11.547V13.547L262.547 13.547V11.547Z" fill="#F0EA6E"/>
  </svg>
</div>


      <div class="settings__layout">

        <!-- LEFT SIDE -->
        <div class="settings__left">

          <!-- GAME THEMES -->
          <div class="settings__group">
            <div class="settings__header">
              <img src="/game-theme-icon.png" alt="Game theme icon">
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

          <!-- PLAYER -->
          <div class="settings__group">
            <div class="settings__header">
              <img src="/choose-player-icon.png" alt="Choose player icon">
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

          <!-- BOARD SIZE -->
          <div class="settings__group">
            <div class="settings__header">
              <img src="/board-size-icon.png" alt="Board size icon">
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

        <!-- RIGHT SIDE -->
        <div class="settings__right">

          <div class="settings__preview">
            <img id="preview-img" src="/preview/code-theme.png" alt="Preview">
          </div>

          <div class="settings__summary">
            <p id="summary-line">Theme / Player / Board size</p>

            <button id="start-game" class="settings__start-btn" disabled>
              <img src="/playbutton.svg" class="start-icon" alt="">
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
 * Handles:
 * - Click selection for theme, player, and board size
 * - Hover preview for themes
 * - Summary updates
 * - Start button activation and navigation
 */
function initSettingsEvents(): void {
  const optionGroups = document.querySelectorAll(".settings__options");
  const previewImg = document.getElementById("preview-img") as HTMLImageElement;
  const startBtn = document.getElementById("start-game") as HTMLButtonElement;

  optionGroups.forEach((group) => {
    group.addEventListener("click", (e) => {
      const option = (e.target as HTMLElement).closest(".settings__option");
      if (!option) return;

      group.querySelectorAll(".settings__option").forEach((opt) => {
        opt.classList.remove("is-active");
      });

      option.classList.add("is-active");

      updateSummary(option as HTMLElement);
    });
  });

  const themeOptions = document.querySelectorAll(
    ".settings__option[data-theme]",
  );

  themeOptions.forEach((opt) => {
    const theme = opt.getAttribute("data-theme");

    opt.addEventListener("mouseenter", () => {
      previewImg.src = `/preview/${theme}-theme.png`;
    });

    opt.addEventListener("mouseleave", () => {
      const activeTheme = document
        .querySelector(".settings__option[data-theme].is-active")
        ?.getAttribute("data-theme");

      if (activeTheme) {
        previewImg.src = `/preview/${activeTheme}-theme.png`;
      } else {
        previewImg.src = `/preview/code-theme.png`;
      }
    });
  });

  startBtn.addEventListener("click", () => {
    if (startBtn.disabled) return;
    saveSettingsToState();
    renderGameBoard();
  });
}

/**
 * Updates the summary line and preview image based on the selected option.
 * Enables the Start button once all required selections are made.
 *
 * @param option The clicked settings option element.
 */
function updateSummary(option: HTMLElement) {
  const summaryLine = document.getElementById("summary-line")!;
  const previewImg = document.getElementById("preview-img") as HTMLImageElement;
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

  const theme = themeEl?.textContent?.trim() || "Theme";
  const player = playerEl?.textContent?.trim() || "Player";
  const size = sizeEl?.textContent?.trim() || "Board size";

  if (option.dataset.theme) {
    previewImg.src = `/preview/${option.dataset.theme}-theme.png`;
  }

  summaryLine.innerHTML = `
    ${theme}
    <span class="separator">/</span>
    ${player}
    <span class="separator">/</span>
    ${size}
  `;

  if (themeEl && playerEl && sizeEl) {
    startBtn.disabled = false;
  } else {
    startBtn.disabled = true;
  }
}

import { GAME_STATE } from "../state/state";
import { renderGameBoard } from "../views/game-view";

/**
 * Saves the selected settings (theme, player, board size)
 * into the global GAME_STATE object.
 */
function saveSettingsToState() {
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
