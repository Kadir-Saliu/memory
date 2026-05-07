import { APP } from "../app";

export function renderSettings(): void {
  APP.innerHTML = getSettingsTemplate();
  initSettingsEvents();
}

function getSettingsTemplate(): string {
  return `
    <section class="settings">

      <h2 class="settings__title">Settings</h2>

      <div class="settings__layout">

        <!-- LEFT SIDE -->
        <div class="settings__left">

          <!-- GAME THEMES -->
          <div class="settings__group">
            <div class="settings__header">
              <img src="/game-theme-icon.png" alt="">
              <h3 class="settings__subtitle">Game themes</h3>
            </div>

            <div class="settings__options">

              <div class="settings__option is-active" data-theme="code">
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
              <img src="/choose-player-icon.png" alt="">
              <h3 class="settings__subtitle">Choose player</h3>
            </div>

            <div class="settings__options">

              <div class="settings__option is-active" data-player="blue">
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
              <img src="/board-size-icon.png" alt="">
              <h3 class="settings__subtitle">Board size</h3>
            </div>

            <div class="settings__options">

              <div class="settings__option is-active" data-size="16">
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
  <p id="summary-line">Code vibes theme / Blue / 16 cards</p>

  <button id="start-game" class="settings__start-btn">
    <img src="/playbutton.svg" class="start-icon" alt="">
    Start
  </button>
</div>

        </div>

      </div>

    </section>
  `;
}

function initSettingsEvents(): void {
  const optionGroups = document.querySelectorAll(".settings__options");

  optionGroups.forEach((group) => {
    group.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      const option = target.closest(".settings__option");
      if (!option) return;

      // Reset
      group.querySelectorAll(".settings__option").forEach((opt) => {
        opt.classList.remove("is-active");
      });

      // Activate
      option.classList.add("is-active");

      // Update summary + preview
      updateSummary(option as HTMLElement);
    });
  });
}

function updateSummary(option: HTMLElement) {
  const summaryLine = document.getElementById("summary-line")!;
  const previewImg = document.getElementById("preview-img") as HTMLImageElement;

  const theme =
    document
      .querySelector(".settings__option[data-theme].is-active")
      ?.textContent?.trim() || "Code vibes theme";
  const player =
    document
      .querySelector(".settings__option[data-player].is-active")
      ?.textContent?.trim() || "Blue";
  const size =
    document
      .querySelector(".settings__option[data-size].is-active")
      ?.textContent?.trim() || "16 cards";

  // Preview aktualisieren
  if (option.dataset.theme) {
    previewImg.src = `/preview/${option.dataset.theme}-theme.png`;
  }

  // Summary aktualisieren
  summaryLine.innerHTML = `
  ${theme}
  <span class="separator">/</span>
  ${player}
  <span class="separator">/</span>
  ${size}
`;
}
