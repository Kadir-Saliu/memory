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
export function getSettingsTemplate(): string {
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
